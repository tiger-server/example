const config = require("./config")
const { Tiger } = require("tiger-server")
const luxon = require("luxon")
const { mail, http, cron, zmq } = require("tiger-server/lib/core")

const tiger = new Tiger(config)

tiger.use(mail)
tiger.use(http)
tiger.use(cron)
tiger.use(zmq)

tiger.define({
  id: "version",
  target: "http:/version", 
  process: function (state, {req, res}) {
    res.send({ "version": 1 });
  }
});

tiger.define({
  id: "minutes-timer", target: "cron:0 0/30 * * * *", 
  process: function () {
    this.notify("zmq:timer", { time: luxon.DateTime.local().setZone('Asia/Shanghai').startOf('minute').toISO() })
  }
});


tiger.define({
  id: "timer-notification", 
  target: "zmq:timer", 
  process: function(state, { time }) {
    const text = `贴身小伙伴为您报时: ${time}`;
    this.notify(config.mail.channel, { subject: text, text: text, html: `<p>${text}</p>`  })
  }
});

tiger.serve();
