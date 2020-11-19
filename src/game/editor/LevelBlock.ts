import { BoxBufferGeometry, Mesh } from "three";
import { OBJECT_LAYER } from "./constants";
import { EditorBasicMaterial } from "./EditorBasicMaterial";
import { EditorObjectMesh } from "./index";
import { generateId, LevelObject, LevelObjectType } from "./LevelObject";
import { SerializedLevelBlock } from "./LevelSerializer";

let autoNameCounter = 0;

export class LevelBlock implements LevelObject {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  width: number;
  height: number;
  depth: number;
  mesh?: EditorObjectMesh;
  color: Color;
  name: string;
  id: string;
  type: LevelObjectType.Block = LevelObjectType.Block;

  serialize(): SerializedLevelBlock {
    const mesh = this.getMesh();

    return {
      type: "Block",
      id: this.id,
      name: this.name,
      position: [this.x, this.y, this.z],
      scale: [this.width, this.height, this.depth],
      rotation: [this.rotX, this.rotY, this.rotZ],
      material: {
        color: [
          mesh.material.color.r,
          mesh.material.color.g,
          mesh.material.color.b,
        ],
        opacity: mesh.material.opacity,
        shininess: mesh.material.shininess,
        transparent: mesh.material.transparent,
      },
    };
  }

  static deserialize(data: SerializedLevelBlock): LevelBlock {
    const block = new LevelBlock({
      x: data.position[0],
      y: data.position[1],
      z: data.position[2],
      rotX: data.rotation[0],
      rotY: data.rotation[1],
      rotZ: data.rotation[2],
      width: data.scale[0],
      height: data.scale[1],
      depth: data.scale[2],
    });

    block.setColor(
      new Color(
        data.material.color[0],
        data.material.color[1],
        data.material.color[2],
        1.0
      )
    );

    block.id = data.id;

    const mesh = block.getMesh();

    mesh.material.shininess = data.material.shininess;
    mesh.material.transparent = data.material.transparent;
    mesh.material.opacity = data.material.opacity;

    mesh.userData.$EDITOR = { object: block };
    mesh.layers.enable(OBJECT_LAYER);

    block.name = data.name;

    return block;
  }

  constructor({
    x,
    y,
    z,
    width = 1,
    height = 1,
    depth = 1,
    mesh,
    rotX = 0,
    rotY = 0,
    rotZ = 0,
  }: {
    x: number;
    y: number;
    z: number;
    width?: number;
    height?: number;
    depth?: number;
    mesh?: EditorObjectMesh;
    rotX?: number;
    rotY?: number;
    rotZ?: number;
  }) {
    this.id = generateId();
    this.name = `Block ${++autoNameCounter}`;

    this.x = x;
    this.y = y;
    this.z = z;

    this.rotX = rotX;
    this.rotY = rotY;
    this.rotZ = rotZ;

    this.color = Color.White;

    this.width = width;
    this.height = height;
    this.depth = depth;

    this.mesh = mesh;

    if (mesh) {
      mesh.userData.$EDITOR = { object: this };
      mesh.layers.enable(OBJECT_LAYER);
    }

    this.updateMesh();
  }

  setColor(color: Color): void {
    this.color = color;

    this.getMesh().material.color = color;
  }

  setPosition(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;

    this.updateMesh();
  }

  setX(x: number): void {
    this.x = x;

    this.updateMesh();
  }

  setY(y: number): void {
    this.y = y;

    this.updateMesh();
  }

  setZ(z: number): void {
    this.z = z;

    this.updateMesh();
  }

  setRotationX(x: number): void {
    this.rotX = x;

    this.updateMesh();
  }

  setRotationY(y: number): void {
    this.rotY = y;

    this.updateMesh();
  }

  setRotationZ(z: number): void {
    this.rotZ = z;

    this.updateMesh();
  }

  setWidth(w: number): void {
    this.width = w;

    this.updateMesh();
  }

  setHeight(h: number): void {
    this.height = h;

    this.updateMesh();
  }

  setDepth(d: number): void {
    this.depth = d;

    this.updateMesh();
  }

  updateMesh(): void {
    const mesh = this.getMesh();

    mesh.position.set(this.x, this.y, this.z);

    mesh.scale.set(this.width, this.height, this.depth);

    mesh.rotation.set(this.rotX, this.rotY, this.rotZ);
  }

  getMesh(): EditorObjectMesh {
    if (!this.mesh) {
      this.mesh = this.createMesh();
    }
    return this.mesh;
  }

  createMesh(): EditorObjectMesh {
    const mat = new EditorBasicMaterial({
      color: this.color,
      shininess: 0.5,
      grid: 1,
    });
    const cubeGeometry = new BoxBufferGeometry(1, 1, 1);

    const mesh = new Mesh(cubeGeometry, mat);
    mesh.userData.$EDITOR = { object: this };
    mesh.layers.enable(OBJECT_LAYER);

    return (mesh as any) as EditorObjectMesh;
  }

  extendX(amount: number) {
    this.width = Math.max(1, this.width + amount);

    this.updateMesh();
  }

  extendY(amount: number) {
    this.height = Math.max(1, this.height + amount);

    this.updateMesh();
  }

  extendZ(amount: number) {
    this.depth = Math.max(1, this.depth + amount);

    this.updateMesh();
  }

  cloneMesh(): EditorObjectMesh {
    const mesh = this.getMesh();
    const prevUserData = mesh.userData;
    mesh.userData = {} as any;

    const clone = mesh.clone(true);
    mesh.userData = prevUserData;
    clone.layers.disable(OBJECT_LAYER);
    clone.visible = true;
    clone.material = new EditorBasicMaterial();
    clone.material.copy(mesh.material);
    return clone;
  }

  getInternal() {
    return this.getMesh();
  }
}

export function isLevelBlock(object?: LevelObject): object is LevelBlock {
  return object?.type === LevelObjectType.Block;
}
