declare module "three-csg/dist/three-csg.cjs" {
  import { BufferGeometry } from "three";

  export class Geometry {}

  export = {
    BufferGeometry: (geometry: Geometry) => BufferGeometry,
    union: (objects: Array<Geometry | BufferGeometry>) => Geometry,
    subtract: (objects: Array<Geometry | BufferGeometry>) => Geometry,
    intersect: (objects: Array<Geometry | BufferGeometry>) => Geometry,
  };
}
