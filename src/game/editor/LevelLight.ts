import { DirectionalLight, OrthographicCamera } from "three";
import { OBJECT_LAYER } from "./constants";
import { generateId, LevelObject, LevelObjectType } from "./LevelObject";
import { SerializedLevelLight } from "./LevelSerializer";
let autoNameCounter = 0;

export class LevelLight implements LevelObject {
  x: number;
  y: number;
  z: number;
  color: Color;
  intensity: number;
  name: string;
  type: LevelObjectType.Light = LevelObjectType.Light;
  id: string;

  light?: DirectionalLight;

  constructor(x: number, y: number, z: number, color?: Color, intensity = 1) {
    this.id = generateId();

    this.name = `Light ${++autoNameCounter}`;

    this.x = x;
    this.y = y;
    this.z = z;

    this.intensity = intensity;

    this.color = color || Color.White;

    this.updateLight();

    const light = this.getLight();

    light.userData.$EDITOR = { light: this };
    light.layers.enable(OBJECT_LAYER);
  }

  serialize(): SerializedLevelLight {
    return {
      type: "Light",
      id: this.id,
      name: this.name,
      position: [this.x, this.y, this.z],
      color: [this.color.r, this.color.g, this.color.b],
      intensity: this.intensity,
    };
  }

  static deserialize(data: SerializedLevelLight): LevelLight {
    const light = new LevelLight(
      data.position[0],
      data.position[1],
      data.position[2],
      new Color(data.color[0], data.color[1], data.color[2], 1.0),
      data.intensity
    );
    light.id = data.id;

    light.name = data.name;

    return light;
  }

  setColor(color: Color): void {
    this.color = color;

    this.updateLight();
  }

  setIntensity(intensity: number): void {
    this.intensity = intensity;

    this.updateLight();
  }

  setPosition(x: number, y: number, z: number): void {
    this.x = x;
    this.y = y;
    this.z = z;

    this.updateLight();
  }

  setX(x: number): void {
    this.x = x;

    this.updateLight();
  }

  setY(y: number): void {
    this.y = y;

    this.updateLight();
  }

  setZ(z: number): void {
    this.z = z;

    this.updateLight();
  }

  updateLight(): void {
    const light = this.getLight();

    light.position.set(this.x, this.y, this.z);

    light.color.setRGB(this.color.r, this.color.g, this.color.b);

    light.intensity = this.intensity;
  }

  getLight(): DirectionalLight {
    if (!this.light) {
      this.light = this.createLight();
      this.updateLight();
    }
    return this.light;
  }

  createLight(): DirectionalLight {
    const aspect = 1;
    const near = 5; // the near clipping plane
    const far = 100; // the far clipping plane

    const d = 20;
    const orthoCamera = new OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      near,
      far
    );

    const light = new DirectionalLight(0xffffff, 1.0);
    light.shadow.camera.copy(orthoCamera);
    return light;
  }

  getInternal() {
    return this.getLight();
  }
}

export function isLevelLight(object?: LevelObject): object is LevelLight {
  return object?.type === LevelObjectType.Light;
}
