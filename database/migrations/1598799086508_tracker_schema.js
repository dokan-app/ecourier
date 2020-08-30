"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class TrackerSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create("trackers", (table) => {
      table.uuid("id").primary().defaultTo(this.db.raw("uuid_generate_v4()"));
      table.string("status_message");
      table.string("tracking_id").unsigned().index();
      table.timestamps();
      table.foreign("tracking_id").references("parcels.tracking_id");
    });
  }

  down() {
    this.drop("trackers");
  }
}

module.exports = TrackerSchema;
