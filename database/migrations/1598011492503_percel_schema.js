'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PercelSchema extends Schema {
  up () {
    this.create('percels', (table) => {
      table.increments()
      table.timestamps()
    })
  }

  down () {
    this.drop('percels')
  }
}

module.exports = PercelSchema
