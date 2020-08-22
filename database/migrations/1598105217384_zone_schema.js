"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ZoneSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create("zones", (table) => {
      table.uuid("id").primary().defaultTo(this.db.raw("uuid_generate_v4()"));
      table.string("name");
      table.timestamps();
    });
  }

  down() {
    this.drop("zones");
  }
}

module.exports = ZoneSchema;
