import {
  ArrayCamera,
  BufferGeometry,
  Camera,
  Frustum,
  Geometry,
  Group,
  ImmediateRenderObject,
  Light,
  Material,
  Matrix4,
  Object3D,
  Renderer,
  RenderItem,
  Scene,
  Skeleton,
  Vector3,
  WebGLRenderer,
} from "three";
import setTransformFromMatrix, {
  hasUvs,
  hasPositions,
  isArrayCamera,
  isGroup,
  isImmediateRenderObject,
  isLight,
  isLine,
  isLOD,
  isMesh,
  isPoints,
  isSkinnedMesh,
  isSprite,
  copyPositionsToVertexArray,
  createVertexArray,
  copyUvsToVertexArray,
  hasNormals,
  copyNormalsToVertexArray,
  isPointLight,
  isDirectionalLight,
} from "./utils";
import { WebGLRenderState, WebGLRenderStates } from "./WebGLRenderStates";
import { WebGLInfo } from "./WebGLInfo";
import { WebGLRenderList, WebGLRenderLists } from "./WebGLRenderLists";
import ModelRepository from "./ModelRepository";
import { isShadowMapMaterial, ShadowMapMaterial } from "./ShadwMapMaterial";

import { isEditorBasicMaterial } from "./editor/EditorBasicMaterial";
import { BasicMaterial, isBasicMaterial } from "./BasicMaterial";

type WithFrame<T> = T & { frame: any };

const TU_SHADOWMAP0 = 2;
const TU_SHADOWMAP1 = 4;
const TU_SHADOWMAP2 = 6;
const TU_SHADOWMAP3 = 8;
const TU_SHADOWMAP = [
  TU_SHADOWMAP0,
  TU_SHADOWMAP1,
  TU_SHADOWMAP2,
  TU_SHADOWMAP3,
];
const TU_SPECULARMAP = 10;
const TU_NORMALMAP = 12;

export default class SphereRenderer implements Renderer {
  domElement: any;
  private sortObjects = false;
  private projScreenMatrix: Matrix4 = new Matrix4();
  private lightSpaceMatrix: Matrix4 = new Matrix4();
  private frustum: Frustum = new Frustum();
  private renderStates: WebGLRenderStates = new WebGLRenderStates();
  private currentRenderState?: WebGLRenderState;
  private _vector3 = new Vector3();
  private renderLists: WebGLRenderLists = new WebGLRenderLists();
  private currentRenderList?: WebGLRenderList;
  private info: WebGLInfo = new WebGLInfo(null);
  private currentArrayCamera?: ArrayCamera;
  private repository = new ModelRepository();
  private shadowMapShader = new Shader({
    fragmentFile: "@/shaders/shadow.frag",
    vertexFile: "@/shaders/shadow.vert",
  });
  private shadowMapMaterial = new ShadowMapMaterial();

  private target: Surface = Surface.Screen;
  private shadowMapSize = 2048;
  private emptyShadowMap = new Surface(
    this.shadowMapSize,
    this.shadowMapSize,
    Color.Blue
  );
  private editorGrid = true;
  private shadowMaps: WeakMap<Light, Surface> = new WeakMap();
  private lightSpaceMatrixes: WeakMap<Light, Matrix4> = new WeakMap();

  setEditorGrid(editorGrid: boolean) {
    this.editorGrid = editorGrid;
  }

  getShadowMap(light: Light) {
    let shadowMap = this.shadowMaps.get(light);

    if (!shadowMap) {
      shadowMap = new Surface(
        this.shadowMapSize,
        this.shadowMapSize,
        Color.Black
      );
      shadowMap.depthOp = DepthOp.LessOrEqual;
      shadowMap.blendOp = BlendOp.Replace;

      this.shadowMaps.set(light, shadowMap);
    }

    return shadowMap;
  }

  getLightSpaceMatrix(light: Light) {
    let lightSpaceMatrix = this.lightSpaceMatrixes.get(light);

    if (!lightSpaceMatrix) {
      lightSpaceMatrix = new Matrix4();

      this.lightSpaceMatrixes.set(light, lightSpaceMatrix);
    }

    return lightSpaceMatrix;
  }

  constructor() {}

  setShadowMapSize(size: number) {
    this.shadowMapSize = size;
  }

