'use strict'
const omit = require('lodash.omit')
const pick = require('lodash.pick')

module.exports = (Model) => {
  return class VisibilityPlugin extends Model {
    $formatJson (json) {
      let superJson = super.$formatJson(json)

      if (!this.constructor.hidden && !this.constructor.visible) return superJson

      if (this.constructor.visible) {
        superJson = pick(superJson, this.constructor.visible)
      }

      if (this.constructor.hidden) {
        superJson = omit(superJson, this.constructor.hidden)
      }

      return superJson
    }
  }
}
