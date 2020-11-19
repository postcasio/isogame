import { Object3D } from "three";
import { LevelGroup } from "./LevelGroup";
import { SerializedLevelObject } from "./LevelSerializer";
import { LevelState } from "./LevelState";

export enum LevelObjectType {
  None,
  Block,
  Light,
  Group,
  Mesh,
  Level,
}

export interface LevelObject {
  type: LevelObjectType;

  name: string;
  id: string;

  parent?: LevelGroup | LevelState;

  serialize(): SerializedLevelObject;

  getInternal(): Object3D;
}

export function generateId() {
  return (
    ((Math.random() * 0x10000) & 0xffff).toString(16).padStart(4, "0") +
    (Sphere.now() & 0xffff).toString(16).padStart(4, "0")
  );
}
