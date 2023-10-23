const express = require("express")
const customerCtrl = require('../controller/customer')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", customerCtrl.get)
// router.get("/protected", auth.protected(process.env.CUSTOMER_SECRET),  customerCtrl.get)
module.exports = router