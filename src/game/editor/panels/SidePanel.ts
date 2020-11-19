import { Editor } from "..";
import {
  GUIVerticalLayoutChild,
  GUIVerticalLayout,
  GUIVerticalChildCallback,
  GUI,
  GUIVerticalDimension,
} from "../gui/GUI";
import { isLevelBlock, LevelBlock } from "../LevelBlock";
import { isLevelGroup, LevelGroup } from "../LevelGroup";
import { isLevelLight, LevelLight } from "../LevelLight";
import { isLevelMesh, LevelMesh } from "../LevelMesh";
import { LevelObject } from "../LevelObject";
import { isLevelState, LevelState } from "../LevelState";
import { Panel, PanelParams } from "../Panel";

export interface SidePanelParams extends PanelParams {
  editor: Editor;
}

export class SidePanel extends Panel<SidePanelParams> {
  type = "side";

  renderChildren() {
    this.renderPanel();
  }

  renderPanel = () => {
    const target = this.surface;
    const g = this.gui;

    const y = 0;
    const x = 0;
    const right = target.width;
    const bottom = target.height;
    const w = right - x;
    const h = bottom - y;
    const objects: LevelObject[] = this.params.editor.level.children;

    const selected = this.params.editor.selected;

    const children: GUIVerticalLayoutChild[] = [];

    children.push(
      ...[
        (position: GUIVerticalLayout) =>
          g.checkbox({
            id: "options.grid",
            label: "Show grid",
            get: () => this.params.editor.showGrid,
            set: (showGrid) => {
              this.params.editor.showGrid = showGrid;
              this.params.editor.renderer.setEditorGrid(showGrid);
            },
            ...position,
          }),

        (position: GUIVerticalLayout) =>
          g.checkbox({
            id: "options.axis",
            label: "Show axis helper",
            get: () => this.params.editor.axisHelper.visible,
            set: (showAxisHelper) => {
              this.params.editor.axisHelper.visible = showAxisHelper;
            },
            ...position,
          }),

        (position: GUIVerticalLayout) =>
          g.drawer({
            id: "objects",
            title: "Objects",
            ...position,
            children: [
              (position) =>
                g.tree({
                  id: "objects.tree",
                  items: objects,
                  selected: this.params.editor.selected,
                  getId: (item) => item.id,
                  onSelect: (item) => {
                    this.params.editor.selectObject(item);
                  },
                  getChildren: (item) => {
                    return isLevelGroup(item) ? item.children : [];
                  },
                  render: (v) => v.name,
                  ...position,
                  h: 150,
                }),
              (position) =>
                g.button({
                  text: "Add Group",
                  ...position,
                  onClick: () => {
                    this.params.editor.addGroup();
                  },
                }),
            ],
          }),
        (position: GUIVerticalLayout) => g.separator({ ...position }),
      ]
    );

    if (selected) {
      children.push((position: GUIVerticalLayout) =>
        g.text({ text: `Selected: ${selected.name}`, ...position })
      );

      let propertiesSheet: GUIVerticalChildCallback | undefined;

      if (isLevelBlock(selected)) {
        propertiesSheet = (position: GUIVerticalLayout) =>
          this.renderGUIBlockProperties({ g, ...position, selected });
      } else if (isLevelMesh(selected)) {
        propertiesSheet = (position: GUIVerticalLayout) =>
          this.renderGUIMeshProperties({ g, ...position, selected });
      } else if (isLevelLight(selected)) {
        propertiesSheet = (position) =>
          this.renderGUILightProperties({
            g,
            ...position,
            selected,
          });
      } else if (isLevelGroup(selected)) {
        propertiesSheet = (position) =>
          this.renderGUIGroupProperties({
            g,
            ...position,
            selected,
          });
      }

      children.push(
        ...[
          (position: GUIVerticalLayout) =>
            g.button({
              text: "Deselect",
              onClick: () => {
                this.params.editor.selectObject(null);
              },
              ...position,
            }),
          // (position: GUIPosition) =>
          //   g.button({
          //     text: "Copy",
          //     onClick: () => {
          //       if (this.cursor.hasMesh()) {
          //         const mesh = this.cursor.releaseMesh();
          //         mesh.parent?.remove(mesh);
          //       }

          //       const newMesh = selected.cloneMesh();

          //       this.cursor.grabMesh(
          //         newMesh,
          //         selected.width,
          //         selected.height,
          //         selected.depth
          //       );
          //       this.scene.add(newMesh);
          //     },
          //     ...position,
          //   }),
          (position: GUIVerticalLayout) =>
            g.button({
              text: "Delete",
              onClick: () => {
                this.params.editor.deleteObject(selected);
              },
              ...position,
            }),
          (position: GUIVerticalLayout) =>
            g.drawer({
              id: "properties._drawer",
              title: `Properties: ${selected.name}`,
              ...position,
              children: [
                (position) =>
                  g.stringProperty({
                    id: "properties.name",
                    name: "Name",
                    get: () => selected.name,
                    set: (v) => (selected.name = v),
                    ...position,
                  }),
                propertiesSheet,
              ],
            }),
        ]
      );
    } else {
      children.push((position: GUIVerticalLayout) =>
        g.text({ text: "Nothing selected", ...position })
      );
    }

    g.panel({
      id: "mainpanel",
      x,
      y,
      w,
      h,
      children,
    });
  };

