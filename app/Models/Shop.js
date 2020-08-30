"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class Shop extends Model {
  area() {
    return this.belongsTo("App/Models/Area");
  }

  zone() {
    return this.belongsTo("App/Models/Zone");
  }

  owner() {
    return this.belongsTo("App/Models/User");
  }
}

module.exports = Shop;
