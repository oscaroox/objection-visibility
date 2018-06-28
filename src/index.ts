'use strict'
import omit from 'lodash.omit';
import pick from 'lodash.pick';
import { Model } from 'objection';

interface IConstructor extends Function {
  hidden: string[];
  visible: string[];
}

export default (ModelClass: typeof Model) => {
  return <typeof Model>class extends ModelClass {
    $formatJson (json: {}) {
      let superJson = super.$formatJson(json)

      let conf = this.constructor as IConstructor;

      if (!conf.hidden && !conf.visible) return superJson

      if (conf.visible) {
        superJson = pick(superJson, conf.visible)
      }

      if (conf.hidden) {
        superJson = omit(superJson, conf.hidden)
      }

      return superJson
    }
  }
}
