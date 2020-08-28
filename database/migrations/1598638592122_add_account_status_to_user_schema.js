"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddAccountStatusToUserSchema extends Schema {
  up() {
    this.table("users", (table) => {
      table.string("account_status", 255);
    });
  }

  down() {
    this.table("users", (table) => {
      // reverse alternations
    });
  }
}

module.exports = AddAccountStatusToUserSchema;
