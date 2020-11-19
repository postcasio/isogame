import { EditorObjectMesh } from ".";

export class Cursor {
  mesh?: EditorObjectMesh;

  x = 0;
  y = 0;
  z = 0;

  grabbedMesh?: EditorObjectMesh;
  grabbedWidth = 0;
  grabbedHeight = 0;
  grabbedDepth = 0;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  grabMesh(
    mesh: EditorObjectMesh,
    width: number,
    height: number,
    depth: number
  ): void {
    this.grabbedMesh = mesh;
    this.grabbedWidth = width;
    this.grabbedHeight = height;
    this.grabbedDepth = depth;

    this.updateMesh();
  }

  hasMesh() {
    return this.grabbedMesh ? true : false;
  }

  getMesh() {
    return this.grabbedMesh;
  }

  releaseMesh(): EditorObjectMesh {
    const mesh = this.grabbedMesh!;

    this.grabbedMesh = undefined;

    return mesh;
  }

  setX(value: number) {
    this.x = value;
    this.updateMesh();
  }

  setY(value: number) {
    this.y = value;
    this.updateMesh();
  }

  setZ(value: number) {
    this.z = value;
    this.updateMesh();
  }

  moveTo(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
    /** TODO THIS NORMAL */
    this.updateMesh();
  }

  setVisible(visible: boolean) {
    const mesh = this.getMesh();
    if (mesh) {
      mesh.visible = visible;
    }
  }

  updateMesh() {
    this.getMesh()?.position.set(
      this.x * 1,
      (this.y + this.grabbedHeight / 2) * 1,
      this.z * 1
    );
  }
}
