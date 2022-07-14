const connectToMongo =require("./db")
const express = require('express')
var cors = require('cors')

connectToMongo();
const app = express()
const port = 80


app.use(cors())
app.use(express.json())
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Available Routes---------------
app.use('/api/auth',require('./routes/auth.js'))
app.use('/api/notes',require('./routes/notes.js'))


app.listen(port, () => {
  console.log(`inotebook backend listening on port ${port}`)
})