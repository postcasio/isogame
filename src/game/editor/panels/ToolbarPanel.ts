import { Editor } from "..";
import { LevelLight } from "../LevelLight";
import { isLevelMesh, LevelMesh, LevelMeshGeometryType } from "../LevelMesh";
import { LevelObject } from "../LevelObject";
import { Panel, PanelParams, PanelState } from "../Panel";
import { CSG } from "threejs-csg/build/csg.cjs";

export interface ToolbarPanelParams extends PanelParams {
  editor: Editor;
}

export interface ToolbarPanelState extends PanelState {
  objectMode: "place" | "add";
}

export class ToolbarPanel extends Panel<ToolbarPanelParams, ToolbarPanelState> {
  type = "toolbar";

  getInitialState(): ToolbarPanelState {
    return {
      objectMode: "add",
    };
  }

  renderChildren() {
    // const { objectMode } = this.state;

    this.gui.toolbar({
      id: "maintoolbar",
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.button({
            text: "Save",
            onClick: () => {
              this.params.editor.openSaveDialog();
            },
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "Load",
            onClick: () => {
              this.params.editor.openLoadDialog();
            },
            ...position,
          }),
        // (position) =>
        //   this.gui.separator({
        //     ...position,
        //   }),
        // (position) =>
        //   this.gui.button({
        //     text: "Place",
        //     pushed: objectMode === "place",
        //     onClick: () => {
        //       this.state.objectMode = "place";
        //     },
        //     ...position,
        //   }),
        // (position) =>
        //   this.gui.button({
        //     text: "Add",
        //     pushed: objectMode === "add",
        //     onClick: () => {
        //       this.state.objectMode = "add";
        //     },
        //     ...position,
        //   }),
        (position) =>
          this.gui.separator({
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "Box",
            onClick: async () => {
              this.createMesh("box");
            },
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "Sphere",
            onClick: async () => {
              this.createMesh("sphere");
            },
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "Cone",
            onClick: async () => {
              this.createMesh("cone");
            },
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "Cylinder",
            onClick: async () => {
              this.createMesh("cylinder");
            },
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "Dodecahedron",
            onClick: async () => {
              this.createMesh("dodecahedron");
            },
            ...position,
          }),
        (position) => this.gui.separator({ ...position }),
        (position) =>
          this.gui.button({
            text: "Light",
            onClick: async () => {
              this.createLight();
            },
            ...position,
          }),
        (position) =>
          this.gui.separator({
            ...position,
          }),
        (position) =>
          this.gui.button({
            text: "CSG",
            onClick: async () => {
              this.csgOp();
            },
            ...position,
          }),
      ],
    });
  }

  putObject(object: LevelObject) {
    switch (this.state.objectMode) {
      case "add":
        this.params.editor.addObject(object, true);
        break;
      case "place":
        break;
    }
  }

  async createMesh(type: LevelMeshGeometryType) {
    try {
      this.putObject(await this.params.editor.openMeshDialog(type));
      // eslint-disable-next-line no-empty
    } catch {}
  }

  async createLight() {
    this.putObject(new LevelLight(20, 20, 20, Color.White, 1.0));
  }

  async csgOp() {
    try {
      const {
        operator,
        left,
        right,
      } = await this.params.editor.openCSGDialog();

      if (!isLevelMesh(left) || !isLevelMesh(right)) {
        throw new Error("Not meshes!");
      }

      SSj.log("making new geometry");

      const csg = new CSG();

      csg[operator]([left.getInternal(), right.getInternal()]);

      const newGeometry = csg.toGeometry();

      const mesh = new LevelMesh({ type: "custom", data: newGeometry });

      this.putObject(mesh);
    } catch (e) {
      SSj.log(e);
    }
  }
}
