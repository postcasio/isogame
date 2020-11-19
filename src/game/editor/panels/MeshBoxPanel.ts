import { GUIVerticalLayout } from "../gui/GUI";
import { getDefaultGeometry, LevelMeshBoxGeometry } from "../LevelMesh";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface MeshBoxPanelParams extends PanelParams {
  onCancel: () => void;
  onCreate: (geometry: LevelMeshBoxGeometry) => void;
}

export interface MeshBoxPanelState extends PanelState {
  geometry: LevelMeshBoxGeometry;
}

export class MeshBoxPanel extends Panel<MeshBoxPanelParams, MeshBoxPanelState> {
  type = "meshbox";

  isModal() {
    return true;
  }

  getInitialState(): MeshBoxPanelState {
    return {
      geometry: getDefaultGeometry("box"),
    };
  }

  renderChildren() {
    this.gui.panel({
      id: "meshbox",
      title: "Add Mesh: Box",
      scrollable: true,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.numericProperty({
            id: "meshbox.width",
            name: "Width",
            ...position,
            get: () => this.state.geometry.width,
            set: (v) => (this.state.geometry.width = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshbox.height",
            name: "Height",
            ...position,
            get: () => this.state.geometry.height,
            set: (v) => (this.state.geometry.height = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshbox.depth",
            name: "Depth",
            ...position,
            get: () => this.state.geometry.depth,
            set: (v) => (this.state.geometry.depth = v),
          }),
        (position: GUIVerticalLayout) =>
          this.gui.button({
            text: "Create",
            enabled: true,
            onClick: () => {
              this.params.onCreate(this.state.geometry);
            },
            ...position,
          }),
        (position: GUIVerticalLayout) =>
          this.gui.button({
            text: "Cancel",
            onClick: this.params.onCancel,
            ...position,
          }),
      ],
    });
  }
}
