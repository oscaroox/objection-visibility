"use strict";

import { Model } from "objection";
import { omit, pick } from "./utils";

interface IConstructor extends Function {
  hidden: string[];
  visible: string[];
}

/**
 * Fix for ts error: "A mixin class must have a constructor with a single rest parameter of type 'any[]'."
 * adding the constructor with rest parameter doesnt get rid of the error.
 */
type Constructor<A = object> = new (...input: any[]) => A

export default <M extends Constructor<Model>>(ModelClass:  M): M => {
  return class extends ModelClass {

    // does not work
    // constructor(...args: any[]) {
    //   super();
    // }

    public $formatJson(json: {}) {
      let formattedJson = super.$formatJson(json);

      const conf = this.constructor as IConstructor;

      if (!conf.hidden && !conf.visible) { return formattedJson; }

      if (conf.visible) {
        formattedJson = pick(formattedJson, conf.visible);
      }

      if (conf.hidden) {
        formattedJson = omit(formattedJson, conf.hidden);
      }

      return formattedJson;
    }
  } as M;
};
