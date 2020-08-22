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
    const authenticator = auth.authenticator("admin");
    const check = await authenticator.check();

    response.json({
      x: 12,
      check,
    });

    console.log("Hello");

    // try {

    // } catch (error) {
    //   console.log("AuthenticatedAdmin: catch");
    // }

    // await next();
  }
}

module.exports = AuthenticatedAdmin;
