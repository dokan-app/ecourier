"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");

class PaymentController {
  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ view, response, request, auth }) {
    const me = auth.user;
    const parcels = await me
      .parcels()
      .where("cod_collected", true)
      .orderBy("created_at", "desc")
      .paginate(request.input("page", 1), 12);

    const { sum: totalPayments } = await Database.table("parcels")
      .sum("merchant_payback_amount")
      .where("cod_collected", true)
      .first();

    return view.render("payments.index", {
      totalPayments,
      parcels: parcels.toJSON(),
    });
  }
}

module.exports = PaymentController;
