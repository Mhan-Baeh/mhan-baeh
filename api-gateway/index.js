const express = require('express')
require('./utils/load-env')()
const router = require('./router/router');
const logger = require('./middleware/log')


const port = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use(logger.requestLogger)

// Proxy request
app.use(router)



app.listen(port, () => {
    console.log(`api-gateway is listening on port ${port}`)
})