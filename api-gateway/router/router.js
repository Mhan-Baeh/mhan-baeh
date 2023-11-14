const express = require('express')
const cors = require("cors")
const { getCORSOption } = require("../utils/cors")
const exampleRouter = require('./example')
const adminRouter = require('./admin')
const customerRouter = require('./customer')
const housekeeperRouter = require('./housekeeper')
const appointmentRouter = require('./appointment')
let allUiPath = process.env.ADMIN_UI + "," + process.env.CUSTOMER_UI + "," + process.env.HOUSEKEEPER_UI

const adminOpt = getCORSOption(process.env.ADMIN_UI.split(",") || "*")
const customerOpt = getCORSOption(process.env.CUSTOMER_UI.split(",") || "*");
const housekeeperOpt = getCORSOption("*");
const allOpt = getCORSOption(allUiPath.split(",") || "*");



console.log(`cors admin: ${process.env.ADMIN_UI}`)
console.log(`cors customer: ${process.env.CUSTOMER_UI}`)
console.log(`cors housekeeper: ${process.env.HOUSEKEEPER_UI}`)
console.log(`cors all: ${allUiPath}`)

const router = express.Router()
// string of all cors ui path join with comma in a variable

router.use('/example-api', exampleRouter)
router.use('/admin-api', cors(adminOpt),adminRouter)
router.use('/customer-api', cors(customerOpt), customerRouter)
router.use('/housekeeper-api', cors(housekeeperOpt), housekeeperRouter)
router.use("/appointment-api", cors(allOpt), appointmentRouter);

module.exports = router