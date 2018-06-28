"use strict";
import omit from "lodash.omit";
import pick from "lodash.pick";
import { Model, Plugin } from "objection";

interface IConstructor extends Function {
  hidden: string[];
  visible: string[];
}

export default <M extends typeof Model>(ModelClass: typeof Model): M => {
  return class extends ModelClass {
    public $formatJson(json: {}) {
      let superJson = super.$formatJson(json);

      const conf = this.constructor as IConstructor;

      if (!conf.hidden && !conf.visible) { return superJson; }

      if (conf.visible) {
        superJson = pick(superJson, conf.visible);
      }

      if (conf.hidden) {
        superJson = omit(superJson, conf.hidden);
      }

      return superJson;
    }
  } as M;
};
