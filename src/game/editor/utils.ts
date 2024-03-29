import Prim from "prim";
import BitmapFont from "../BitmapFont";

const defaultTextures: Map<string, Surface> = new Map();
const defaultSpecularTextures: Map<string, Surface> = new Map();

const font = new BitmapFont("@/fonts/arial-rounded-16px.fnt");

export function defaultTexture(width = 64, height = 64) {
  const size = `${width}x${height}`;
  let surface = defaultTextures.get(size);
  if (!surface) {
    surface = new Surface(width, height, Color.BlueViolet);
    Prim.drawRectangle(surface, 0, 0, width, height, 2, Color.White);
    surface.blendOp = BlendOp.Default;
    font.drawText(surface, 5, 5, size);
    defaultTextures.set(size, surface);
  }
  return surface;
}

export function defaultSpecularTexture(width = 64, height = 64) {
  const size = `${width}x${height}`;
  let surface = defaultSpecularTextures.get(size);
  if (!surface) {
    surface = new Surface(width, height, new Color(0.2, 0.2, 0.2));
    const rng = new RNG();
    const buffer = new Int8Array(width * height * 4);
    let written = 0;
    for (const value of rng) {
      buffer[written++] = value * 32;
      buffer[written++] = value * 32;
      buffer[written++] = value * 32;
      buffer[written++] = 255;
      if (written >= width * height * 4) {
        break;
      }
    }
    surface.upload(buffer);
    Prim.drawRectangle(surface, 0, 0, width, height, 2, Color.White);
    surface.blendOp = BlendOp.Default;
    font.drawText(surface, 5, 5, size);
    defaultSpecularTextures.set(size, surface);
  }
  return surface;
}

export interface Registration {
  remove: () => void;
}

export function drawTexture(
  target: Surface,
  texture: Texture,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  mask: Color = Color.White
): void {
  const u1 = 0;
  const u2 = 1;
  const v1 = 1;
  const v2 = 0;

  Shape.drawImmediate(target, ShapeType.TriStrip, texture, [
    { x: x1, y: y1, u: u1, v: v1, color: mask },
    { x: x2, y: y1, u: u2, v: v1, color: mask },
    { x: x1, y: y2, u: u1, v: v2, color: mask },
    { x: x2, y: y2, u: u2, v: v2, color: mask },
  ]);
}
