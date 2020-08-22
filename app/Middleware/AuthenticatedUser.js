"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Logger = use("Logger");

class AuthenticatedUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth, session }, next) {
    try {
      await auth.check();
      Logger.alert("AuthenticatedUser: try");
    } catch (error) {
      Logger.info("AuthenticatedUser: catch");
      session.flash({ errorMsg: "দয়া করে আগে লগইন করুন" });
      response.route("auth.user.login");
    }
    await next();
  }
}

module.exports = AuthenticatedUser;
