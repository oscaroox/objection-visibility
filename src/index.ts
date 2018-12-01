"use strict";

import { Model } from "objection";
import { omit, pick } from "./utils";

interface IConstructor extends Function {
  hidden: string[];
  visible: string[];
}

export default <M extends typeof Model>(ModelClass: typeof Model): M => {
  return class extends ModelClass {
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
