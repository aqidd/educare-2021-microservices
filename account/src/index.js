import express from 'express'
import pkg from 'sqlite3'
const { Database } = pkg

const app = express();
const db = new Database('account.db')

app.use(express.json())
app.use(express.static('public'))

app.listen(9000, () => {
    db.run(`CREATE TABLE IF NOT EXISTS account(
        id              INTEGER     PRIMARY KEY     AUTOINCREMENT,
        name            TEXT,
        email           TEXT
    )`)

    console.log('Account Service is running in port 9000')
})

app.get('/accounts', (req, res) => {
    db.all(`SELECT * FROM account`, (err, data) => {
        // TODO use axios to get data from outlet
        res.send(data)
    })
})