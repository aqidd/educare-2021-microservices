import express from 'express'
import pkg from 'sqlite3'
const { Database } = pkg

const app = express();
const db = new Database('outlet.db')

app.use(express.json())
app.use(express.static('public'))

app.listen(9001, () => {
    db.run(`CREATE TABLE IF NOT EXISTS outlet(
        id              INTEGER     PRIMARY KEY     AUTOINCREMENT,
        name            TEXT,
        address           TEXT,
        account_id      INTEGER
    )`)

    console.log('Outlet Service is running in port 9001')
})

app.get('/outlets', (req, res) => {
    db.all(`SELECT * FROM outlet`, (err, data) => {
        res.send(data)
    })
})

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
app.post('/outlet', (req, res) => {
    const body = req.body
    db.run(`INSERT INTO outlet('name', 'address', 'account_id') VALUES ('${body.name}', '${body.address}', ${body.account_id})`, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send('success!');
        }
    })
})
