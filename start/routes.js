"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.on("/").render("welcome");

Route.group(() => {
  /**
   * ------------------------------------
   *  User Authentication
   * ------------------------------------
   */
  Route.on("login").render("auth.login").as("auth.user.login");
  Route.on("register").render("auth.register").as("auth.user.register");
  Route.post("login", "AuthController.login");
  Route.post("register", "AuthController.register");

  /**
   * ------------------------------------
   *  Admin Authentication
   * ------------------------------------
   */
  Route.on("admin/login").render("auth.admin.login").as("auth.admin.login");
  Route.on("admin/register")
    .render("auth.admin.register")
    .as("auth.admin.register");

  Route.post("admin/login", "AdminController.login");
  Route.post("admin/register", "AdminController.register");
})
  .prefix("auth")
  .middleware("guest");

Route.post("auth/logout", "AuthController.logout").as("auth.logout");

Route.group(() => {
  Route.get("/", "UserDashboardController.states").as("user.dashboard");
  Route.resource("parcels", "PercelController");
})
  .prefix("dashboard")
  .middleware("auth");

Route.group(() => {
  Route.get("/", "AdminDashboardController.states").as("admin.dashboard");
})
  .prefix("admin-dashboard")
  .middleware("auth");
