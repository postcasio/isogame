import { BasicMaterial, BasicMaterialParameters } from "../BasicMaterial";

export interface EditorBasicMaterialParameters extends BasicMaterialParameters {
  grid?: number;
  hover?: boolean;
  selected?: boolean;
}

export class EditorBasicMaterial extends BasicMaterial {
  grid: number;
  hover: boolean;
  selected: boolean;

  isEditorBasicMaterial = true;

  constructor(parameters?: EditorBasicMaterialParameters) {
    super(parameters);

    this.grid = parameters?.grid || 0;
    this.hover = parameters?.hover || false;
    this.selected = parameters?.selected || false;
  }

  copy(material: EditorBasicMaterial): this {
    super.copy(material);

    this.grid = material.grid;

    /**
     * We deliberately do not do this, the editor handles them:
     */
    // this.hover = material.hover;
    // this.selected = material.selected;

    return this;
  }
}

export function isEditorBasicMaterial(
  material: any
): material is EditorBasicMaterial {
  return (material as any).isEditorBasicMaterial ? true : false;
}
