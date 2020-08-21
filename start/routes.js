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

Route.on("auth/login")
  .render("auth.login")
  .as("auth.user.login")
  .middleware("guest");

Route.on("auth/register")
  .render("auth.register")
  .as("auth.user.register")
  .middleware("guest");

Route.post("auth/logout", "AuthController.logout")
  // .middleware("auth")
  .as("auth.logout");

Route.post("auth/login", "AuthController.login");
Route.post("auth/register", "AuthController.register");

Route.group(() => {
  Route.get("/", "UserDashboardController.states").as("user.dashboard");
  Route.resource("parcels", "PercelController");
})
  .prefix("dashboard")
  .middleware("auth");
