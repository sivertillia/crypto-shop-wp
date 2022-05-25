const express = require('express')
const router = require('./routes')
const app = express()

app.use('/api', router)

app.listen(8000, () => {
  console.log(`Server ran --> http://localhost:8000/`)
})