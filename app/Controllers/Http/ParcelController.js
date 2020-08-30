"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Area = use("App/Models/Area");

/** @type {typeof import('adonisjs/validator')} */
const {
  validateAll
} = use("Validator");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Zone = use("App/Models/Zone");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Parcel = use("App/Models/Parcel");

/**
 * Resourceful controller for interacting with percels
 */
class ParcelController {
  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    request,
    view,
    auth
  }) {
    const me = auth.user
    const parcels = await me.parcels()
      .with("shop")
      .with("area")
      .with("zone")
      .paginate(request.input("page", 1), 12);
    return view.render("parcels.index", {
      parcels: parcels.toJSON()
    });
  }

  /**
   * Render a form to be used for creating a new percel.
   * GET percels/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({
    request,
    response,
    view,
    auth
  }) {
    const user = auth.user;
    const shops = await user.shops().fetch();
    const zones = await Zone.all();
    const areas = await Area.all();

    return view.render("parcels.create", {
      zones,
      areas,
      shops
    });
  }

  /**
   * Create/save a new percel.
   * POST percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    response,
    auth,
    session
  }) {
    const payload = request.all();
    delete payload._csrf

    const validation = await validateAll(payload, {
      customer_name: "required|min:3",
      customer_phone: "required|min:11",
      customer_address: "required",
      parcel_price: "required",
      shop_id: "required",
      area_id: "required",
      zone_id: "required",
      weight: "required",
    });

    if (validation.fails()) {
      session.flash({
        errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।"
      });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }


    await Parcel.create({
      ...payload,
      user_id: auth.user.id,
    });

    session.flash({
      successMsg: "অর্ডার গ্রহণ করা হয়েছে"
    });

    response.route("parcels.index");
  }


  /**
   * Display a single percel.
   * GET percels/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({
    params,
    request,
    response,
    view
  }) {
    return view.render("parcels.index");
  }

  /**
   * Render a form to update an existing percel.
   * GET percels/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({
    params,
    request,
    response,
    view
  }) {
    return view.render("parcels.edit");
  }

  /**
   * Update percel details.
   * PUT or PATCH percels/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    response
  }) {}

  /**
   * Delete a percel with id.
   * DELETE percels/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({
    params,
    response,
    session
  }) {
    const item = await Parcel.findByOrFail("id", params.id);
    session.flash({
      successMsg: "সফল ভাবে মুছে ফেলা হয়েছে"
    });
    await item.delete();
    response.route("parcels.index");
  }
}

module.exports = ParcelController;
