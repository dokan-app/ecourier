"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Area = use("App/Models/Area");

/** @type {typeof import('adonisjs/validator')} */
const { validateAll } = use("Validator");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Zone = use("App/Models/Zone");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Parcel = use("App/Models/Parcel");

/**
 * Resourceful controller for interacting with parceladmins
 */
class ParcelAdminController {
  /**
   * Show a list of all parceladmins.
   * GET parceladmins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const parcels = await Parcel.query()
      .with("merchant")
      .with("shop")
      .with("shop.area")
      .with("shop.zone")
      .paginate(1, 20);

    // return parcels

    return view.render("parcels.index-admin", {
      parcels: parcels.toJSON(),
    });
  }

  /**
   * Render a form to be used for creating a new parceladmin.
   * GET parceladmins/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new parceladmin.
   * POST parceladmins
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {}

  /**
   * Display a single parceladmin.
   * GET parceladmins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const parcel = await Parcel.query()
      .where("id", params.id)
      .with("shop")
      .with("shop.area")
      .with("shop.zone")
      .with("merchant")
      .with("trackings")
      .first();

    const cod_charge = parcel.parcel_price * 0.01;
    let delivary_charge = 0;

    if (parcel.weight == 1) {
      delivary_charge = 60;
    } else {
      delivary_charge = 60 + (parcel.weight - 1) * 15;
    }

    // return parcel;
    return view.render("parcels.show-admin", {
      parcel: parcel.toJSON(),
      cod_charge,
      delivary_charge,
    });
  }

  /**
   * Render a form to update an existing parceladmin.
   * GET parceladmins/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update parceladmin details.
   * PUT or PATCH parceladmins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const parcel = await Parcel.find(params.id);
    const payload = request.except(["_csrf", "_method"]);
    parcel.merge(payload);
    await parcel.save();
    session.flash({ successMsg: "পার্সেল হালনাগাদ করা হয়েছে" });
    return response.redirect("back");
  }

  /**
   * Delete a parceladmin with id.
   * DELETE parceladmins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response }) {}
}

module.exports = ParcelAdminController;
