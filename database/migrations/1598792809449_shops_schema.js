"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ShopSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create("shops", (table) => {
      table.uuid("id").primary().defaultTo(this.db.raw("uuid_generate_v4()"));
      table.string("name", 80).notNullable();
      table.string("pickup_address", 220).notNullable();
      table.string("shop_phone", 15).notNullable();
      table.uuid("area_id").unsigned().index();
      table.uuid("zone_id").unsigned().index();
      table.uuid("user_id").unsigned().index();
      table.timestamps();

      table.foreign("area_id").references("areas.id");
      table.foreign("zone_id").references("zones.id");
      table.foreign("user_id").references("users.id");
    });
  }

  down() {
    this.drop("shops");
  }
}

module.exports = ShopSchema;
