import { GUIVerticalLayout } from "../gui/GUI";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface LoadPanelParams extends PanelParams {
  initialFilename: string;
  onCancel: () => void;
  onLoad: (filename: string) => void;
}

export interface LoadPanelState extends PanelState {
  filename: string;
  selected?: DirectoryEntry;
  error?: string;
}

export class LoadPanel extends Panel<LoadPanelParams, LoadPanelState> {
  type = "load";

  isModal() {
    return true;
  }

  getInitialState(): LoadPanelState {
    return {
      filename: this.params.initialFilename,
    };
  }

  setError(error: string) {
    this.state.error = error;
  }

  renderChildren() {
    this.renderLoadDialog();
  }

  renderLoadDialog = () => {
    const { selected } = this.state;

    const isValidFile =
      selected && selected.fileName.match(/\.isolevel\.json$/) ? true : false;

    this.gui.panel({
      id: "load",
      title: "Load",
      scrollable: false,
      border: true,
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      children: [
        (position: GUIVerticalLayout) =>
          this.gui.text({
            text: this.state.error,
            ...position,
            color: Color.OrangeRed,
          }),
        (position: GUIVerticalLayout) =>
          this.gui.tree<DirectoryEntry>({
            id: "load.file",
            ...position,
            h: this.surface.height - 128,
            items: this.getItems("~/"),
            selected: this.state.selected,
            render: (entry) => entry.fileName,
            getId: (entry) => entry.fullPath,
            onSelect: (entry) => {
              this.state.selected = entry;
            },
            getChildren: (entry) =>
              entry.isDirectory ? this.getItems(entry.fullPath) : [],
          }),
        (position: GUIVerticalLayout) =>
          this.gui.button({
            text: "Load",
            enabled: isValidFile,
            onClick: () => {
              this.params.onLoad(this.state.selected!.fullPath);
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
  };

  private itemsCache: Record<string, DirectoryEntry[]> = {};

  getItems(path: string) {
    if (this.itemsCache[path] === undefined) {
      const entries = Array.from(new DirectoryStream(path));
      this.itemsCache[path] = entries;
    }

    return this.itemsCache[path];
  }
}
