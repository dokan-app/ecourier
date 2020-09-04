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
const Mail = use("Mail");

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const Role = use("Role");

/**
 * ------------------------------------
 *  Migrate roles and permissions
 * ------------------------------------
 */
Route.get("/create-roles", async function () {
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

  return "<h1>Admin and merchant role created</h1>";
});

Route.group(() => {
  /**
   * ------------------------------------
   *  User Authentication
   * ------------------------------------
   */
  Route.on("login").render("auth.login").as("auth.login");

  Route.on("forgot-password")
    .render("auth.forgot-password")
    .as("auth.forgot-password");

  Route.get("password-recover", "AuthController.recoverPasswordView");

  Route.post("forgot-password", "AuthController.forgotPassword").as(
    "auth.forgot-password"
  );
  Route.post("recover-password", "AuthController.updatePasswordByToken").as(
    "auth.update-password-by-token"
  );

  Route.on("merchant/register")
    .render("auth.register")
    .as("auth.merchant.register");

  Route.post("login", "AuthController.login");

  Route.post("merchant/register", "AuthController.registerMerchant");

  /**
   * ------------------------------------
   *  Admin Authentication
   * ------------------------------------
   */
  Route.on("admin/login").render("auth.admin.login").as("auth.admin.login");
  Route.on("admin/register")
    .render("auth.admin.register")
    .as("auth.admin.register");

  Route.post("admin/register", "AuthController.registerAdmin");
})
  .prefix("auth")
  .middleware("UnAuthenticated");

/**
 * ------------------------------------------------
 *      Metchant Dashboard
 * ------------------------------------------------
 */
Route.group(() => {
  Route.get("/", "MerchantDashboardController.states").as("merchant.dashboard");
  Route.resource("parcels", "ParcelController");
  Route.resource("payments", "PaymentController");
  Route.resource("shops", "ShopController");
  Route.get("payments", "PaymentController.index").as("merchant.payments");
})
  .prefix("dashboard")
  .middleware(["is:merchant"]);

Route.post("auth/logout", "AuthController.logout")
  .as("auth.logout")
  .middleware(["Authenticated"]);

/**
 * ------------------------------------------------
 *      Profile Settings
 * ------------------------------------------------
 */
Route.group(() => {
  Route.on("profile").render("settings.profile").as("settings.profile");
  // Route.on("/").render("settings.password").as("settings.password");

  Route.post("profile", "AuthController.updateProfile").as("settings.profile");
  Route.post("password", "AuthController.updatePassword").as(
    "settings.password"
  );
})
  .prefix("settings")
  .middleware(["Authenticated"]);

/**
 * ------------------------------------------------
 *      Admin Dashboard
 * ------------------------------------------------
 */

Route.group(() => {
  Route.get("/", "AdminDashboardController.states").as("admin.dashboard");
  Route.resource("zones", "ZoneController");
  Route.resource("areas", "AreaController");
  Route.resource("parcels-admin", "ParcelAdminController");
  Route.resource("tracker", "TrackerController");
})
  .prefix("admin-dashboard")
  .middleware(["Authenticated", "is:administrator"]);

Route.on("/").render("pages.home").as("pages.home");

Route.get("tracker", "TrackerController.publicTracker").as("tracker.public");
