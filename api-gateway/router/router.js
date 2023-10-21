const express = require('express')
const exampleRouter = require('./example')

const router = express.Router()

router.use("/example-api", exampleRouter)

module.exports = router