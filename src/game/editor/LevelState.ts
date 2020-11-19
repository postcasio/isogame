import { Scene } from "three";
import { Editor } from ".";
import { isLevelBlock, LevelBlock } from "./LevelBlock";
import { isLevelLight, LevelLight } from "./LevelLight";
import { generateId, LevelObject, LevelObjectType } from "./LevelObject";
import { SerializedLevel } from "./LevelSerializer";

export class LevelState implements LevelObject {
  private scene: Scene;
  type = LevelObjectType.Level;
  name = "Level";
  id: string;
  editor: Editor;

  public get lights(): LevelLight[] {
    return this.children.filter(isLevelLight);
  }

  public get blocks(): LevelBlock[] {
    return this.children.filter(isLevelBlock);
  }

  children: LevelObject[] = [];

  add(...children: LevelObject[]) {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
      this.getInternal().add(child.getInternal());
    }
  }

  remove(child: LevelObject): void {
    this.children = this.children.filter((c) => c !== child);
    this.getInternal().remove(child.getInternal());
  }

  getInternal() {
    return this.scene;
  }

  constructor(scene: Scene, editor: Editor) {
    this.scene = scene;
    this.editor = editor;
    this.id = generateId();
  }

  serialize(): SerializedLevel {
    const editor = this.editor;

    return {
      type: "Level",
      id: this.id,
      name: this.name,
      time: Date.now(),
      children: this.children.map((child) => child.serialize()),
      editor: {
        camera: {
          position: [
            editor.camera.position.x,
            editor.camera.position.y,
            editor.camera.position.z,
          ],
          rotation: [
            editor.camera.rotation.x,
            editor.camera.rotation.y,
            editor.camera.rotation.z,
          ],
        },
        panels: editor.panels.map((panel) => ({
          type: panel.type,
          state: panel.state,
          controlStates: panel.gui.getControlStates(),
        })),
      },
    };
  }
}

export function isLevelState(object?: LevelObject): object is LevelState {
  return object?.type === LevelObjectType.Level;
}
