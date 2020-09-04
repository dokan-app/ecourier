"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Tracker = use("App/Models/Tracker");

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

    this.addHook("beforeSave", async (parcel) => {
      let delivary_charge = 0;

      if (parcel.weight == 1) {
        delivary_charge = 60;
      } else {
        delivary_charge = 60 + (parcel.weight - 1) * 15;
      }

      const price = parcel.parcel_price;
      const cod = parcel.parcel_price * 0.01;

      const payable =
        +delivary_charge + +price - (+delivary_charge + +price * 0.01);

      parcel.merchant_payback_amount = payable;
    });

    this.addHook("beforeCreate", async (parcelInstance) => {
      parcelInstance.tracking_id = uniqid.time().toUpperCase();
    });

    this.addHook("afterCreate", async (parcelInstance) => {
      Tracker.create({
        status_message: "পার্সেল অর্ডার প্লেস করা হয়েছে",
        tracking_id: parcelInstance.tracking_id,
      });
    });
  }
}
module.exports = Parcel;
