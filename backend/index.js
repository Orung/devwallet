const express = require('express')
const { routeManager } = require('./routes/rts.js');
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv') 
const bodyParser = require('body-parser')
const app = express()
const saltRounds = bcrypt.genSaltSync(10)


const port = 8080;
const cors = require('cors');
dotenv.config()

app.use(cors())
 console.log(process.env.DATABASE)

console.log(bcrypt.hashSync("p@ssword",saltRounds))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.use('/',routeManager)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})