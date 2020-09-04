"use strict";

const { route } = require("@adonisjs/framework/src/Route/Manager");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Mail = use("Mail");

const Database = use("Database");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use("App/Models/User");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Role = use("Role");

/** @type {typeof import('adonisjs/validator')} */
const { validateAll } = use("Validator");

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use("Hash");

const Persona = use("Persona");

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
  async login({ request, auth, session, response }) {
    const data = request.all();
    delete data._csrf;

    const user = await Persona.verify(request.only(["uid", "password"]));

    if (!user) {
      session.flash({ errorMsg: "ইমেইল অথবা ইউজারনেম পাসোয়ার্ড ভুল করেছেন" });
      return response.redirect("back");
    }

    await auth.login(user);
    const role = await user.getRoles();

    if (role.includes("merchant")) {
      return response.route("merchant.dashboard");
    }

    if (role.includes("administrator")) {
      return response.route("admin.dashboard");
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
        password: "required|confirmed|min:5|max:50",
      },
      {
        "name.required": "নাম দিতেই হবে",
        "name.min": "কমপক্ষে ৩টি অক্ষর থাকতেই হবে",

        "username.required": "ইউজারনেম দিতেই হবে",
        "username.min": "কমপক্ষে ৩টি অক্ষর থাকতেই হবে",

        "email.required": "ইমেইল দিতেই হবে",
        "email.email": "ইমেইল এড্রেস সঠিক নয়",
        "email.unique": "ইতিপুর্বে এই ইমেইল ব্যবহার করা হয়েগেছে",

        "password.min": "কমপক্ষে ৫টি অক্ষর থাকতেই হবে",
        "username.min": "কমপক্ষে ৫টি অক্ষর থাকতেই হবে",
        "username.max": "সর্বোচ্চ ৫০টি অক্ষর দিতে পারবেন",
        "password.confirmed": "পাসওয়ার্ড মিলেনি",
      }
    );

    if (validation.fails()) {
      session.flash({ errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।" });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    const user = await Persona.register(data);

    // const user = await User.create(data);
    await user.roles().attach([merchantRoleid]);

    session.flash({ successMsg: "আপনি সঠিক ভাবে নিবন্ধিত হয়েছেন" });

    await Mail.send("mail.welcome", user.toJSON(), (message) => {
      message
        .to(user.email)
        .from("example@example.com")
        .subject("Welcome to royalxpressbd.com");
    });

    return response.route("auth.login");
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async forgotPassword({ request, response, session }) {
    const { uid } = request.only(["uid"]);
    await Persona.forgotPassword(uid);
    session.flash({
      successMsg: "পাসওয়ার্ড পুনরুদ্ধার করতে আপনার ইমেইল যাচাই করুন",
    });
    response.redirect("/");
  }

  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async recoverPasswordView({ request, response, params, view }) {
    return view.render("auth.recover-password", {
      token: request.input("token"),
    });
  }

  async updatePasswordByToken({ request, params, session, response, auth }) {
    const payload = request.only(["password", "password_confirmation"]);
    const { token } = request.only(["token"]);
    const user = await Persona.updatePasswordByToken(token, payload);
    await auth.login(user);
    session.flash({ successMsg: "Password changed" });
    response.redirect("/");
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

  /**
   * Show a list of all percels.
   * GET percels
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async updateProfile({ params, request, view, session, response }) {}

  async logout({ auth, session, response }) {
    await auth.logout();
    session.flash({ successMsg: "সফলভাবে লগআউট করেছেন।" });

    return response.route("auth.login");
  }

  async updateProfile({ auth, session, response, request }) {
    const data = request.all();
    delete data._csrf;

    const user = auth.user;

    const validation = await validateAll(
      data,
      {
        name: "required|min:3",
        username: `required|min:3|unique:users,username,id,${user.id}`,
        email: `required|email|unique:users,email,id,${user.id}`,
      },
      {
        "name.required": "নাম দিতেই হবে",
        "name.min": "কমপক্ষে ৩টি অক্ষর থাকতেই হবে",

        "username.required": "ইউজারনেম দিতেই হবে",
        "username.min": "কমপক্ষে ৩টি অক্ষর থাকতেই হবে",

        "email.required": "ইমেইল দিতেই হবে",
        "email.email": "ইমেইল এড্রেস সঠিক নয়",
        "email.unique": "ইতিপুর্বে এই ইমেইল ব্যবহার করা হয়েগেছে",
      }
    );

    if (validation.fails()) {
      session.flash({ errorMsg: "কিছু ভুল করেছেন, দয়া করে ঠিক করুন।" });
      session.withErrors(validation.messages());
      return response.redirect("back");
    }

    await Persona.updateProfile(user, data);
    session.flash({ successMsg: "সফলভাবে হালনাদ হয়েছে" });

    return response.redirect("back");
  }

  async updatePassword({ auth, session, response, request }) {
    const payload = request.only([
      "old_password",
      "password",
      "password_confirmation",
    ]);

    const user = auth.user;
    await Persona.updatePassword(user, payload);
    session.flash({ successMsg: "সফল ভাবে হালনাগাদ হয়েছে" });

    return response.redirect("back");
  }
}

module.exports = AuthController;
