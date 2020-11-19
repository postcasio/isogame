import {
  BoxBufferGeometry,
  BufferGeometry,
  ConeBufferGeometry,
  CylinderBufferGeometry,
  DodecahedronBufferGeometry,
  Mesh,
  SphereBufferGeometry,
} from "three";
import { EditorObjectMesh } from ".";
import { OBJECT_LAYER } from "./constants";
import { EditorBasicMaterial } from "./EditorBasicMaterial";
import { LevelGroup } from "./LevelGroup";
import { LevelObject, generateId, LevelObjectType } from "./LevelObject";
import { SerializedLevelMesh } from "./LevelSerializer";
import { LevelState } from "./LevelState";
import { defaultSpecularTexture, defaultTexture } from "./utils";

export interface LevelMeshBoxGeometry {
  type: "box";
  width: number;
  height: number;
  depth: number;
}

export interface LevelMeshSphereGeometry {
  type: "sphere";
  radius: number;
  widthSegments: number;
  heightSegments: number;
  phiStart: number;
  phiLength: number;
  thetaStart: number;
  thetaLength: number;
}

export interface LevelMeshConeGeometry {
  type: "cone";
  radius: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
  openEnded: boolean;
  thetaStart: number;
  thetaLength: number;
}

export interface LevelMeshCylinderGeometry {
  type: "cylinder";
  radiusTop: number;
  radiusBottom: number;
  height: number;
  radialSegments: number;
  heightSegments: number;
  openEnded: boolean;
  thetaStart: number;
  thetaLength: number;
}

export interface LevelMeshDodecahedronGeometry {
  type: "dodecahedron";
  radius: number;
  detail: number;
}

export interface LevelMeshCustomGeometry {
  type: "custom";
  data: unknown;
}

export type LevelMeshGeometry =
  | LevelMeshBoxGeometry
  | LevelMeshSphereGeometry
  | LevelMeshConeGeometry
  | LevelMeshCylinderGeometry
  | LevelMeshDodecahedronGeometry
  | LevelMeshCustomGeometry;

export type LevelMeshGeometryType = LevelMeshGeometry["type"];

let autoNameCounter = 0;

const geometryDefaults = {
  box: {
    type: "box" as const,
    width: 1,
    height: 1,
    depth: 1,
  },
  sphere: {
    type: "sphere" as const,
    radius: 0.5,
    widthSegments: 8,
    heightSegments: 6,
    phiStart: 0,
    phiLength: Math.PI * 2,
    thetaStart: 0,
    thetaLength: Math.PI,
  },
  cone: {
    type: "cone" as const,
    radius: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: Math.PI * 2,
  },
  cylinder: {
    type: "cylinder" as const,
    radiusTop: 1,
    radiusBottom: 1,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: Math.PI * 2,
  },
  dodecahedron: {
    type: "dodecahedron" as const,
    radius: 1,
    detail: 0,
  },
  custom: {
    type: "custom" as const,
  },
};

export function getDefaultGeometry<T extends LevelMeshGeometryType>(
  type: T
): typeof geometryDefaults[T] {
  return geometryDefaults[type];
}

export function createGeometry(geometry: LevelMeshGeometry): BufferGeometry {
  switch (geometry.type) {
    case "box":
      return new BoxBufferGeometry(
        geometry.width,
        geometry.height,
        geometry.depth
      );
    case "sphere":
      return new SphereBufferGeometry(
        geometry.radius,
        geometry.widthSegments,
        geometry.heightSegments,
        geometry.phiStart,
        geometry.phiLength,
        geometry.thetaStart,
        geometry.thetaLength
      );
    case "cone":
      return new ConeBufferGeometry(
        geometry.radius,
        geometry.height,
        geometry.radialSegments,
        geometry.heightSegments,
        geometry.openEnded,
        geometry.thetaStart,
        geometry.thetaLength
      );
    case "cylinder":
      return new CylinderBufferGeometry(
        geometry.radiusTop,
        geometry.radiusBottom,
        geometry.height,
        geometry.radialSegments,
        geometry.heightSegments,
        geometry.openEnded,
        geometry.thetaStart,
        geometry.thetaLength
      );
    case "dodecahedron":
      return new DodecahedronBufferGeometry(geometry.radius, geometry.detail);
    case "custom":
      return geometry.data as BufferGeometry;
  }

  // throw new Error(
  //   "Geometry " + geometry.type + " cannot be constructed this way"
  // );
}

export function createMesh(geometry: LevelMeshGeometry): EditorObjectMesh {
  const mat = new EditorBasicMaterial({
    grid: 1,
    color: Color.White,
    shininess: 0.5,
    texture: defaultTexture(64, 64),
    specularMap: defaultSpecularTexture(64, 64),
  });

  return new Mesh(createGeometry(geometry), mat) as EditorObjectMesh;
}

export class LevelMesh implements LevelObject {
  type = LevelObjectType.Mesh as const;
  id: string;
  name: string;
  mesh: EditorObjectMesh;
  parent?: LevelGroup | LevelState;

  sourceGeometry: LevelMeshGeometry;

  constructor(geometry: LevelMeshGeometry) {
    this.sourceGeometry = geometry;
    this.id = generateId();
    this.name = "Mesh " + ++autoNameCounter;
    this.mesh = createMesh(geometry);
    this.mesh.userData.$EDITOR = { object: this };
    this.mesh.layers.enable(OBJECT_LAYER);
  }

  serialize(): SerializedLevelMesh {
    return {
      type: "Mesh",
      id: this.id,
      name: this.name,
      geometry: this.sourceGeometry,
      position: this.mesh.position.toArray() as [number, number, number],
      scale: this.mesh.scale.toArray() as [number, number, number],
      rotation: this.mesh.rotation.toArray() as [number, number, number],
      material: {
        color: this.mesh.material.color,
        shininess: this.mesh.material.shininess,
        transparent: this.mesh.material.transparent,
        opacity: this.mesh.material.opacity,
        uvScale: this.mesh.material.uvScale,
        texture: this.mesh.material.texture,
        normalMap: this.mesh.material.normalMap,
        specularMap: this.mesh.material.specularMap,
      },
    };
  }

  static deserialize(data: SerializedLevelMesh): LevelMesh {
    const object = new LevelMesh(data.geometry);

    object.id = data.id;
    object.name = data.name;
    object.mesh.position.set(...data.position);
    object.mesh.scale.set(...data.scale);
    object.mesh.rotation.set(...data.rotation);
    object.mesh.material.color = data.material.color.clone();
    object.mesh.material.shininess = data.material.shininess;
    object.mesh.material.transparent = data.material.transparent;
    object.mesh.material.opacity = data.material.opacity;
    object.mesh.material.uvScale = data.material.uvScale;
    // object.mesh.material.texture = defaultTexture(128, 128);
    object.mesh.material.texture = data.material.texture;
    object.mesh.material.specularMap = data.material.specularMap;
    object.mesh.material.normalMap = data.material.normalMap;
    object.mesh.userData.$EDITOR = { object: object };
    object.mesh.layers.enable(OBJECT_LAYER);
    return object;
  }

  getInternal() {
    return this.mesh;
  }
}

export function isLevelMesh(object?: LevelObject): object is LevelMesh {
  return object?.type === LevelObjectType.Mesh;
}
