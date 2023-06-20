const express = require('express')
const app = express()
require('dotenv').config()
app.use(express.json())
const path = require('path')
const {concepts, conceptsCss, blackjack, blackjackCss, blackjackJs, conceptPost, editConcept, submitEdits, landing, landingCss} = require('./controller.js')

app.get('/concepts', concepts)
app.get('/conceptsCss', conceptsCss)
app.get('/blackjack', blackjack)
app.get('/blackjackCss', blackjackCss)
app.get('/blackjackJs', blackjackJs)
app.post('/conceptPost', conceptPost)
app.get('/editConcept', editConcept)
app.put('/submitEdits/:id', submitEdits)
app.get('/', landing); 
app.get('/Css', landingCss)
app.use('/assets', express.static(path.join(__dirname, '../assets')))


app.listen(4000, () => console.log(`up on 4000`))