import { GUIVerticalLayout } from "../gui/GUI";
import { getDefaultGeometry, LevelMeshConeGeometry } from "../LevelMesh";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface MeshConePanelParams extends PanelParams {
  onCancel: () => void;
  onCreate: (geometry: LevelMeshConeGeometry) => void;
}

export interface MeshConePanelState extends PanelState {
  geometry: LevelMeshConeGeometry;
}

export class MeshConePanel extends Panel<
  MeshConePanelParams,
  MeshConePanelState
> {
  type = "meshcone";

  isModal() {
    return true;
  }

  getInitialState(): MeshConePanelState {
    return {
      geometry: getDefaultGeometry("cone"),
    };
  }

  renderChildren() {
    this.gui.panel({
      id: "meshcone",
      title: "Add Mesh: Cone",
      scrollable: true,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.numericProperty({
            id: "meshcone.radius",
            name: "Radius",
            ...position,
            get: () => this.state.geometry.radius,
            set: (v) => (this.state.geometry.radius = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcone.height",
            name: "Height",
            ...position,
            get: () => this.state.geometry.height,
            set: (v) => (this.state.geometry.height = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcone.radialSegments",
            name: "Radial Segments",
            ...position,
            get: () => this.state.geometry.radialSegments,
            set: (v) => (this.state.geometry.radialSegments = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcone.heightSegments",
            name: "Height Segments",
            ...position,
            get: () => this.state.geometry.heightSegments,
            set: (v) => (this.state.geometry.heightSegments = v),
          }),
        (position) =>
          this.gui.checkbox({
            id: "meshcone.openEnded",
            label: "Open Ended",
            ...position,
            get: () => this.state.geometry.openEnded,
            set: (v) => (this.state.geometry.openEnded = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcone.thetaStart",
            name: "Theta Start",
            multiplierSymbol: "\u03c0",
            multiplier: Math.PI,
            ...position,
            get: () => this.state.geometry.thetaStart,
            set: (v) => (this.state.geometry.thetaStart = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcone.thetaLength",
            name: "Theta Length",
            multiplierSymbol: "\u03c0",
            multiplier: Math.PI,
            ...position,
            get: () => this.state.geometry.thetaLength,
            set: (v) => (this.state.geometry.thetaLength = v),
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
