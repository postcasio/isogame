import { GUIVerticalLayout } from "../gui/GUI";
import { Panel, PanelParams, PanelState } from "../Panel";

export interface SavePanelParams extends PanelParams {
  initialFilename: string;
  onCancel: () => void;
  onSave: (filename: string, pretty: boolean) => void;
}

export interface SavePanelState extends PanelState {
  filename: string;
  error?: string;
  selected?: DirectoryEntry;
  pretty: boolean;
}

export class SavePanel extends Panel<SavePanelParams, SavePanelState> {
  type = "save";

  isModal() {
    return true;
  }

  getInitialState(): SavePanelState {
    return {
      filename: this.params.initialFilename,
      pretty: true,
    };
  }

  setError(error: string) {
    this.state.error = error;
  }

  renderChildren() {
    this.renderSaveDialog();
  }

  renderSaveDialog = () => {
    this.gui.panel({
      id: "save",
      x: 0,
      y: 0,
      w: this.surface.width,
      h: this.surface.height,
      scrollable: false,
      border: true,
      title: "Save",
      children: [
        (position: GUIVerticalLayout) =>
          this.gui.text({
            text: this.state.error,
            ...position,
            color: Color.OrangeRed,
          }),
        (position: GUIVerticalLayout) =>
          this.gui.tree<DirectoryEntry>({
            id: "save.file",
            ...position,
            h: this.surface.height - 184,
            items: this.getItems("~/"),
            selected: this.state.selected,
            render: (entry) => entry.fileName,
            getId: (entry) => entry.fullPath,
            onSelect: (entry) => {
              this.state.selected = entry;
              if (!entry.isDirectory) {
                this.state.filename = entry.fileName;
              }
            },
            getChildren: (entry) =>
              entry.isDirectory ? this.getItems(entry.fullPath) : [],
          }),
        (position: GUIVerticalLayout) =>
          this.gui.field({
            id: "save.filename",
            get: () => this.state.filename,
            set: (v) => (this.state.filename = v),
            ...position,
          }),
        (position: GUIVerticalLayout) =>
          this.gui.checkbox({
            id: "save.pretty",
            label: "Prettify",
            get: () => this.state.pretty,
            set: (v) => (this.state.pretty = v),
            ...position,
          }),
        (position: GUIVerticalLayout) =>
          this.gui.button({
            text: "Save",
            onClick: () => {
              if (this.state.selected!.isDirectory) {
                this.params.onSave(
                  `${this.state.selected!.fullPath}/${this.state.filename}`,
                  this.state.pretty
                );
              } else {
                const directory = FS.directoryOf(this.state.selected!.fullPath);
                this.params.onSave(
                  `${directory}/${this.state.filename}`,
                  this.state.pretty
                );
              }
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
