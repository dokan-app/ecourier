"use strict";

class AdminDashboardController {
  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async states({ view }) {
    return view.render("admin-dashboard.states");
  }
}

module.exports = AdminDashboardController;
