"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParcelSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create("parcels", (table) => {
      table.uuid("id").primary().defaultTo(this.db.raw("uuid_generate_v4()"));
      table.string("tracking_id");
      table.string("customer_name");
      table.string("customer_phone");
      table.string("customer_address");
      table.string("invoice_id");
      table.integer("parcel_price");
      table.boolean("cod_collected").defaultTo(false);
      table.integer("weight");

      table.uuid("area_id").unsigned().index();
      table.uuid("zone_id").unsigned().index();
      table.uuid("user_id").unsigned().index();
      table.uuid("shop_id").unsigned().index();

      table.timestamps();

      table.foreign("area_id").references("areas.id");
      table.foreign("shop_id").references("shops.id");
      table.foreign("zone_id").references("zones.id");
      table.foreign("user_id").references("users.id");
    });
  }

  down() {
    this.drop("parcels");
  }
}

module.exports = ParcelSchema;
