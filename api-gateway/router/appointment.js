const express = require("express")
const appointmentCtrl = require('../controller/appointment')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", appointmentCtrl.get)
// router.get("/protected", auth.protected(process.env.APPOINTMENT_SECRET),  appointmentCtrl.get)
module.exports = router