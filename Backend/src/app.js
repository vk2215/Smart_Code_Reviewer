const express = require('express')
const app = express()
const aiRoute = require('./routes/ai.routes')
const cors = require('cors')
app.get('/',(req,res)=>{
    res.send("Hello world");
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.use('/ai',aiRoute);

module.exports = app
