"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParcelSchema extends Schema {
  async up() {
    await this.db.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    this.create("parcels", (table) => {
      table.uuid("id").primary().defaultTo(this.db.raw("uuid_generate_v4()"));
      table.string("tracking_id").notNullable().unique();
      table.string("customer_name");
      table.string("customer_phone");
      table.string("customer_address");
      table.string("invoice_id");
      table.integer("parcel_price");
      table.boolean("cod_collected").defaultTo(false);
      table
        .enum("status", [
          "placed",
          "picked",
          "shipping",
          "delivered",
          "cancelled",
          "returned",
        ])
        .defaultTo("placed");
      table.integer("weight");
      table.float("merchant_payback_amount").defaultTo(0);
      table.timestamps();

      table.uuid("shop_id").unsigned().index();
      table.uuid("user_id").unsigned().index();

      table.foreign("user_id").references("users.id");
      table.foreign("shop_id").references("shops.id");
    });
  }

  down() {
    this.drop("parcels");
  }
}

module.exports = ParcelSchema;
