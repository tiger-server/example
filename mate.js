const config = require("./config")
const tiger = require("tiger-server")(config)
const luxon = require("luxon")
const { mail } = require("tiger-server/protocols")

tiger.use(mail)

tiger.define("version", ["http:/version", function (tiger, state, {req, res}) {
  res.send({ "version": 1 });
}]);

tiger.define("minutes-timer", ["cron:0 0/30 * * * *", function (tiger) {
  tiger.notify("zmq:timer", { time: luxon.DateTime.local().setZone('Asia/Shanghai').startOf('minute').toISO() })
}]);


tiger.define("timer-notification", ["zmq:timer", function(tiger, state, { time }) {
  const text = `贴身小伙伴为您报时: ${time}`;
  tiger.notify(config.mail.channel, { subject: text, text: text, html: `<p>${text}</p>`  })
}]);

tiger.serve();
