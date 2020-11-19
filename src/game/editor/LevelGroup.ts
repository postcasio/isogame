import { Group } from "three";
import { LevelDeserializer } from "./LevelDeserializer";
import { generateId, LevelObject, LevelObjectType } from "./LevelObject";
import { SerializedLevelGroup } from "./LevelSerializer";

let autoNameCounter = 0;

export class LevelGroup implements LevelObject {
  type: LevelObjectType.Group = LevelObjectType.Group;

  children: LevelObject[] = [];

  name: string;
  id: string;

  group: Group;

  constructor(name?: string) {
    this.id = generateId();
    this.group = new Group();

    this.name = name || `Group ${++autoNameCounter}`;
  }

  serialize(): SerializedLevelGroup {
    return {
      type: "Group",
      id: this.id,
      name: this.name,
      children: this.children.map((child) => child.serialize()),
    };
  }

  static deserialize(
    data: SerializedLevelGroup,
    deserializer: LevelDeserializer
  ): LevelGroup {
    const group = new LevelGroup(data.name);
    group.id = data.id;

    for (const childData of data.children) {
      const child = deserializer.deserializeObject(childData);
      group.add(child);
      group.getInternal().add(child.getInternal());
      child.parent = group;
    }

    return group;
  }

  getGroup() {
    return this.group;
  }

  getInternal() {
    return this.getGroup();
  }

  add(...children: LevelObject[]) {
    for (const child of children) {
      child.parent = this;
      this.children.push(child);
      this.getInternal().add(child.getInternal());
    }
  }

  remove(child: LevelObject) {
    this.children = this.children.filter((c) => c !== child);
    this.getGroup().remove(child.getInternal());
  }
}

export function isLevelGroup(object?: LevelObject): object is LevelGroup {
  return object?.type === LevelObjectType.Group;
}
