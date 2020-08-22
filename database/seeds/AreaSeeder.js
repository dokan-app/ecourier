"use strict";

/*
|--------------------------------------------------------------------------
| AreaSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

class AreaSeeder {
  async run() {
    await Factory.model("App/Models/Area").createMany(20);
  }
}

module.exports = AreaSeeder;
