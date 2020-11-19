declare module "threejs-csg/build/csg.cjs" {
  import { BufferGeometry, Mesh } from "three";

  export class CSG {
    setFromMesh(mesh: Mesh): void;
    union(meshes: Mesh[]): void;
    intersect(meshes: Mesh[]): void;
    subtract(meshes: Mesh[]): void;
    toMesh(): Mesh;
    toGeometry(): BufferGeometry;
  }
}
