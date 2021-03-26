import express from "express";
import pkg from "sqlite3";
import { connect } from "amqplib/callback_api.js";

const { Database } = pkg;

const app = express();
const db = new Database("account.db");

app.use(express.json());
app.use(express.static("public"));

app.listen(9000, () => {
  db.run(`CREATE TABLE IF NOT EXISTS account(
        id              INTEGER     PRIMARY KEY     AUTOINCREMENT,
        name            TEXT,
        email           TEXT
    )`);

  console.log("Account Service is running in port 9000");
});

app.get("/accounts", (req, res) => {
  db.all(`SELECT * FROM account`, (err, data) => {
    // TODO use axios to get data from outlet
    res.send(data);
  });
});

app.get("/send-event", (req, res) => {
  const amqp = connect("amqp://rabbitmq", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "hello";
      var msg = "Hello world NOW";

      channel.assertQueue(queue, {
        durable: false,
      });

      channel.sendToQueue(queue, Buffer.from(msg));
      console.log(" [x] Sent %s", msg);
      
      res.send('done sending event');
    });
  });

});

/**
 * to call this API via terminal, you can use CURL
 * curl --location --request POST 'localhost:9000/account' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "johndoe",
        "email": "john.doe@gmail.com"
    }'
 */
app.post("/account", (req, res) => {
  const body = req.body;
  db.run(
    `INSERT INTO account('name', 'email') VALUES ('${body.name}', '${body.email}')`,
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send("success!!");
      }
    }
  );
});
