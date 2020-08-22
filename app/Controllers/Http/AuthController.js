"use strict";

const { route } = require("@adonisjs/framework/src/Route/Manager");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use("Role");

/** @type {typeof import('adonisjs/validator')} */
const { validateAll } = use("Validator");

class AuthController {
  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async login({ params, request, view, session, response, auth }) {
    const data = request.all();
    delete data._csrf;

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
      const user = await auth.attempt(email, password);

      const role = await user.getRoles();

      if (role.includes("merchant")) {
        return response.route("user.dashboard");
      }

      if (role.includes("administrator")) {
        return response.route("admin.dashboard");
      }
    } catch (error) {
      session.flash({ errorMsg: "ইমেইল অথবা পাসোয়ার্ড ভুল করেছেন" });
      return response.redirect("back");
    }
  }

  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async registerMerchant({ params, request, view, session, response }) {
    /**
     * Get merchant Role id
     */
    const { id: merchantRoleid } = await Role.findBy("slug", "merchant");

    const data = request.all();
    delete data._csrf;

    const validation = await validateAll(
      data,
      {
        name: "required|min:3",
        username: "required|min:3|unique:users,username",
        email: "required|email|unique:users,email",
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

    const user = await User.create(data);
    await user.roles().attach([merchantRoleid]);

    session.flash({ successMsg: "আপনি সঠিক ভাবে নিবন্ধিত হয়েছেন" });

    return response.route("auth.login");
  }

  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async registerAdmin({ params, request, view, session, response }) {
    const { id: adminRoleId } = await Role.findBy("slug", "administrator");
    const query = Database.table("role_user");
    const adminRoleExists = await query.where("role_id", adminRoleId);

    if (adminRoleExists.length) {
      session.flash({ errorMsg: "এডমিন রেজিস্ট্রেশন বন্ধ করে দেয়া হয়েছে" });
      return response.redirect("/");
    }

    const data = request.all();
    delete data._csrf;

    const validation = await validateAll(
      data,
      {
        name: "required|min:3",
        username: "required|min:3|unique:users,username",
        email: "required|email|unique:users,email",
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

    const user = await User.create(data);
    await user.roles().attach([adminRoleId]);

    session.flash({ successMsg: "আপনি সঠিক ভাবে নিবন্ধিত হয়েছেন" });

    return response.route("auth.login");
  }

  async logout({ auth, session, response }) {
    await auth.logout();
    session.flash({ successMsg: "সফলভাবে লগআউট করেছেন।" });

    return response.route("auth.login");
  }
}

module.exports = AuthController;
