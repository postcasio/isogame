import { Material } from "three";

export class ShadowMapMaterial extends Material {
  isShadowMapMaterial: boolean = true;
}

export function isShadowMapMaterial(material: Material): material is ShadowMapMaterial {
  return (material as any).isShadowMapMaterial ? true : false;
}
