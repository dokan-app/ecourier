"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Tracker = use("App/Models/Tracker");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Parcel = use("App/Models/Parcel");

/**
 * Resourceful controller for interacting with trackers
 */
class TrackerController {
  /**
   * Show a list of all trackers.
   * GET trackers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ request, response, view }) {}

  /**
   * Render a form to be used for creating a new tracker.
   * GET trackers/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, response, view }) {}

  /**
   * Create/save a new tracker.
   * POST trackers
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {
    const payload = request.only(["status_message", "tracking_id"]);
    await Tracker.create(payload);

    response.redirect("back");
  }

  /**
   * Display a single tracker.
   * GET trackers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {}

  /**
   * Render a form to update an existing tracker.
   * GET trackers/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async edit({ params, request, response, view }) {}

  /**
   * Update tracker details.
   * PUT or PATCH trackers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {}

  /**
   * Delete a tracker with id.
   * DELETE trackers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, request, response, session }) {
    const item = await Tracker.findByOrFail("id", params.id);
    session.flash({
      successMsg: "সফল ভাবে মুছে ফেলা হয়েছে",
    });
    await item.delete();
    response.redirect("back");
  }
  /**
   * Delete a tracker with id.
   * DELETE trackers/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.view
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async publicTracker({ params, view, request, response, session }) {
    if (!request.input("tracking_id")) {
      return response.redirect("/");
    }
    const track = await Tracker.query()
      .where("tracking_id", request.input("tracking_id"))
      .fetch();

    if (track.toJSON().length === 0) {
      session.flash({ errorMsg: "ভুল ট্র্যাকিং আইডি দিয়েছেন" });
      return response.redirect("/");
    }

    const parcel = await Parcel.query()
      .where("tracking_id", request.input("tracking_id"))
      .first();

    return view.render("tracker", {
      track: track.toJSON(),
      parcel: parcel.toJSON(),
      tracking_id: request.input("tracking_id"),
    });
  }
}

module.exports = TrackerController;
