"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class AuthenticatedAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth, session }, next) {
    try {
      await auth.check();
    } catch (error) {
      session.flash({ errorMsg: "দয়া করে আগে লগইন করুন" });
      response.route("auth.admin.login");
    }
    await next();
  }
}

module.exports = AuthenticatedAdmin;
