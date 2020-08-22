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
    Logger.info("AuthenticatedAdmin");
    console.log(JSON.stringify(auth, undefined, 4));

    return response.json({
      auth: 1,
    });
    // await next();
  }
}

module.exports = AuthenticatedAdmin;
