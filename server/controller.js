require('dotenv').config()
const {CONNECTION_STRING} = process.env
const Sequelize = require('sequelize')

const sequelize = new Sequelize(CONNECTION_STRING,{
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    concepts: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/concepts/concepts.html'))
    },
    conceptsCss: (req, res) =>{
        res.sendFile(path.join(__dirname, '../views/concepts/concepts.css'))
    },
    conceptsJs: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/concepts/concepts.js'))
    },
    blackjack: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/blackjack/blackjack.html'))
    },
    blackjackCss: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/blackjack/blackjack.css'))
    },
    blackjackJs: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/blackjack/blackjack.js'))
    },
    landing: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/landing', 'landing.html'))
    },
    landingCss: (req, res) => {
        res.sendFile(path.join(__dirname, '../views/landing', 'landing.css'))
    },
    conceptPost: (req, res) => {
        let { fName, email, conceptName, conceptImage, comments } = req.body
        sequelize.query(`
        INSERT INTO user_submissions (fName, email, conceptName, conceptImage, comments)
        VALUES ('${fName}', '${email}', '${conceptName}', '${conceptImage}', '${comments}')
        `)
        .then(res.status(200))
        .catch(err => console.log('error creating fan submission', err))
    },
    getConcepts: (req, res) => {
        sequelize.query(`
        SELECT * FROM user_submissions;
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log('error creating fan submission', err))
    },

    deleteClimb: (req, res) => {
        let {id} = req.params
        sequelize.query(`
        DELETE FROM user_submissions
        WHERE id = ${id}
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log('error deleting concept', err))
    },

    editConcept: (req, res) => {
        sequelize.query(`
        SELECT * FROM user_submissions
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log('error editing concept', err))
    },

    submitEdits: (req, res) => {
        let {id} = req.params
        let { fName, email, conceptName, conceptImage, comments } = req.body
        sequelize.query(`
        UPDATE user_submissions
        SET fName = '${fName}', 
            email = '${email}', 
            conceptName = '${conceptName}', 
            conceptImage = '${conceptImage}', 
            comments = '${comments}'
        WHERE id = ${id};
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log('error deleting fan submission', err))
    }
}