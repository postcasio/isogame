import { GUIVerticalLayout } from "../gui/GUI";
import { getDefaultGeometry, LevelMeshCylinderGeometry } from "../LevelMesh";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface MeshCylinderPanelParams extends PanelParams {
  onCancel: () => void;
  onCreate: (geometry: LevelMeshCylinderGeometry) => void;
}

export interface MeshCylinderPanelState extends PanelState {
  geometry: LevelMeshCylinderGeometry;
}

export class MeshCylinderPanel extends Panel<
  MeshCylinderPanelParams,
  MeshCylinderPanelState
> {
  type = "meshcylinder";

  isModal() {
    return true;
  }

  getInitialState(): MeshCylinderPanelState {
    return {
      geometry: getDefaultGeometry("cylinder"),
    };
  }

  renderChildren() {
    this.gui.panel({
      id: "meshcylinder",
      title: "Add Mesh: Cylinder",
      scrollable: true,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.radiusTop",
            name: "Radius Top",
            ...position,
            get: () => this.state.geometry.radiusTop,
            set: (v) => (this.state.geometry.radiusTop = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.radiusBottom",
            name: "Radius Bottom",
            ...position,
            get: () => this.state.geometry.radiusBottom,
            set: (v) => (this.state.geometry.radiusBottom = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.height",
            name: "Height",
            ...position,
            get: () => this.state.geometry.height,
            set: (v) => (this.state.geometry.height = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.radialSegments",
            name: "Radial Segments",
            ...position,
            get: () => this.state.geometry.radialSegments,
            set: (v) => (this.state.geometry.radialSegments = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.heightSegments",
            name: "Height Segments",
            ...position,
            get: () => this.state.geometry.heightSegments,
            set: (v) => (this.state.geometry.heightSegments = v),
          }),
        (position) =>
          this.gui.checkbox({
            id: "meshcylinder.openEnded",
            label: "Open Ended",
            ...position,
            get: () => this.state.geometry.openEnded,
            set: (v) => (this.state.geometry.openEnded = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.thetaStart",
            name: "Theta Start",
            multiplierSymbol: "\u03c0",
            multiplier: Math.PI,
            ...position,
            get: () => this.state.geometry.thetaStart,
            set: (v) => (this.state.geometry.thetaStart = v),
          }),
        (position) =>
          this.gui.numericProperty({
            id: "meshcylinder.thetaLength",
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
