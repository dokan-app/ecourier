"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

const uniqid = require("uniqid");

class Parcel extends Model {
  shop() {
    return this.belongsTo("App/Models/Shop");
  }

  area() {
    return this.belongsTo("App/Models/Area");
  }

  zone() {
    return this.belongsTo("App/Models/Zone");
  }

  merchant() {
    return this.belongsTo("App/Models/User");
  }
  trackings() {
    return this.hasMany("App/Models/Tracker", "tracking_id", "tracking_id");
  }

  static boot() {
    super.boot();
    this.addHook("beforeCreate", async (parcelInstance) => {
      parcelInstance.tracking_id = uniqid.time().toUpperCase();
    });
  }
}
module.exports = Parcel;
