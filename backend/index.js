const express = require('express')
const router = require('./routes')
const cors = require('cors')
const app = express()
app.use(cors())

app.use('/file',express.static(__dirname + '/public'))

app.use('/api', router)

app.listen(8000, () => {
  console.log(`Server ran --> http://localhost:8000/`)
})