import { GUIVerticalLayout } from "../gui/GUI";
import { getDefaultGeometry, LevelMeshSphereGeometry } from "../LevelMesh";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface MeshSpherePanelParams extends PanelParams {
  onCancel: () => void;
  onCreate: (geometry: LevelMeshSphereGeometry) => void;
}

export interface MeshSpherePanelState extends PanelState {
  geometry: LevelMeshSphereGeometry;
}

export class MeshSpherePanel extends Panel<
  MeshSpherePanelParams,
  MeshSpherePanelState
> {
  type = "meshsphere";

  isModal() {
    return true;
  }

  getInitialState(): MeshSpherePanelState {
    return {
      geometry: getDefaultGeometry("sphere"),
    };
  }

  renderChildren() {
    this.gui.panel({
      id: "meshsphere",
      title: "Add Mesh: Sphere",
      scrollable: true,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.radius",
            name: "Radius",
            ...position,
            get: () => this.state.geometry.radius,
            set: (v) => (this.state.geometry.radius = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.widthSegments",
            name: "Width Segments",
            ...position,
            get: () => this.state.geometry.widthSegments,
            set: (v) => (this.state.geometry.widthSegments = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.heightSegments",
            name: "Height Segments",
            ...position,
            get: () => this.state.geometry.heightSegments,
            set: (v) => (this.state.geometry.heightSegments = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.phiStart",
            name: "Phi Start",
            multiplierSymbol: "\u03c0",
            multiplier: Math.PI,
            ...position,
            get: () => this.state.geometry.phiStart,
            set: (v) => (this.state.geometry.phiStart = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.phiLength",
            name: "Phi Length",
            multiplierSymbol: "\u03c0",
            multiplier: Math.PI,
            ...position,
            get: () => this.state.geometry.phiLength,
            set: (v) => (this.state.geometry.phiLength = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.thetaStart",
            name: "Theta Start",
            multiplierSymbol: "\u03c0",
            multiplier: Math.PI,
            ...position,
            get: () => this.state.geometry.thetaStart,
            set: (v) => (this.state.geometry.thetaStart = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshsphere.thetaLength",
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
