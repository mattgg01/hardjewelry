const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())
const path = require('path')
// const {seed} = require('./seed.js')
const {concepts, conceptsCss, blackjack, blackjackCss, blackjackJs, conceptPost, editConcept, submitEdits, landing, landingCss, conceptsJs, getConcepts} = require('./controller.js')

app.get('/concepts', concepts)
app.get('/conceptsCss', conceptsCss)
app.get('/conceptsJs', conceptsJs)
app.get('/blackjack', blackjack)
app.get('/blackjackCss', blackjackCss)
app.get('/blackjackJs', blackjackJs)
app.post('/conceptPost', conceptPost)
app.get('/editConcept', editConcept)
app.put('/submitEdits/:id', submitEdits)
app.get('/', landing); 
app.get('/Css', landingCss)
app.use('/assets', express.static(path.join(__dirname, '../assets')))
app.get('/getConcepts', getConcepts)
// app.post('/seed', seed)
//To seed DB again, move 'seed.js' to server folder first


app.listen(4000, () => console.log(`up on 4000`))