const express = require('express')
const cors = require("cors")
const { getCORSOption } = require("../utils/cors")
const exampleRouter = require('./example')
const adminRouter = require('./admin')
const customerRouter = require('./customer')
const housekeeperRouter = require('./housekeeper')
const appointmentRouter = require('./appointment')

const adminOpt = getCORSOption(process.env.ADMIN_UI.split(",") || "*")
const customerOpt = getCORSOption(process.env.CUSTOMER_UI.split(",") || "*");
const housekeeperOpt = getCORSOption(process.env.HOUSEKEEPER_UI.split(",") || "*");

console.log(`cors admin: ${process.env.ADMIN_UI}`)
console.log(`cors customer: ${process.env.CUSTOMER_UI}`)
console.log(`cors housekeeper: ${process.env.HOUSEKEEPER_UI}`)

const router = express.Router()

router.use('/example-api', exampleRouter)
router.use('/admin-api', cors(adminOpt),adminRouter)
router.use('/customer-api', cors(customerOpt), customerRouter)
router.use('/housekeeper-api', cors(housekeeperOpt), housekeeperRouter)
router.use('/appointment-api', appointmentRouter)

module.exports = router