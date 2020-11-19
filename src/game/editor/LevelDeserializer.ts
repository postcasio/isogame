import { Base64 } from "js-base64";
import { Editor } from "./index";
import { LevelBlock } from "./LevelBlock";
import { LevelGroup } from "./LevelGroup";
import { LevelLight } from "./LevelLight";
import { LevelMesh } from "./LevelMesh";
import { LevelObject } from "./LevelObject";
import { SerializedLevel, SerializedLevelObject } from "./LevelSerializer";
import { LevelState } from "./LevelState";

export class LevelDeserializer {
  deserialize(levelData: string, editor: Editor): LevelState {
    const level: SerializedLevel = JSON.parse(levelData, this.reviver);
    const state = new LevelState(editor.scene, editor);

    for (const data of level.children) {
      const object: LevelObject = this.deserializeObject(data);
      state.add(object);
      editor.scene.add(object.getInternal());
    }

    for (const panelData of level.editor.panels) {
      const panel = editor.panels.find(
        (candidate) => candidate.type === panelData.type
      );

      if (panel) {
        panel.state = panelData.state;
        panel.gui.setControlStates(panelData.controlStates);
      }
    }

    editor.camera.position.set(...level.editor.camera.position);
    editor.camera.rotation.set(...level.editor.camera.rotation);

    return state;
  }

  deserializeObject = (object: SerializedLevelObject): LevelObject => {
    switch (object.type) {
      case "Block":
        return LevelBlock.deserialize(object);

      case "Group":
        return LevelGroup.deserialize(object, this);

      case "Light":
        return LevelLight.deserialize(object);

      case "Mesh":
        return LevelMesh.deserialize(object);
    }

    throw new Error(`Unknown object type: ${object.type}`);
  };

  reviver(key: string, value: any): unknown {
    if (value) {
      if (value.__color) {
        return new Color(
          value.__color[0],
          value.__color[1],
          value.__color[2],
          value.__color[3] || 1.0
        );
      } else if (value.__texture) {
        if (value.__texture.fileName) {
          return new Texture(value.__texture.fileName);
        } else {
          const data = Base64.toUint8Array(value.__texture.data);
          const array = Z.inflate(data);
          return new Texture(value.__texture.width, value.__texture.height, {
            content: array,
          });
        }
      }
    }

    return value;
  }
}
