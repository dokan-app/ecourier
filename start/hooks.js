"use strict";

const { hooks } = require("@adonisjs/ignitor");

hooks.after.providersBooted(() => {
  const View = use("View");
  const Env = use("Env");
  const Exception = use("Exception");

  View.global("dump", function (data) {
    return JSON.stringify(data, undefined, 4);
  });

  Exception.handle("ForbiddenException", (error, { response }) => {
    return response.redirect("/");
  });
});
