"use strict";

const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
  const View = use("View");
  const Env = use("Env");
  const Exception = use("Exception");

  View.global("dump", function (data) {
    return JSON.stringify(data, undefined, 4);
  });

  // handle `InvalidSessionException`
  // Exception.handle("InvalidSessionException", (error, { response }) => {
  //   return response.route("auth.user.login");
  // });
});
