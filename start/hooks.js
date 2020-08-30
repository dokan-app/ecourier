"use strict";

const {
  hooks
} = require("@adonisjs/ignitor");
const moment = require("moment");

var bnNum = function bnNum(num) {
  var komma =
    arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var banglaNumber = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
  };
  var str = "" + num.toLocaleString("bn-BD", {
    useGrouping: komma
  });

  for (var x in banglaNumber) {
    str = str.replace(new RegExp(x, "g"), banglaNumber[x]);
  }
  return str;
};

hooks.after.providersBooted(() => {
  const View = use("View");
  const Env = use("Env");
  const Exception = use("Exception");

  View.global("moment", function (data) {
    return moment(data);
  });
  View.global("dump", function (data) {
    return JSON.stringify(data, undefined, 4);
  });

  View.global("publicUrl", function (data) {
    return Env.get("APP_URL") + "/" + data;
  });

  View.global("paginationArray", (length) => {
    return Array.from({
      length
    }).map((page, i) => ++i);
  });

  View.global("parseInt", (data) => {
    return parseInt(data);
  });

  View.global("bnNum", (data) => {
    return bnNum(data);
  });

  const md5 = require("md5");
  View.global("getAvater", (email) => {
    const $mail = email.toLowerCase();
    return `https://www.gravatar.com/avatar/${md5($mail)}?s=300&d=mm`;
  });

  Exception.handle("ForbiddenException", (error, {
    response
  }) => {
    return response.redirect("/");
  });
});
