"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
/** @type {typeof import('adonisjs/validator')} */
const { validateAll } = use("Validator");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Zone = use("App/Models/Zone");
/**
 * Resourceful controller for interacting with zones
 */
class ZoneController {
  /**
   * Show a list of all areas.
   * GET areas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {
    const zones = await Zone.query()
      .orderBy("created_at", "desc")
      .paginate(request.input("page", 1), 21);
    return view.render("zones.index", { zones: zones.toJSON() });
  }

  /**
   * Render a form to be used for creating a new area.
   * GET areas/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {
    return view.render("zones.create");
  }

  /**
   * Create/save a new area.
   * POST areas
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response, session }) {
    const data = request.only(["name"]);

    const validation = await validateAll(
      data,
      {
        name: "required|min:3",
      },
      {
        "name.required": "বাধ্যতামূলক",
        "name.min": "কমপক্ষে ৩টি অক্ষর থাকতে হবে",
      }
    );

    if (validation.fails()) {
      session.flash({ errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।" });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    await Zone.create(data);

    response.route("zones.index");
  }

  /**
   * Display a single area.
   * GET areas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    return view.render("zones.show");
  }

  /**
   * Render a form to update an existing area.
   * GET areas/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {
    const zones = await Zone.findByOrFail("id", params.id);
    return view.render("zones.edit", { zones });
  }

  /**
   * Update area details.
   * PUT or PATCH areas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response, session }) {
    const data = request.only(["name"]);

    const validation = await validateAll(
      data,
      {
        name: "required|min:3",
      },
      {
        "name.required": "বাধ্যতামূলক",
        "name.min": "কমপক্ষে ৩টি অক্ষর থাকতে হবে",
      }
    );

    if (validation.fails()) {
      session.flash({ errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।" });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    const zones = await Zone.findBy("id", params.id);
    zones.name = data.name;
    await zones.save();

    session.flash({ successMsg: "সফল ভাবে হালনাগাদ হয়েছে" });

    response.route("zones.index");
  }

  /**
   * Delete a area with id.
   * DELETE areas/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response, session }) {
    const zones = await Zone.findByOrFail("id", params.id);
    session.flash({ successMsg: "সফল ভাবে মুছে ফেলা হয়েছে" });
    zones.delete();
    response.route("zones.index");
  }
}

module.exports = ZoneController;
