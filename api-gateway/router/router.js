const express = require('express')
const cors = require("cors")
const { getCORSOption } = require("../utils/cors")
const exampleRouter = require('./example')
const adminRouter = require('./admin')
const customerRouter = require('./customer')
const housekeeperRouter = require('./housekeeper')
const appointmentRouter = require('./appointment')

const adminOpt = getCORSOption(process.env.ADMIN_URI)
const customerOpt = getCORSOption(process.env.CUSTOMER_URI)
const housekeeperOpt = getCORSOption(process.env.HOUSEKEEPER_URI)

const router = express.Router()

router.use('/example-api', exampleRouter)
router.use('/admin-api', cors(adminOpt),adminRouter)
router.use('/customer-api', cors(customerOpt), customerRouter)
router.use('/housekeeper-api', cors(housekeeperOpt), housekeeperRouter)
router.use('/appointment-api', appointmentRouter)

module.exports = router