"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('adonisjs/validator')} */
const {
  validateAll
} = use("Validator");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Area = use("App/Models/Area");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Zone = use("App/Models/Zone");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Shop = use("App/Models/Shop");

/**
 * Resourceful controller for interacting with shops
 */
class ShopController {
  /**
   * Show a list of all shops.
   * GET shops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({
    request,
    response,
    view,
    auth
  }) {
    const me = auth.user;
    const shops = await me
      .shops()
      .with("area")
      .with("zone")
      .paginate(request.input("page", 1), 12);

    // return shops;

    return view.render("shops.index", {
      shops: shops.toJSON()
    });
  }

  /**
   * Render a form to be used for creating a new shop.
   * GET shops/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({
    request,
    response,
    view
  }) {
    const zones = await Zone.all();
    const areas = await Area.all();

    return view.render("shops.create", {
      areas,
      zones
    });
  }

  /**
   * Create/save a new shop.
   * POST shops
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({
    request,
    response,
    session,
    auth
  }) {
    const payload = request.all();
    delete payload._csrf;

    const validation = await validateAll(payload, {
      name: "required|min:3",
      pickup_address: "required|min:10",
      shop_phone: "required|max:15",
      area_id: "required",
      zone_id: "required",
    });

    if (validation.fails()) {
      session.flash({
        errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।"
      });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    await Shop.create({
      ...payload,
      user_id: auth.user.id,
    });

    session.flash({
      successMsg: "দোকান নিবন্ধিত হয়েছে"
    });
    response.route("shops.index");
  }

  /**
   * Display a single shop.
   * GET shops/:id
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
  }) {}

  /**
   * Render a form to update an existing shop.
   * GET shops/:id/edit
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
    const shop = await Shop.findByOrFail("id", params.id);
    const zones = await Zone.all();
    const areas = await Area.all();
    return view.render("shops.edit", {
      shop,
      zones,
      areas
    });
  }

  /**
   * Update shop details.
   * PUT or PATCH shops/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({
    params,
    request,
    response,
    session
  }) {
    const payload = request.all();
    delete payload._csrf;
    delete payload._method;

    const validation = await validateAll(payload, {
      name: "required|min:3",
      pickup_address: "required|min:10",
      shop_phone: "required|max:15",
      area_id: "required",
      zone_id: "required",
    });

    if (validation.fails()) {
      session.flash({
        errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।"
      });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    const shop = await Shop.findBy("id", params.id);
    shop.merge(payload);
    await shop.save();
    session.flash({
      successMsg: "সফল ভাবে হালনাগাদ হয়েছে"
    });

    response.redirect("back");
  }

  /**
   * Delete a shop with id.
   * DELETE shops/:id
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
    const item = await Shop.findByOrFail("id", params.id);
    session.flash({
      successMsg: "সফল ভাবে মুছে ফেলা হয়েছে"
    });
    item.delete();
    response.route("shops.index");
  }
}

module.exports = ShopController;