  setTarget(target: Surface) {
    this.target = target;
  }

  render(scene: Scene, camera: Camera) {
    // update scene graph

    if (scene.autoUpdate === true) scene.updateMatrixWorld();

    // update camera matrices and frustum

    if (camera.parent === null) camera.updateMatrixWorld();

    this.currentRenderState = this.renderStates.get(scene, camera);
    this.currentRenderState.init();

    this.projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);

    this.currentRenderList = this.renderLists.get(scene, camera);
    this.currentRenderList.init();

    this.projectObject(scene, camera, 0, this.sortObjects);

    (this.currentRenderList as WebGLRenderList & { finish: () => {} }).finish();

    // if ( this.sortObjects ) {
    this.currentRenderList.sort();
    // }

    this.currentRenderState.setupLights(camera);

    if (this.info.autoReset) this.info.reset();

    const opaqueObjects = this.currentRenderList.opaque;
    const transparentObjects = this.currentRenderList.transparent;

    const dirLights = this.currentRenderState.state.lightsArray.filter(
      (light) => isDirectionalLight(light)
    );
    const pointLights = this.currentRenderState.state.lightsArray.filter(
      (light) => isPointLight(light)
    );

    this.target.depthOp = DepthOp.LessOrEqual;
    this.target.blendOp = BlendOp.Default;

    if (dirLights.length || pointLights.length) {
      const prevTarget = this.target;

      scene.overrideMaterial = this.shadowMapMaterial;

      for (let i = 0; i < Math.min(4, dirLights.length); i++) {
        dirLights[i].shadow.updateMatrices(dirLights[i]);
        const shadowCamera = dirLights[i].shadow.camera;
        shadowCamera.updateMatrixWorld();
        this.lightSpaceMatrix = this.getLightSpaceMatrix(dirLights[i]);

        this.lightSpaceMatrix.multiplyMatrices(
          shadowCamera.projectionMatrix,
          shadowCamera.matrixWorldInverse
        );

        this.target = this.getShadowMap(dirLights[i]);
        this.target.clear(Color.Black, 1.0);

        if (opaqueObjects.length > 0)
          this.renderObjects(opaqueObjects, scene, shadowCamera);
      }

      // for (let i = 0; i < Math.min(1, pointLights.length); i++) { // todo fix 1 -> 4?
      //   for (let viewport = 0; viewport < 6; viewport++) {
      //     this.shadowViewport = viewport;
      //     pointLights[i].shadow.updateMatrices(pointLights[i], viewport);
      //     const shadowCamera = pointLights[i].shadow.camera;
      //     SSj.log(shadowCamera);
      //     shadowCamera.updateMatrixWorld();

      //     this.lightSpaceMatrix.multiplyMatrices( shadowCamera.projectionMatrix, shadowCamera.matrixWorldInverse );

      //     if ( opaqueObjects.length > 0 ) this.renderObjects( opaqueObjects, scene, shadowCamera );
      //   }
      // }

      this.target = prevTarget;
      scene.overrideMaterial = null;
    }

    if (opaqueObjects.length > 0)
      this.renderObjects(opaqueObjects, scene, camera);
    if (transparentObjects.length > 0)
      this.renderObjects(transparentObjects, scene, camera);

    this.currentRenderList = undefined;
    this.currentRenderState = undefined;

