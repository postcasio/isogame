import {
  OrthographicCamera,
  Scene,
  Color as ThreeColor,
  DirectionalLight,
  Raycaster,
  Vector2,
  Mesh,
  Vector3,
  BoxBufferGeometry,
  Group,
} from "three";

import SphereRenderer from "../SphereRenderer";
import {
  EditorBasicMaterial,
  isEditorBasicMaterial,
} from "./EditorBasicMaterial";
import { isLevelBlock, LevelBlock } from "./LevelBlock";
import { isLevelState, LevelState } from "./LevelState";
import { OBJECT_LAYER } from "./constants";
import { createAxisHelper } from "./AxisHelper";
import Prim from "prim";
import Tween, { Easing } from "tween";
import { LevelLight } from "./LevelLight";
import { LevelObject } from "./LevelObject";
import { isLevelGroup, LevelGroup } from "./LevelGroup";
import { Panel } from "./Panel";
import { SidePanel } from "./panels/SidePanel";
import { SavePanel } from "./panels/SavePanel";
import { Registration } from "./utils";
import { LevelSerializer } from "./LevelSerializer";
import { LevelDeserializer } from "./LevelDeserializer";
import { LoadPanel } from "./panels/LoadPanel";
import { ToolbarPanel } from "./panels/ToolbarPanel";
import {
  isLevelMesh,
  LevelMesh,
  LevelMeshGeometry,
  LevelMeshGeometryType,
} from "./LevelMesh";
import { MeshBoxPanel } from "./panels/MeshBoxPanel";
import { MeshSpherePanel } from "./panels/MeshSpherePanel";
import { MeshConePanel } from "./panels/MeshConePanel";
import { MeshCylinderPanel } from "./panels/MeshCylinderPanel";
import { MeshDodecahedronPanel } from "./panels/MeshDodecahedronPanel";
import { CSGOperation, CSGPanel } from "./panels/CSGPanel";
import { DropdownOptions } from "./gui/GUI";
import { DropdownPanel } from "./panels/DropdownPanel";
import { OBJLoader } from "./OBJLoader";

export interface EditorObjectMesh extends Mesh {
  material: EditorBasicMaterial;
  userData: {
    $EDITOR: {
      object: LevelObject;
    };
  };
}

export type EditorObjectDirectionalLight = DirectionalLight;

export type EditorObject = EditorObjectMesh | EditorObjectDirectionalLight;

export class Editor {
  scene: Scene;
  camera: OrthographicCamera;
  // cursor: Cursor;
  renderer: SphereRenderer;
  raycaster: Raycaster;
  buffer: Surface;

  mousePosition: Vector2 = new Vector2();
  hover?: LevelObject;
  selected?: LevelObject;

  level: LevelState;
  cameraTween?: Tween<Vector3>;
  cameraFocus?: Vector3;
  cameraPositionIndex = 0;
  cameraDistance = 8;
  cameraPositions = [
    [1, 1, 1],
    [1, 1, -1],
    [-1, 1, -1],
    [-1, 1, 1],
  ];
  axisHelper: Group;

  showGrid = true;

  panels: Panel[] = [];

  constructor() {
    SSj.log("making buffer");
    this.buffer = new Surface(Surface.Screen.width, Surface.Screen.height, {
      multisample: 8,
    });
    SSj.log("ok");
    this.scene = new Scene();
    this.cameraFocus = new Vector3(0, 0, 0);
    this.scene.background = new ThreeColor("black");
    this.level = new LevelState(this.scene, this);

    // Create a camera
    const aspect = Surface.Screen.width / Surface.Screen.height;
    const near = 0.001; // the near clipping plane
    const far = 100; // the far clipping plane

    const d = this.cameraDistance;
    this.camera = new OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      near,
      far
    );

    this.camera.position.set(d, d, d);
    this.camera.lookAt(0, 0, 0);

    // this.cursor = new Cursor(0, 0, 0);
    // this.cursor.grabMesh(this.createDefaultMesh(), 1, 1, 1);
    // this.scene.add(this.cursor.getMesh()!);
    // this.cursor.setVisible(false);

    this.axisHelper = createAxisHelper({
      scene: this.scene,
      radius: 0.2,
      height: 10,
    });

    this.scene.add(this.axisHelper);

    // this.addGroup("Level");
    this.addObject(this.createDefaultLight(), false);
    // this.addObject(this.createDefaultBlock(), false);