  renderGUILightProperties({
    g,
    x,
    y,
    w,
    selected,
  }: {
    g: GUI;
    x: number;
    y: number;
    w: number;
    selected: LevelLight;
  }): GUIVerticalDimension {
    return g.childrenVertical({
      x,
      y,
      w,
      children: [
        (position) =>
          g.drawer({
            id: "light.properties.position._drawer",
            title: "Position",
            ...position,
            children: [
              (position) =>
                g.numericProperty({
                  id: "light.properties.position.x",
                  name: "X",
                  get: () => selected.x,
                  set: (v) => selected.setX(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "light.properties.position.y",
                  name: "Y",
                  get: () => selected.y,
                  set: (v) => selected.setY(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "light.properties.position.z",
                  name: "Z",
                  get: () => selected.z,
                  set: (v) => selected.setZ(v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.colorField({
            id: "light.properties.color",
            color: selected.color,
            onChange: () => {
              // needed because the directionallight is a three.color
              selected.updateLight();
            },
            ...position,
          }),
        (position) =>
          g.numericProperty({
            id: "light.properties.intensity",
            name: "Intensity",
            get: () => selected.intensity,
            set: (v) => selected.setIntensity(v),
            ...position,
          }),
      ],
    });
  }

  renderGUIGroupProperties({
    g,
    x,
    y,
    w,
    selected,
  }: {
    g: GUI;
    x: number;
    y: number;
    w: number;
    selected: LevelGroup;
  }): GUIVerticalDimension {
    return g.childrenVertical({
      x,
      y,
      w,
      children: [
        (position) =>
          g.checkbox({
            id: "properties.visible",
            label: "Visible",
            get: () => selected.getInternal().visible,
            set: (v) => (selected.getInternal().visible = v),
            ...position,
          }),
      ],
    });
  }

  renderGUIBlockProperties({
    g,
    x,
    y,
    w,
    selected,
  }: {
    g: GUI;
    x: number;
    y: number;
    w: number;
    selected: LevelBlock;
  }): GUIVerticalDimension {
    const material = selected.getMesh().material;

    return g.childrenVertical({
      x,
      y,
      w,
      children: [
        (position) =>
          g.checkbox({
            id: "properties.visible",
            label: "Visible",
            get: () => selected.getMesh().visible,
            set: (v) => (selected.getMesh().visible = v),
            ...position,
          }),
        (position) =>
          g.drawer({
            id: "properties.position._drawer",
            title: "Position",
            ...position,
            previewChildren: [
              (position) =>
                g.text({
                  ...position,
                  text: `${selected.x}, ${selected.y}, ${selected.z}`,
                  font: g.style.font.numeric,
                  align: "right",
                }),
            ],
            children: [
              (position) =>
                g.numericProperty({
                  id: "properties.position.x",
                  name: "X",
                  get: () => selected.x,
                  set: (v) => selected?.setX(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.position.y",
                  name: "Y",
                  get: () => selected.y,
                  set: (v) => selected?.setY(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.position.z",
                  name: "Z",
                  get: () => selected.z,
                  set: (v) => selected?.setZ(v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.drawer({
            id: "properties.scale._drawer",
            title: "Scale",
            ...position,
            previewChildren: [
              (position) =>
                g.text({
                  ...position,
                  text: `${selected.width}, ${selected.height}, ${selected.depth}`,
                  font: g.style.font.numeric,
                  align: "right",
                }),
            ],
            children: [
              (position) =>
                g.numericProperty({
                  id: "properties.scale.x",
                  name: "X",
                  get: () => selected.width,
                  set: (v) => selected?.setWidth(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.scale.y",
                  name: "Y",
                  get: () => selected.height,
                  set: (v) => selected?.setHeight(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.scale.z",
                  name: "Z",
                  get: () => selected.depth,
                  set: (v) => selected?.setDepth(v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.drawer({
            id: "properties.rotation._drawer",
            title: "Rotation",
            ...position,
            previewChildren: [
              (position) =>
                g.text({
                  ...position,
                  text: `${selected.rotX}, ${selected.rotY}, ${selected.rotZ}`,
                  font: g.style.font.numeric,
                  align: "right",
                }),
            ],
            children: [
              (position) =>
                g.numericProperty({
                  id: "properties.rotation.x",
                  name: "X",
                  get: () => selected.rotX,
                  set: (v) => selected?.setRotationX(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.rotation.y",
                  name: "Y",
                  get: () => selected.rotY,
                  set: (v) => selected?.setRotationY(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.rotation.z",
                  name: "Z",
                  get: () => selected.rotZ,
                  set: (v) => selected?.setRotationZ(v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.drawer({
            id: "properties.material._drawer",
            title: "Material",
            ...position,
            children: [
              (position) =>
                g.colorField({
                  id: "properties.material.color",
                  ...position,
                  color: material.color,
                }),

              (position) =>
                g.numericProperty({
                  id: "properties.material.shininess",
                  name: "Shininess",
                  get: () => material.shininess,
                  set: (v) => (material.shininess = v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.material.opacity",
                  name: "Opacity",
                  get: () => material.opacity,
                  set: (v) => (material.opacity = v),
                  ...position,
                }),
              (position) =>
                g.checkbox({
                  id: "properties.material.transparent",
                  label: "Transparent",
                  get: () => material.transparent,
                  set: (v) => (material.transparent = v),
                  ...position,
                }),
            ],
          }),
      ],
    });
  }

  renderGUIMeshProperties({
    g,
    x,
    y,
    w,
    selected,
  }: {
    g: GUI;
    x: number;
    y: number;
    w: number;
    selected: LevelMesh;
  }): GUIVerticalDimension {
    const mesh = selected.mesh;
    const material = selected.mesh.material;

    return g.childrenVertical({
      x,
      y,
      w,
      children: [
        (position) =>
          g.checkbox({
            id: "properties.visible",
            label: "Visible",
            get: () => mesh.visible,
            set: (v) => (mesh.visible = v),
            ...position,
          }),
        (position) =>
          g.dropdownProperty<LevelGroup | LevelState>({
            id: "properties.parent",
            name: "Parent",
            items: [this.params.editor.level],
            onSelect: (item: LevelGroup | LevelState) => {
              const oldParent = selected.parent;
              oldParent?.remove(selected);
              item.add(selected);
            },
            selected: selected.parent,
            getChildren: (item) =>
              isLevelGroup(item) || isLevelState(item)
                ? (item.children.filter(
                    (child) => child !== selected && isLevelGroup(child)
                  ) as LevelGroup[])
                : [],
            getId: (item) => item.id,
            render: (item) => item.name,
            dropdownWidth: 300,
            ...position,
          }),
        (position) =>
          g.drawer({
            id: "properties.position._drawer",
            title: "Position",
            ...position,
            previewFullWidth: true,
            previewChildren: [
              (position) =>
                g.text({
                  ...position,
                  text: `(${mesh.position.x.toFixed(
                    1
                  )}, ${mesh.position.y.toFixed(1)}, ${mesh.position.z.toFixed(
                    1
                  )})`,
                  font: g.style.font.numeric,
                  align: "right",
                }),
            ],
            children: [
              (position) =>
                g.numericProperty({
                  id: "properties.position.x",
                  name: "X",
                  get: () => mesh.position.x,
                  set: (v) => selected?.mesh.position.setX(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.position.y",
                  name: "Y",
                  get: () => mesh.position.y,
                  set: (v) => selected?.mesh.position.setY(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.position.z",
                  name: "Z",
                  get: () => mesh.position.z,
                  set: (v) => selected?.mesh.position.setZ(v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.drawer({
            id: "properties.scale._drawer",
            title: "Scale",
            ...position,
            previewFullWidth: true,
            previewChildren: [
              (position) =>
                g.text({
                  ...position,
                  text: `(${mesh.scale.x.toFixed(1)}, ${mesh.scale.y.toFixed(
                    1
                  )}, ${mesh.scale.z.toFixed(1)})`,
                  font: g.style.font.numeric,
                  align: "right",
                }),
            ],
            children: [
              (position) =>
                g.numericProperty({
                  id: "properties.scale.x",
                  name: "X",
                  get: () => mesh.scale.x,
                  set: (v) => mesh.scale.setX(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.scale.y",
                  name: "Y",
                  get: () => mesh.scale.y,
                  set: (v) => mesh.scale.setY(v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.scale.z",
                  name: "Z",
                  get: () => mesh.scale.z,
                  set: (v) => mesh.scale.setZ(v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.drawer({
            id: "properties.rotation._drawer",
            title: "Rotation",
            ...position,
            previewFullWidth: true,
            previewChildren: [
              (position) =>
                g.text({
                  ...position,
                  text: `\u03c0(${mesh.rotation.x.toFixed(
                    1
                  )}, ${mesh.rotation.y.toFixed(1)}, ${mesh.rotation.z.toFixed(
                    1
                  )})`,
                  font: g.style.font.numeric,
                  align: "right",
                }),
            ],
            children: [
              (position) =>
                g.numericProperty({
                  id: "properties.rotation.x",
                  name: "X",
                  multiplier: Math.PI,
                  multiplierSymbol: "\u03c0",
                  get: () => mesh.rotation.x,
                  set: (v) => (mesh.rotation.x = v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.rotation.y",
                  name: "Y",
                  multiplier: Math.PI,
                  multiplierSymbol: "\u03c0",
                  get: () => mesh.rotation.y,
                  set: (v) => (mesh.rotation.y = v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.rotation.z",
                  name: "Z",
                  multiplier: Math.PI,
                  multiplierSymbol: "\u03c0",
                  get: () => mesh.rotation.z,
                  set: (v) => (mesh.rotation.z = v),
                  ...position,
                }),
            ],
          }),
        (position) =>
          g.drawer({
            id: "properties.material._drawer",
            title: "Material",
            ...position,
            children: [
              (position) =>
                g.colorField({
                  id: "properties.material.color",
                  ...position,
                  color: material.color,
                }),

              (position) =>
                g.numericProperty({
                  id: "properties.material.shininess",
                  name: "Shininess",
                  get: () => material.shininess,
                  set: (v) => (material.shininess = v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.material.roughness",
                  name: "Roughness",
                  get: () => material.roughness,
                  set: (v) => (material.roughness = v),
                  ...position,
                }),
              (position) =>
                g.numericProperty({
                  id: "properties.material.opacity",
                  name: "Opacity",
                  get: () => material.opacity,
                  set: (v) => (material.opacity = v),
                  ...position,
                }),
              (position) =>
                g.checkbox({
                  id: "properties.material.transparent",
                  label: "Transparent",
                  get: () => material.transparent,
                  set: (v) => (material.transparent = v),
                  ...position,
                }),
              (position) =>
                g.textureField({
                  id: "properties.material.texture",
                  title: "Texture",
                  ...position,
                  texture: material.texture,
                  onChange: (texture) => (material.texture = texture),
                }),
              (position) =>
                g.textureField({
                  id: "properties.material.normalMap",
                  title: "Normal Map",
                  ...position,
                  texture: material.normalMap,
                  onChange: (texture) => (material.normalMap = texture),
                }),
              (position) =>
                g.textureField({
                  id: "properties.material.specularMap",
                  title: "Specular Map",
                  ...position,
                  texture: material.specularMap,
                  onChange: (texture) => (material.specularMap = texture),
                }),
            ],
          }),
      ],
    });
  }
}
