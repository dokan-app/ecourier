"use strict";

/*
|--------------------------------------------------------------------------
| ZoneSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

class ZoneSeeder {
  async run() {
    await Factory.model("App/Models/Zone").createMany(20);
  }
}

module.exports = ZoneSeeder;
