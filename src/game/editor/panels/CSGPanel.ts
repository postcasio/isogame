import { GUIVerticalLayout } from "../gui/GUI";
import { isLevelGroup } from "../LevelGroup";
import { LevelObject } from "../LevelObject";
import { LevelState } from "../LevelState";
// import { getDefaultGeometry, LevelGeometry } from "../LevelMesh";
import { Panel, PanelParams, PanelState } from "../Panel";

export type CSGOperator = "union" | "subtract" | "intersect";

export interface CSGOperation {
  operator: CSGOperator;
  left: LevelObject;
  right: LevelObject;
}

export interface CSGPanelParams extends PanelParams {
  level: LevelState;
  onCancel: () => void;
  onSubmit: (operation: CSGOperation) => void;
}

export interface CSGPanelState extends PanelState {
  operation: Partial<CSGOperation>;
}

export class CSGPanel extends Panel<CSGPanelParams, CSGPanelState> {
  type = "csg";

  isModal() {
    return true;
  }

  getInitialState(): CSGPanelState {
    return {
      operation: {
        operator: undefined,
        left: undefined,
        right: undefined,
      },
    };
  }

  renderChildren() {
    this.gui.panel({
      id: "csg",
      title: "CSG Operation",
      scrollable: true,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position) =>
          this.gui.dropdownProperty<CSGOperator>({
            id: "csg.operator",
            name: "Operator",
            ...position,
            items: ["union", "subtract", "intersect"],
            onSelect: (operator) => (this.state.operation.operator = operator),
            selected: this.state.operation.operator,
            render: (operator) =>
              operator.substr(0, 1).toUpperCase() + operator.substr(1),
          }),

        (position) =>
          this.gui.dropdownProperty<LevelObject>({
            id: "csg.left",
            name: "Left",
            ...position,
            items: this.params.level.children,
            onSelect: (item) => (this.state.operation.left = item),
            selected: this.state.operation.left,
            render: (item) => item.name,
            getChildren: (item) => (isLevelGroup(item) ? item.children : []),
          }),

        (position) =>
          this.gui.dropdownProperty<LevelObject>({
            id: "csg.right",
            name: "Right",
            ...position,
            items: this.params.level.children,
            onSelect: (item) => (this.state.operation.right = item),
            selected: this.state.operation.right,
            render: (item) => item.name,
            getChildren: (item) => (isLevelGroup(item) ? item.children : []),
          }),

        (position: GUIVerticalLayout) =>
          this.gui.button({
            text: "Create",
            enabled: true,
            onClick: () => {
              this.params.onSubmit(this.state.operation as CSGOperation);
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
