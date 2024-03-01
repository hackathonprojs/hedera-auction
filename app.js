const express = require('express')
const app = express()
const port = 3000

app.get('/bid', (req, res) => {
    res.send('bid!')
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})