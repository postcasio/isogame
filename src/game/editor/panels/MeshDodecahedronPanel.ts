import { GUIVerticalLayout } from "../gui/GUI";
import {
  getDefaultGeometry,
  LevelMeshDodecahedronGeometry,
} from "../LevelMesh";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface MeshDodecahedronPanelParams extends PanelParams {
  onCancel: () => void;
  onCreate: (geometry: LevelMeshDodecahedronGeometry) => void;
}

export interface MeshDodecahedronPanelState extends PanelState {
  geometry: LevelMeshDodecahedronGeometry;
}

export class MeshDodecahedronPanel extends Panel<
  MeshDodecahedronPanelParams,
  MeshDodecahedronPanelState
> {
  type = "meshdodecahedron";

  isModal() {
    return true;
  }

  getInitialState(): MeshDodecahedronPanelState {
    return {
      geometry: getDefaultGeometry("dodecahedron"),
    };
  }

  renderChildren() {
    this.gui.panel({
      id: "meshdodecahedron",
      title: "Add Mesh: Dodecahedron",
      scrollable: true,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.numericProperty({
            id: "meshdodecahedron.radius",
            name: "Radius",
            ...position,
            get: () => this.state.geometry.radius,
            set: (v) => (this.state.geometry.radius = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshdodecahedron.detail",
            name: "Detail",
            ...position,
            get: () => this.state.geometry.detail,
            set: (v) => (this.state.geometry.detail = v),
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
