import { Object3D } from "three";

export interface XHR {
  pass: number;
}

export class OBJLoader {
  load(
    file: string,
    success: (object: Object3D) => void,
    loading?: (xhr: XHR) => void,
    error?: (error: any) => void
  ): void;
}
