const express = require('express')
const exampleRouter = require('./example')
const adminRouter = require('./admin')
const customerRouter = require('./customer')
const housekeeperRouter = require('./housekeeper')
const appointmentRouter = require('./appointment')

const router = express.Router()

router.use('/example-api', exampleRouter)
router.use('/admin-api', adminRouter)
router.use('/customer-api', customerRouter)
router.use('/housekeeper-api', housekeeperRouter)
router.use('/appointment-api', appointmentRouter)

module.exports = router