    // Font.Default.drawText(Surface.Screen, 1, 1, JSON.stringify(this.info.render));
  }

  renderObjects(renderList: RenderItem[], scene: Scene, camera: Camera) {
    const overrideMaterial =
      scene.isScene === true ? scene.overrideMaterial : null;

    for (let i = 0, l = renderList.length; i < l; i++) {
      const renderItem = renderList[i];

      const object = renderItem.object;
      const geometry = renderItem.geometry;
      const material =
        overrideMaterial === null ? renderItem.material : overrideMaterial;
      const group = renderItem.group;

      if (!geometry) {
        continue;
      }

      if (isArrayCamera(camera)) {
        this.currentArrayCamera = camera;

        const cameras = camera.cameras;

        for (let j = 0, jl = cameras.length; j < jl; j++) {
          const camera2 = cameras[j];

          if (object.layers.test(camera2.layers)) {
            this.currentRenderState!.setupLights(camera2);

            this.renderObject(
              object,
              scene,
              camera2,
              geometry,
              material,
              group as Group
            );
          }
        }
      } else {
        this.currentArrayCamera = undefined;

        this.renderObject(
          object,
          scene,
          camera,
          geometry,
          material,
          group as Group
        );
      }
    }
  }

  renderObject(
    object: Object3D,
    scene: Scene,
    camera: Camera,
    geometry: BufferGeometry | Geometry,
    material: Material,
    group: Group
  ) {
    object.onBeforeRender(
      (this as any) as WebGLRenderer,
      scene,
      camera,
      geometry,
      material,
      group
    );

    this.currentRenderState = this.renderStates.get(
      scene,
      this.currentArrayCamera || camera
    );

    object.modelViewMatrix.multiplyMatrices(
      camera.matrixWorldInverse,
      object.matrixWorld
    );
    object.normalMatrix.getNormalMatrix(object.modelViewMatrix);

    if (isImmediateRenderObject(object)) {
      this.renderObjectImmediate(object);
    } else {
      this.renderBufferDirect(camera, scene, geometry, material, object, group);
    }

    object.onAfterRender(
      (this as any) as WebGLRenderer,
      scene,
      camera,
      geometry,
      material,
      group
    );
    this.currentRenderState = this.renderStates.get(
      scene,
      this.currentArrayCamera || camera
    );
  }

  setupShaders(
    camera: Camera,
    scene: Scene,
    geometry: BufferGeometry | Geometry,
    material: Material,
    object: Object3D,
    group: Group,
    model: Model
  ) {
    if (isBasicMaterial(material)) {
      return this.setupBasicShaders(
        camera,
        scene,
        geometry,
        material,
        object,
        group,
        model
      );
    } else if (isShadowMapMaterial(material)) {
      return this.setupShadowMapShaders(
        camera,
        scene,
        geometry,
        material,
        object,
        group,
        model
      );
    }
  }

  setupBasicShaders(
    camera: Camera,
    scene: Scene,
    geometry: BufferGeometry | Geometry,
    material: BasicMaterial,
    object: Object3D,
    group: Group,
    model: Model
  ) {
    const transform = new Transform();
    const mat = new Matrix4();

    setTransformFromMatrix(transform, this.projScreenMatrix);
    model.shader.setMatrix("projection", transform);

    setTransformFromMatrix(transform, camera.matrixWorldInverse);
    model.shader.setMatrix("view", transform);

    setTransformFromMatrix(transform, object.matrixWorld);
    model.shader.setMatrix("model", transform);

    mat.getInverse(object.matrixWorld);
    mat.transpose();
    setTransformFromMatrix(transform, mat);
    model.shader.setMatrix("normal", transform);

    if (model.shader.setSampler) {
      if (material.specularMap) {
        model.shader.setBoolean("material_use_specular", true);
        model.shader.setSampler(
          "material_specular",
          material.specularMap,
          TU_SPECULARMAP
        );
      } else {
        model.shader.setBoolean("material_use_specular", false);
        model.shader.setSampler(
          "material_specular",
          this.emptyShadowMap,
          TU_SPECULARMAP
        );
      }

      if (material.normalMap) {
        model.shader.setBoolean("material_use_normal", true);
        model.shader.setSampler(
          "material_normal",
          material.normalMap,
          TU_NORMALMAP
        );
      } else {
        model.shader.setBoolean("material_use_normal", false);
        model.shader.setSampler(
          "material_normal",
          this.emptyShadowMap,
          TU_NORMALMAP
        );
      }
    }

    const dirLights = this.currentRenderState!.state.lightsArray.filter(
      (light) => isDirectionalLight(light)
    );
    // const pointLights = this.currentRenderState!.state.lightsArray.filter(
    //   (light) => isPointLight(light)
    // );

    let lightIndex = 0;
    let shadowMap;

    for (let i = 0; i < 4; i++) {
      if (i >= dirLights.length) {
        model.shader.setBoolean(`dirLights[${i}].enabled`, false);
        continue;
      }

      model.shader.setBoolean(`dirLights[${i}].enabled`, true);
      model.shader.setFloatVector(
        `dirLights[${i}].position`,
        dirLights[i].position.toArray() as [number, number, number]
      );
      model.shader.setFloat(
        `dirLights[${i}].intensity`,
        dirLights[i].intensity
      );
      model.shader.setFloatVector(
        `dirLights[${i}].color`,
        dirLights[i].color.toArray() as [number, number, number]
      );

      model.shader.setInt(`dirLights[${i}].lightIndex`, lightIndex);

      const lightSpaceMatrix = this.getLightSpaceMatrix(dirLights[i]);

      setTransformFromMatrix(transform, lightSpaceMatrix);
      model.shader.setMatrix(`lightSpaceMatrix[${lightIndex}]`, transform);

      shadowMap = this.getShadowMap(dirLights[i]);

      // SSj.log(`Light ${i} index ${lightIndex} in TU ${textureUnit}`);

      model.shader.setSampler?.(
        `shadowMap${lightIndex}`,
        shadowMap,
        TU_SHADOWMAP[lightIndex]
      );

      lightIndex++;
    }

    while (lightIndex < 4) {
      model.shader.setSampler?.(
        `shadowMap${lightIndex}`,
        this.emptyShadowMap,
        TU_SHADOWMAP[lightIndex]
      );

      lightIndex++;
    }

    // for (let i = 0; i < 4; i++) {
    //   if (i >= pointLights.length) {
    //     model.shader.setBoolean(`pointLights[${i}].enabled`, false);
    //     continue;
    //   }

    //   model.shader.setBoolean(`pointLights[${i}].enabled`, true);
    //   model.shader.setFloatVector(
    //     `pointLights[${i}].position`,
    //     pointLights[i].position.toArray() as [number, number, number]
    //   );
    //   model.shader.setFloat(
    //     `pointLights[${i}].intensity`,
    //     pointLights[i].intensity
    //   );
    //   model.shader.setFloatVector(
    //     `pointLights[${i}].color`,
    //     pointLights[i].color.toArray() as [number, number, number]
    //   );
    //   const lightSpaceMatrix = this.getLightSpaceMatrix(pointLights[i]);

    //   if (lightSpaceMatrix) {
    //     setTransformFromMatrix(transform, lightSpaceMatrix);
    //     model.shader.setMatrix(`pointLights[${i}].lightSpaceMatrix`, transform);
    //   }

    //   const shadowMap = this.getShadowMap(pointLights[i]);

    //   if (shadowMap) {
    //     model.shader.setSampler(
    //       `pointLights[${i}].shadowMap`,
    //       shadowMap,
    //       TU_SHADOWMAP
    //     );
    //   }
    // }

    const color = material.color;
    model.shader.setFloatVector("material.color", [color.r, color.g, color.b]);
    model.shader.setFloat("material.shininess", material.shininess);
    model.shader.setBoolean("material.transparent", material.transparent);
    model.shader.setFloat("material.opacity", material.opacity);
    model.shader.setFloatVector("material.uvScale", material.uvScale);

    model.shader.setFloatVector(
      "viewPos",
      camera.position.toArray() as [number, number, number]
    );
    model.shader.setFloat("shadowMapSize", this.shadowMapSize);

    if (isEditorBasicMaterial(material)) {
      model.shader.setBoolean("editor", true);
      model.shader.setFloat("editorGrid", this.editorGrid ? material.grid : 0);
      model.shader.setBoolean("editorHovered", material.hover);
      model.shader.setBoolean("editorSelected", material.selected);
    }
  }

  setupShadowMapShaders(
    camera: Camera,
    scene: Scene,
    geometry: BufferGeometry | Geometry,
    material: Material,
    object: Object3D,
    group: Group,
    model: Model
  ) {
    const transform = new Transform();

    const previousShader = model.shader;

    model.shader = this.shadowMapShader;

    setTransformFromMatrix(transform, this.lightSpaceMatrix);
    model.shader.setMatrix("projection", transform);

    // setTransformFromMatrix(transform, camera.matrixWorldInverse);
    // model.shader.setMatrix('view', transform);

    setTransformFromMatrix(transform, object.matrixWorld);
    model.shader.setMatrix("model", transform);

    return previousShader;
  }

  renderBufferDirect(
    camera: Camera,
    scene: Scene,
    geometry: BufferGeometry | Geometry,
    material: Material,
    object: Object3D,
    group: Group
  ) {
    const model = this.repository.get(object);

    if (!model) {
      return;
    }

    const shader = this.setupShaders(
      camera,
      scene,
      geometry,
      material,
      object,
      group,
      model
    );

    model.draw(this.target);

    if (shader) {
      model.shader = shader;
    }
  }

  renderObjectImmediate(object: ImmediateRenderObject) {
    object.render((object: ImmediateRenderObject) => {
      this.renderBufferImmediate(object);
    });
  }

  renderBufferImmediate(object: ImmediateRenderObject) {
    if (hasPositions(object)) {
      const vertexArray = createVertexArray(object.positionArray.length / 3);

      copyPositionsToVertexArray(vertexArray, object.positionArray);

      if (hasNormals(object)) {
        copyNormalsToVertexArray(vertexArray, object.normalArray);
      }

      if (hasUvs(object)) {
        copyUvsToVertexArray(vertexArray, object.uvArray);
      }

      // if (hasColors(object)) {
      //   copyColorsToVertexArray(vertexArray, object.colorArray);
      // }

      Shape.drawImmediate(this.target, ShapeType.Triangles, vertexArray);
    }
  }

  projectObject(
    object: Object3D,
    camera: Camera,
    groupOrder: number,
    sortObjects: boolean
  ) {
    if (!object.visible) return;

    const visible = object.layers.test(camera.layers);

    if (visible) {
      if (isGroup(object)) {
        groupOrder = object.renderOrder;
      } else if (isLOD(object)) {
        if (object.autoUpdate === true) object.update(camera);
      } else if (isLight(object)) {
        this.currentRenderState!.pushLight(object);

        if (object.castShadow) {
          this.currentRenderState!.pushShadow(object);
        }
      } else if (isSprite(object)) {
        if (!object.frustumCulled || this.frustum.intersectsSprite(object)) {
          if (sortObjects) {
            this._vector3
              .setFromMatrixPosition(object.matrixWorld)
              .applyMatrix4(this.projScreenMatrix);
          }

          const material = object.material;

          if (material.visible) {
            this.currentRenderList!.push(
              object,
              null,
              material,
              groupOrder,
              this._vector3.z,
              null
            );
          }
        }
      } else if (isImmediateRenderObject(object)) {
        if (sortObjects) {
          this._vector3
            .setFromMatrixPosition(object.matrixWorld)
            .applyMatrix4(this.projScreenMatrix);
        }

        this.currentRenderList!.push(
          object,
          null,
          object.material,
          groupOrder,
          this._vector3.z,
          null
        );
      } else if (isMesh(object) || isLine(object) || isPoints(object)) {
        if (isSkinnedMesh(object)) {
          // update skeleton only once in a frame

          if (
            (object.skeleton as WithFrame<Skeleton>).frame !==
            this.info.render.frame
          ) {
            object.skeleton.update();
            (object.skeleton as WithFrame<
              Skeleton
            >).frame = this.info.render.frame;
          }
        }

        if (!object.frustumCulled || this.frustum.intersectsObject(object)) {
          if (sortObjects) {
            this._vector3
              .setFromMatrixPosition(object.matrixWorld)
              .applyMatrix4(this.projScreenMatrix);
          }

          const geometry = object.geometry as BufferGeometry;
          const material = object.material;

          if (Array.isArray(material)) {
            const groups = geometry.groups;

            for (let i = 0, l = groups.length; i < l; i++) {
              const group = groups[i];
              const groupMaterial = material[group.materialIndex || 0];

              if (groupMaterial && groupMaterial.visible) {
                this.currentRenderList!.push(
                  object,
                  geometry,
                  groupMaterial,
                  groupOrder,
                  this._vector3.z,
                  (group as any) as Group
                );
              }
            }
          } else if (material.visible) {
            this.currentRenderList!.push(
              object,
              geometry,
              material,
              groupOrder,
              this._vector3.z,
              null
            );
          }
        }
      }
    }

    const children = object.children;

    for (let i = 0, l = children.length; i < l; i++) {
      this.projectObject(children[i], camera, groupOrder, sortObjects);
    }
  }

  setSize(width: number, height: number, updateStyle?: boolean) {}
}
