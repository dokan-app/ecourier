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
  async states({ auth, request, response }) {
    const x = auth.authenticator("admin");
    const admin = await x.getUser();
    return response.json({
      admin,
    });
  }
}

module.exports = AdminDashboardController;
