const express = require('express')
const loadEnv = require('./utils/load-env')
const router = require('./router/router');


loadEnv()
const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

// Authentication
app.use((req, res, next) => {
  // TODO: my authentication logic
  console.log("req in")
  next()
})

// Proxy request
app.use(router)



app.listen(port, () => {
    console.log(`api-gateway is listening on port ${port}`)
})