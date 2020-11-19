import { Material } from "three";

export interface BasicMaterialParameters {
  color?: Color;
  shininess?: number;
  opacity?: number;
  transparent?: boolean;
  roughness?: number;
  texture?: Texture;
  specularMap?: Texture;
  normalMap?: Texture;
  uvScale?: [number, number];
}

export class BasicMaterial extends Material {
  color: Color;
  shininess: number;
  opacity: number;
  transparent: boolean;
  roughness: number;
  texture?: Texture;
  specularMap?: Texture;
  normalMap?: Texture;
  uvScale: [number, number];

  isBasicMaterial = true;

  constructor(parameters?: BasicMaterialParameters) {
    super();

    this.color = parameters?.color || Color.White;
    this.shininess = parameters?.shininess || 0.5;
    this.opacity = parameters?.opacity || 1;
    this.transparent = parameters?.transparent || false;
    this.roughness = parameters?.roughness || 0;
    this.texture = parameters?.texture;
    this.uvScale = parameters?.uvScale || [1, 1];
    this.specularMap = parameters?.specularMap;
    this.normalMap = parameters?.normalMap;
  }

  copy(material: BasicMaterial): this {
    super.copy(material);

    this.color = material.color.clone();
    this.shininess = material.shininess;
    this.opacity = material.opacity;
    this.transparent = material.transparent;

    this.texture = material.texture;
    this.uvScale = material.uvScale.slice() as [number, number];
    this.specularMap = material.specularMap;
    this.normalMap = material.normalMap;

    return this;
  }
}

export function isBasicMaterial(material: Material): material is BasicMaterial {
  return (material as any).isBasicMaterial ? true : false;
}
