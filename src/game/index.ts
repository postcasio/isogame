import "./compat";

import { Editor } from "./editor/index";

export default function game(): void {
  const editor = new Editor();
  editor.start();
}
