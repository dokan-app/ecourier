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
  states({ request, response, view }) {
    // return view.render("admin-dashboard.states");
    return response.json({
      message: "Admin dashboard",
    });
    // return view.render("admin-dashboard.states");
  }
}

module.exports = AdminDashboardController;