    this.renderer = new SphereRenderer();
    this.renderer.setTarget(this.buffer);

    this.raycaster = new Raycaster();

    Surface.Screen.blendOp = BlendOp.Default;

    // SSj.log(this.scene);

    const panelWidth = Math.ceil(Surface.Screen.width * 0.2);

    this.addPanel(
      new SidePanel(
        Surface.Screen.width - panelWidth,
        48,
        panelWidth,
        Surface.Screen.height - 48,
        this.dropdownOffset(Surface.Screen.width - panelWidth, 48),
        {
          editor: this,
        }
      )
    );

    this.addPanel(
      new ToolbarPanel(
        0,
        0,
        Surface.Screen.width,
        48,
        this.dropdownOffset(0, 0),
        {
          editor: this,
        }
      )
    );

    const loader = new OBJLoader();
    loader.load("@/meshes/pillar3.obj", (obj: Mesh) => {
      SSj.log("got object");

      const mesh = new LevelMesh({
        type: "custom",
        data: obj.children[0].geometry,
      });
      mesh.getInternal().material.normalMap = new Texture(
        "@/meshes/pillar3.normal.png"
      );
      mesh.getInternal().material.texture = new Texture("@/meshes/marble.jpg");
      mesh.getInternal().material.specularMap = undefined;

      this.addObject(mesh);

      const floor = new LevelMesh({
        type: "box",
        width: 21,
        height: 1,
        depth: 21,
      });

      floor.getInternal().position.set(0, -3.5, 0);
      floor.getInternal().material.normalMap = new Texture(
        "@/circles_normal.png"
      );
      floor.getInternal().material.texture = new Texture("@/meshes/marble.jpg");
      floor.getInternal().material.specularMap = undefined;

      this.addObject(floor);
    });
  }

  addPanel(panel: Panel): Registration {
    this.panels.push(panel);

    return {
      remove: () => (this.panels = this.panels.filter((p) => p !== panel)),
    };
  }

  createDefaultLight() {
    return new LevelLight(40, 30, 5);
  }

  createDefaultBlock() {
    return new LevelBlock({
      x: 0,
      y: -0.5,
      z: 0,
      width: 11,
      height: 1,
      depth: 11,
    });
  }

  start() {
    Dispatch.onUpdate(() => {
      if (this.cameraFocus) {
        this.camera.lookAt(this.cameraFocus);
      }

      // reset old hover states
      if (this.hover) {
        if (isLevelBlock(this.hover) || isLevelMesh(this.hover)) {
          this.hover.getInternal().material.hover = false;
        }

        this.hover = undefined;
        // this.cursor.setVisible(false);
      }

      this.mousePosition.x = (Mouse.Default.x / Surface.Screen.width) * 2 - 1;
      this.mousePosition.y = -(
        (Mouse.Default.y / Surface.Screen.height) * 2 -
        1
      );
      const inView = this.mousePosition.x <= 1 && this.mousePosition.y <= 1;

      const inPanel = this.panels.find((panel) =>
        panel.contains(Mouse.Default.x, Mouse.Default.y)
      )
        ? true
        : false;

      const modalPanel = this.panels.filter((panel) => panel.isModal()).pop();

      if (inView && !inPanel && !modalPanel) {
        // update the picking ray with the camera and mouse position
        this.raycaster.setFromCamera(this.mousePosition, this.camera);
        this.raycaster.layers.set(OBJECT_LAYER);

        // calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(
          this.scene.children,
          true
        );

        if (intersects.length) {
          const intersect = intersects[0];

          const object = intersect.object;
          // const normal = intersect.face?.normal;

          if (
            // object !== this.cursor.getMesh() &&
            isEditorBasicMaterial((object as Mesh).material)
          ) {
            const editorObject = object as EditorObjectMesh;
            editorObject.material.hover = true;

            const block = editorObject.userData.$EDITOR.object;

            if (block !== this.selected) {
              // this.cursor.setVisible(false);
            } else {
              // this.cursor.setVisible(true);
            }

            this.hover = block;
          }

          // const intersectionPoint = intersect.point;

          // if (this.selected && this.hover === this.selected) {
          //   // this.cursor.moveTo(
          //   //   Math.round(intersectionPoint.x + 0.01 * (normal?.x || 0)),
          //   //   Math.round(intersectionPoint.y + 0.01 * (normal?.y || 0)),
          //   //   Math.round(intersectionPoint.z + 0.01 * (normal?.z || 0))
          //   // );
          // }
        }
      }

      let mouseEvent: MouseEvent | null;

      while ((mouseEvent = Mouse.Default.getEvent())) {
        if (!mouseEvent.key) break;

        switch (mouseEvent.key) {
          case MouseKey.Left:
            if (
              !modalPanel &&
              inView &&
              !inPanel &&
              this.selected &&
              this.hover === this.selected
            ) {
              // this.blurPanels();
              // this.placeBlock(
              //   this.cursor.x,
              //   this.cursor.y,
              //   this.cursor.z,
              //   new Vector3(0, 1, 0)
              // );
            } else if (!modalPanel && inView && !inPanel && this.hover) {
              this.blurPanels();
              this.selectObject(this.hover);
            } else if (!modalPanel && inView && !inPanel) {
              this.blurPanels();
              this.selectObject(null);
            }

            break;
        }
      }

      if (!this.anyPanelFocused() && !modalPanel) {
        let key: Key | null;

        while ((key = Keyboard.Default.getKey())) {
          switch (key) {
            /* CAMERA MOVEMENT */
            case Key.Q: {
              if (this.cameraTween) {
                break;
              }

              this.cameraPositionIndex--;
              if (this.cameraPositionIndex < 0) {
                this.cameraPositionIndex = this.cameraPositions.length - 1;
              }

              const newPosition = this.cameraPositions[
                this.cameraPositionIndex
              ];

              this.cameraTween = new Tween(this.camera.position);

              this.cameraTween
                .easeInOut(
                  {
                    x: newPosition[0] * this.cameraDistance,
                    y: newPosition[1] * this.cameraDistance,
                    z: newPosition[2] * this.cameraDistance,
                  },
                  45
                )
                .then(() => (this.cameraTween = undefined));
              break;
            }
            case Key.E: {
              if (this.cameraTween) {
                break;
              }

              this.cameraPositionIndex =
                (this.cameraPositionIndex + 1) % this.cameraPositions.length;
              const newPosition = this.cameraPositions[
                this.cameraPositionIndex
              ];

              this.cameraTween = new Tween(this.camera.position, Easing.Sine);

              this.cameraTween
                .easeInOut(
                  {
                    x: newPosition[0] * this.cameraDistance,
                    y: newPosition[1] * this.cameraDistance,
                    z: newPosition[2] * this.cameraDistance,
                  },
                  45
                )
                .then(() => (this.cameraTween = undefined));
              break;
            }
          }
        }
      }
    });

    Dispatch.onRender(() => {
      Surface.Screen.blendOp = BlendOp.Replace;

      this.buffer.clear(Color.Black, 1.0);
      this.renderer.render(this.scene, this.camera);
      Prim.blit(Surface.Screen, 0, 0, this.buffer);

      Surface.Screen.blendOp = BlendOp.Default;

      const modalPanel = this.panels.filter((panel) => panel.isModal()).pop();

      for (const panel of this.panels) {
        panel.render(!modalPanel || panel === modalPanel);
        Prim.blit(
          Surface.Screen,
          panel.x,
          panel.y,
          panel.getSurface(),
          new Color(1, 1, 1, 0.8)
        );
      }

      Font.Default.drawText(
        Surface.Screen,
        5,
        Surface.Screen.height - 15,
        "Q/E: Rotate camera"
      );

      if (this.level.lights.length && Keyboard.Default.isPressed(Key.Space)) {
        const light = this.level.lights[0];

        const obj = light.getLight();

        const shadowMap = this.renderer.getShadowMap(obj);

        if (shadowMap) {
          Surface.Screen.blendOp = BlendOp.Replace;
          Prim.blit(Surface.Screen, 0, 0, shadowMap);
          Surface.Screen.blendOp = BlendOp.Default;
        }
      }

      // Font.Default.drawText(
      //   Surface.Screen,
      //   0,
      //   0,
      //   `Cursor ${this.cursor.getMesh()?.visible ? "(visible)" : "(hidden)"}: ${
      //     this.cursor.x
      //   },${this.cursor.y},${this.cursor.z}`
      // );
      // Font.Default.drawText(
      //   Surface.Screen,
      //   0,
      //   10,
      //   "Holding " + (this.cursor.getMesh()?.id || "Nothing")
      // );
    });
  }

  createDefaultMesh() {
    const mat = new EditorBasicMaterial({
      color: Color.White,
      shininess: 0.5,
      grid: 1,
    });
    const cubeGeometry = new BoxBufferGeometry(1, 1, 1);

    const mesh = new Mesh(cubeGeometry, mat);

    return mesh as EditorObjectMesh;
  }

  // placeBlock(x: number, y: number, z: number, normal: Vector3) {
  //   const width = this.cursor.grabbedWidth;
  //   const height = this.cursor.grabbedHeight;
  //   const depth = this.cursor.grabbedDepth;
  //   const mesh = this.cursor.releaseMesh();

  //   const block = new LevelBlock({
  //     x: x + normal.x * 0.5,
  //     y: y + normal.y * 0.5 * height,
  //     z: z + normal.z * 0.5,
  //     width,
  //     height,
  //     depth,
  //     mesh,
  //   });

  //   this.scene.remove(mesh);
  //   this.cursor.grabMesh(this.createDefaultMesh(), 1, 1, 1);
  //   this.scene.add(this.cursor.getMesh()!);

  //   this.addObject(block);
  // }

  getBlockAt(x: number, y: number, z: number) {
    return this.level.blocks.find((block) => {
      return (
        x >= block.x &&
        x < block.x + block.width &&
        y >= block.y &&
        y < block.y + block.height &&
        z >= block.z &&
        z < block.z + block.depth
      );
    });
  }

  selectObject(object?: LevelObject | null) {
    if (isLevelBlock(this.selected) || isLevelMesh(this.selected)) {
      this.selected.getInternal().material.selected = false;
    }

    this.selected = object || undefined;

    if (isLevelBlock(this.selected) || isLevelMesh(this.selected)) {
      this.selected.getInternal().material.selected = true;
    } else {
      // this.cursor.setVisible(false);
    }
  }

  deleteObject(object: LevelObject) {
    if (object === this.selected) {
      this.selectObject(null);
    }

    if (object.parent) {
      object.parent.remove(object);
      object.getInternal().parent?.remove(object.getInternal());
    } else {
      this.level.remove(object);
      this.scene.remove(object.getInternal());
    }
  }

  addObject(object: LevelObject, updateSelection = true): void {
    object.getInternal().layers.enable(OBJECT_LAYER);
    object.getInternal().userData = { $EDITOR: { object: object } };

    // walk up from the selection to find a group
    let candidate: LevelObject | undefined = this.selected;

    while (candidate) {
      if (isLevelGroup(candidate) || isLevelState(candidate)) {
        candidate.add(object);

        if (updateSelection) {
          this.selectObject(object);
        }

        return;
      } else {
        candidate = candidate.parent;
      }
    }

    this.level.add(object);

    if (updateSelection) {
      this.selectObject(object);
    }
  }

  addGroup(name?: string) {
    this.addObject(new LevelGroup(name));
  }

  blurPanels() {
    for (const panel of this.panels) {
      panel.gui.blur();
    }
  }

  anyPanelFocused() {
    return this.panels.find((panel) => panel.gui.isFocused()) ? true : false;
  }

  openSaveDialog() {
    const w = Math.min(Surface.Screen.width * 0.6, 700);
    const h = Math.min(Surface.Screen.height * 0.6, 350);
    let panelRegistration: Registration;

    const panel = new SavePanel(
      (Surface.Screen.width - w) / 2,
      (Surface.Screen.height - h) / 2,
      w,
      h,
      this.dropdownOffset(
        (Surface.Screen.width - w) / 2,
        (Surface.Screen.height - h) / 2
      ),
      {
        initialFilename: "test.isolevel.json",
        onCancel: () => {
          panelRegistration.remove();
        },
        onSave: async (filename: string, pretty: boolean) => {
          try {
            await this.save(filename, pretty);
            panelRegistration.remove();
          } catch (e) {
            panel.setError("Unable to save: " + e.toString());
            SSj.log(e);
          }
        },
      }
    );

    return (panelRegistration = this.addPanel(panel));
  }

  async save(filename: string, pretty: boolean): Promise<void> {
    const ser = new LevelSerializer();
    const data = ser.serialize(this.level, this, pretty);
    FS.writeFile(filename, data);
  }

  openLoadDialog() {
    const w = Math.min(Surface.Screen.width * 0.6, 700);
    const h = Math.min(Surface.Screen.height * 0.6, 350);
    let panelRegistration: Registration;

    const panel = new LoadPanel(
      (Surface.Screen.width - w) / 2,
      (Surface.Screen.height - h) / 2,
      w,
      h,
      this.openDropdownPanel,
      {
        initialFilename: "~/test.isolevel.json",
        onCancel: () => {
          panelRegistration.remove();
        },
        onLoad: async (filename: string) => {
          try {
            for (const object of this.level.children) {
              this.scene.remove(object.getInternal());
            }
            this.level = await this.load(filename);
            panelRegistration.remove();
          } catch (e) {
            panel.setError("Unable to load: " + e.toString());
            SSj.log(e);
          }
        },
      }
    );

    return (panelRegistration = this.addPanel(panel));
  }

  async load(filename: string): Promise<LevelState> {
    const deser = new LevelDeserializer();
    const data = FS.readFile(filename);
    const state = deser.deserialize(data, this);

    return state;
  }

  getMeshPanelClass(type: LevelMeshGeometryType) {
    switch (type) {
      case "box":
        return MeshBoxPanel;
      case "sphere":
        return MeshSpherePanel;
      case "cone":
        return MeshConePanel;
      case "cylinder":
        return MeshCylinderPanel;
      case "dodecahedron":
        return MeshDodecahedronPanel;
    }

    throw new Error("Can't do that");
  }

  openMeshDialog(type: LevelMeshGeometryType): Promise<LevelMesh> {
    return new Promise((res, rej) => {
      const w = Math.min(Surface.Screen.width * 0.6, 400);
      const h = Math.min(Surface.Screen.height * 0.6, 350);
      let panelRegistration: Registration;
      const PanelClass = this.getMeshPanelClass(type);

      const panel = new PanelClass(
        (Surface.Screen.width - w) / 2,
        (Surface.Screen.height - h) / 2,
        w,
        h,
        this.dropdownOffset(
          (Surface.Screen.width - w) / 2,
          (Surface.Screen.height - h) / 2
        ),
        {
          onCancel: () => {
            panelRegistration.remove();
            rej();
          },
          onCreate: (geometry: LevelMeshGeometry) => {
            panelRegistration.remove();
            res(new LevelMesh(geometry));
          },
        }
      );

      return (panelRegistration = this.addPanel(panel));
    });
  }

  openCSGDialog(): Promise<CSGOperation> {
    return new Promise((res, rej) => {
      const w = Math.min(Surface.Screen.width * 0.6, 400);
      const h = Math.min(Surface.Screen.height * 0.6, 350);
      let panelRegistration: Registration;

      const panel = new CSGPanel(
        (Surface.Screen.width - w) / 2,
        (Surface.Screen.height - h) / 2,
        w,
        h,
        this.dropdownOffset(
          (Surface.Screen.width - w) / 2,
          (Surface.Screen.height - h) / 2
        ),
        {
          level: this.level,
          onCancel: () => {
            panelRegistration.remove();
            rej();
          },
          onSubmit: (result: CSGOperation) => {
            panelRegistration.remove();
            res(result);
          },
        }
      );

      return (panelRegistration = this.addPanel(panel));
    });
  }

  openDropdownPanel = <T>(options: DropdownOptions<T>): Promise<T> => {
    const opener = options.opener;

    let x: number;
    const w = options.dropdownWidth;
    const h = 120;
    let y: number;

    if (opener.y + opener.h! + h < Surface.Screen.height) {
      y = opener.y + opener.h!;
    } else {
      y = opener.y - h;
    }

    if (opener.x + w > Surface.Screen.width) {
      x = Surface.Screen.width - w;
    } else {
      x = opener.x;
    }

    return new Promise((res, rej) => {
      let panelRegistration: Registration;

      const panel = new DropdownPanel<T>(
        x,
        y,
        w,
        h,
        this.dropdownOffset(x, y),
        {
          ...options,
          onCancel: () => {
            panelRegistration.remove();
            rej();
          },
          onSelect: (result) => {
            panelRegistration.remove();
            res(result);
          },
        }
      );

      return (panelRegistration = this.addPanel(panel));
    });
  };

  dropdownOffset<T>(x: number, y: number) {
    return (options: DropdownOptions<T>): Promise<T | undefined> => {
      return this.openDropdownPanel<T>({
        ...options,
        opener: {
          x: options.opener.x + x,
          y: options.opener.y + y,
          w: options.opener.w,
          h: options.opener.h,
        },
      });
    };
  }
}
