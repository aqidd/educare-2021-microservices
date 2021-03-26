import express from "express";
import pkg from "sqlite3";
import { connect } from "amqplib/callback_api.js";

const { Database } = pkg;

const app = express();
const db = new Database("outlet.db");

app.use(express.json());
app.use(express.static("public"));

app.listen(9001, () => {
  db.run(`CREATE TABLE IF NOT EXISTS outlet(
        id              INTEGER     PRIMARY KEY     AUTOINCREMENT,
        name            TEXT,
        address           TEXT,
        account_id      INTEGER
    )`);

  // SUBSCRIBE TO RABBITMQ EVENT
  connect("amqp://rabbitmq", function (error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }
      var queue = "hello";

      channel.assertQueue(queue, {
        durable: false,
      });
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        queue
      );
      channel.consume(
        queue,
        function (msg) {
          console.log(" [x] Received %s", msg.content.toString());
        },
        {
          noAck: true,
        }
      );
    });
  });

  console.log("Outlet Service is running in port 9001");
});

app.get("/outlets", (req, res) => {
  db.all(`SELECT * FROM outlet`, (err, data) => {
    res.send(data);
  });
});

/**
 * to call this API via terminal, you can use CURL
 * curl --location --request POST 'localhost:9001/outlet' \
    --header 'Content-Type: application/json' \
    --data-raw '{
        "name": "outlet1",
        "address": "some street 123",
        "account_id": 1
    }'
 */
app.post("/outlet", (req, res) => {
  const body = req.body;
  db.run(
    `INSERT INTO outlet('name', 'address', 'account_id') VALUES ('${body.name}', '${body.address}', ${body.account_id})`,
    (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.send("success!");
      }
    }
  );
});
