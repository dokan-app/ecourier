"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */
const Logger = use("Logger");

class AuthenticatedAdmin {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth }, next) {
    try {
      await auth.check();
      console.log("AuthenticatedAdmin: try");
    } catch (error) {
      response.route("auth.admin.login");
      console.log("AuthenticatedAdmin: catch");
    }
    await next();
  }
}

module.exports = AuthenticatedAdmin;
