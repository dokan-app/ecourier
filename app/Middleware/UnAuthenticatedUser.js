"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class UnAuthenticatedUser {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ response, auth, session }, next) {
    try {
      await auth.check();
      session.flash({ successMsg: "আপনি পুর্ব থেকেই লগইন অবস্থায় রয়েছেন।" });
      response.route("user.dashboard");
      console.log("UnAuthenticatedUser: try");
    } catch (error) {
      console.log("UnAuthenticatedUser: catch");
      await next();
    }
  }
}

module.exports = UnAuthenticatedUser;
