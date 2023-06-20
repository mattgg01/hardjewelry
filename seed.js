require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    seed: (req, res) => {
        sequelize.query(`CREATE TABLE user_submissions (
            id serial NOT NULL,
            fName TEXT NOT NULL,
            email TEXT NOT NULL,
            conceptName TEXT NOT NULL,
            conceptImage TEXT NOT NULL,
            comments TEXT NOT NULL
        );`).then(() => {
            console.log('DB seeded!')
            res.sendStatus(200)
        }).catch(err => console.log('error seeding DB', err))
    }
}