"use strict";

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");
const uniqid = require("uniqid");

// Factory.blueprint('App/Models/User', (faker) => {
//   return {
//     username: faker.username()
//   }
// })

Factory.blueprint("App/Models/Area", (faker) => {
  return {
    name: faker.city(),
  };
});

// Factory.blueprint("App/Models/Zone", (faker) => {
//   return {
//     name: faker.city(),
//   };
// });

// Factory.blueprint("App/Models/Shop", (faker) => {
//   return {
//     name: faker.city(),
//     pickup_address: faker.address(),
//     shop_phone: faker.phone({
//       country: "fr",
//       mobile: true
//     }),
//     area_id: "02c0ce7c-903b-42a9-b41e-37f5bc1433fb",
//     zone_id: "4686fa25-3d77-401b-b0e7-0d3c736fa210",
//     user_id: "aa7752e2-cc6b-4e25-b2e3-92f17ba53830",
//   };
// });

Factory.blueprint("App/Models/Parcel", (faker) => {
  return {
    customer_name: faker.city(),
    tracking_id: uniqid.time().toUpperCase(),
    customer_phone: faker.phone({
      country: "fr",
      mobile: true
    }),
    customer_address: faker.address(),
    invoice_id: uniqid.time().toUpperCase(),
    parcel_price: faker.integer({
      min: 500,
      max: 2500
    }),
    weight: faker.integer({
      min: 1,
      max: 5
    }),
    area_id: "02c0ce7c-903b-42a9-b41e-37f5bc1433fb",
    zone_id: "4686fa25-3d77-401b-b0e7-0d3c736fa210",
    shop_id: "036bf9ec-6cab-46d4-bde7-939a1fe181c8",
    user_id: "aa7752e2-cc6b-4e25-b2e3-92f17ba53830",
  };
});
