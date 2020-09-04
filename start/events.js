const Event = use("Event");
const ENV = use("Env");
const Mail = use("Mail");

Event.on("forgot::password", async ({ user, token }) => {
  const url = ENV.get("APP_URL") + "/auth/password-recover/?token=" + token;

  await Mail.send("mail.forgot-password", { url }, (message) => {
    message
      .to(user.email)
      .from("example@example.com")
      .subject("Password Recovery | royalxpressbd.com");
  });
});
