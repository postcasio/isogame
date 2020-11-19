import { LevelObjectType } from "./LevelObject";
import { LevelState } from "./LevelState";
import { ControlState } from "./gui/GUI";
import { Editor } from "./index";
import { PanelState } from "./Panel";
import { LevelMeshGeometry } from "./LevelMesh";
import { Base64 } from "js-base64";

export interface SerializedLevelObjectError {
  type: "None";
}

export interface SerializedLevelBlock {
  type: "Block";
  id: string;
  name: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  material: {
    color: [number, number, number];
    opacity: number;
    shininess: number;
    transparent: boolean;
  };
}

export interface SerializedLevelMesh {
  type: "Mesh";
  id: string;
  name: string;
  geometry: LevelMeshGeometry;
  position: [number, number, number];
  scale: [number, number, number];
  rotation: [number, number, number];
  material: {
    color: Color;
    opacity: number;
    shininess: number;
    transparent: boolean;
    uvScale: [number, number];
    texture?: Texture;
    specularMap?: Texture;
    normalMap?: Texture;
  };
}

export interface SerializedLevelLight {
  type: "Light";
  id: string;
  name: string;
  position: [number, number, number];
  color: [number, number, number];
  intensity: number;
}

export interface SerializedLevelGroup {
  type: "Group";
  id: string;
  name: string;
  children: SerializedLevelObject[];
}

export type SerializedLevelObject = {
  type: keyof typeof LevelObjectType;
} & (
  | SerializedLevel
  | SerializedLevelObjectError
  | SerializedLevelBlock
  | SerializedLevelMesh
  | SerializedLevelLight
  | SerializedLevelGroup
);

export interface SerializedLevel {
  type: "Level";
  id: string;
  name: string;
  time: number;

  children: SerializedLevelObject[];

  editor: SerializedEditorState;
}

export interface SerializedEditorState {
  camera: {
    position: [number, number, number];
    rotation: [number, number, number];
  };
  panels: {
    type: string;
    state: PanelState;
    controlStates: Record<string, ControlState>;
  }[];
}

export class LevelSerializer {
  serialize(level: LevelState, editor: Editor, pretty = false): string {
    return JSON.stringify(
      level.serialize(),
      this.replacer,
      pretty ? 2 : undefined
    );
  }

  replacer(key: string, value: unknown): unknown {
    if (value instanceof Color) {
      return { __color: [value.r, value.g, value.b, value.a] };
    } else if (value instanceof Texture) {
      if (!value.fileName) {
        const array = Z.deflate(value.download());
        return {
          __texture: {
            width: value.width,
            height: value.height,
            data: Base64.fromUint8Array(new Uint8Array(array)),
          },
        };
      } else {
        return { __texture: { fileName: value.fileName } };
      }
    }

    return value;
  }
}
