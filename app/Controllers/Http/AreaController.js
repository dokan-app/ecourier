"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('adonisjs/validator')} */
const { validateAll } = use("Validator");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Area = use("App/Models/Area");

/**
 * Resourceful controller for interacting with areas
 */
class AreaController {
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
    const areas = await Area.query()
      .orderBy("created_at", "desc")
      .paginate(request.input("page", 1), 21);
    return view.render("areas.index", { areas: areas.toJSON() });
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
    return view.render("areas.create");
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

    await Area.create(data);

    response.route("areas.index");
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
    return view.render("areas.show");
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
    const area = await Area.findByOrFail("id", params.id);
    return view.render("areas.edit", { area });
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

    const area = await Area.findBy("id", params.id);
    area.name = data.name;
    await area.save();

    session.flash({ successMsg: "সফল ভাবে হালনাগাদ হয়েছে" });

    response.route("areas.index");
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
    const area = await Area.findByOrFail("id", params.id);
    session.flash({ successMsg: "সফল ভাবে মুছে ফেলা হয়েছে" });
    area.delete();
    response.route("areas.index");
  }
}

module.exports = AreaController;
