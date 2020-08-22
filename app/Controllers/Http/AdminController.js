"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Admin = use("App/Models/Admin");

/** @type {typeof import('adonisjs/validator')} */
const { validateAll } = use("Validator");

/**
 * Resourceful controller for interacting with admins
 */
class AdminController {
  /**
   * Update admin details.
   * PUT or PATCH admins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async login({ request, response, auth, session }) {
    const data = request.all();

    const validation = await validateAll(
      data,
      {
        email: "required|email",
        password: "required",
      },
      {
        "email.required": "ইমেইল দিতেই হবে",
        "email.email": "ইমেইল এড্রেস সঠিক নয়",

        "password.min": "পাসসোয়ার্ড দিতেই হবে",
      }
    );

    if (validation.fails()) {
      session.flash({ errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।" });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    const { email, password } = request.all();
    try {
      // Login via admin authenticator
      const authenticator = auth.authenticator("admin");
      await authenticator.attempt(email, password);

      return response.route("admin.dashboard");
    } catch (error) {
      session.flash({ errorMsg: "ইমেইল অথবা পাসোয়ার্ড ভুল করেছেন" });
      return response.redirect("back");
    }
  }

  /**
   * Update admin details.
   * PUT or PATCH admins/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async register({ params, request, response, session }) {
    const count = await Admin.getCount();

    if (Number(count)) {
      session.flash({ errorMsg: "এডমিন রেজিস্ট্রেশন বন্ধ করে দেয়া হয়েছে" });
      return response.redirect("/");
    }

    const data = request.all();
    delete data._csrf;

    const validation = await validateAll(
      data,
      {
        name: "required|min:3",
        username: "required|min:3|unique:admins,username",
        email: "required|email|unique:admins,email",
        password: "required|min:5|max:50",
      },
      {
        "name.required": "নাম দিতেই হবে",
        "name.min": "কমপক্ষে ৩টি অক্ষর থাকতেই হবে",

        "username.required": "ইউজারনেম দিতেই হবে",
        "username.min": "কমপক্ষে ৩টি অক্ষর থাকতেই হবে",

        "email.required": "ইমেইল দিতেই হবে",
        "email.email": "ইমেইল এড্রেস সঠিক নয়",
        "email.unique": "ইতিপুর্বে এই ইমেইল ব্যবহার করা হয়েগেছে",

        "password.min": "কমপক্ষে দিতেই হবে",
        "username.min": "কমপক্ষে ৫টি অক্ষর থাকতেই হবে",
        "username.max": "সর্বোচ্চ ৫০টি অক্ষর দিতে পারবেন",
      }
    );

    if (validation.fails()) {
      session.flash({ errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।" });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    await Admin.create(data);

    session.flash({ successMsg: "আপনি সঠিক ভাবে নিবন্ধিত হয়েছেন" });

    return "Admin-dashboard";
  }
}

module.exports = AdminController;
