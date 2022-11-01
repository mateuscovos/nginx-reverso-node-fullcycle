const express = require('express')

const app = express()
const PORT = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database: 'reversodb'
}

const mysql = require('mysql')

const createPeople = async () => {
    const connection = mysql.createConnection(config)

    return new Promise((resolve, reject) => {
        const createTable = `create table if not exists people(id int not null auto_increment, name varchar(255), primary key(id))`
        connection.query(createTable, (err, result) => {
            if (err) return reject(err)

            const sql = `INSERT INTO people(name) values('Mateus')`
            connection.query(sql, (err, result) => {
                if (err) reject(err)
                return resolve()
            })
        })
    }).finally(() => connection.end())
}

const getPeoples = async () => {
    const connection = mysql.createConnection(config)

    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM people`
        connection.query(sql, (err, result) => {
            if (err) reject(err)
            return resolve(result)
        })

        connection.end()
    })
}

app.get('/', async (req, res) => {
    await createPeople()

    const peoples = await getPeoples()

    res.send(`
        <h1>Full Cycle Rocks!</h1>
        ${peoples.map(people => `<br> ${people.name}`).join("")}
    `)
})

app.listen(PORT, () => console.log(`Running at :${PORT}`))