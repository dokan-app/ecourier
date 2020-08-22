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
const Role = use("Role");

(async function () {
  const count = await Role.getCount();

  if (!Number(count)) {
    const roleAdmin = new Role();
    roleAdmin.name = "Administrator";
    roleAdmin.slug = "administrator";
    roleAdmin.description = "manage administration privileges";
    await roleAdmin.save();

    const userRole = new Role();
    userRole.name = "Merchant";
    userRole.slug = "merchant";
    userRole.description = "manage merchantizer privileges";
    await userRole.save();
  }
})();

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
  Route.post("register", "AuthController.registerMerchant");
})
  .prefix("auth")
  .middleware("UnAuthenticatedUser");

Route.group(() => {
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
  .middleware("UnAuthenticatedAdmin");

Route.post("auth/logout", "AuthController.logout").as("auth.logout");

/**
 * ------------------------------------------------
 *      User Dashboard
 * ------------------------------------------------
 */
Route.group(() => {
  Route.get("/", "UserDashboardController.states").as("user.dashboard");
  Route.resource("parcels", "PercelController");
})
  .prefix("dashboard")
  .middleware("AuthenticatedUser");

/**
 * ------------------------------------------------
 *      Admin Dashboard
 * ------------------------------------------------
 */

Route.group(() => {
  Route.get("/", "AdminDashboardController.states").as("admin.dashboard");
})
  .prefix("admin-dashboard")
  .middleware(["AuthenticatedAdmin", "auth:admin"]);
