"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Guest {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, auth, session }, next) {
    try {
      await auth.check();
      session.flash({ successMsg: "আপনি পুর্ব থেকেই লগইন অবস্থায় রয়েছেন।" });
      response.route("user.dashboard");
    } catch (error) {
      await next();
    }
  }
}

module.exports = Guest;
