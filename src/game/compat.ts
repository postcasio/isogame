// require("core-js/stable");
import * as THREE from "three";

global.setTimeout = (callback: () => void, time: number) => {
  Dispatch.later(time / 16, callback);
};

global.console = {
  log: (...args: any) => SSj.log(args),
  error: (...args: any) => SSj.log(args),
  warn: (...args: any) => SSj.log(args),
};

global.window = {};
global.THREE = THREE;

global.XMLHttpRequest = class XMLMHttpRequest {
  private loadCallback?: (event?: any) => void;
  url?: string;
  responseText?: string;
  status?: number;

  open(method: string, url: string) {
    this.url = url;
    SSj.log(method + " " + url);
  }

  addEventListener(event: string, callback: (event: any) => void) {
    SSj.log(event);
    if (event === "load") {
      this.loadCallback = callback;
    }
  }

  send() {
    Dispatch.now(() => {
      this.status = 200;
      this.responseText = FS.readFile(this.url!);
      this.response = this.responseText;
      SSj.log("calling callback");

      // this.loadCallback?.call(this, {
      //   type: "progress",
      //   loaded: this.responseText.length,
      // });

      this.loadCallback?.call(this, {
        type: "load",
        loaded: this.responseText.length,
      });
    });
  }
};
