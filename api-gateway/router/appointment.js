const express = require("express")
const appointmentCtrl = require('../controller/appointment')
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/http/jobs", appointmentCtrl.post)
router.get("/http/jobs", appointmentCtrl.get)

router.get("/http/appointments", appointmentCtrl.get)
router.post("/http/appointments", appointmentCtrl.pushKafka)
router.post("/http/appointments/kafka", appointmentCtrl.post) // TODO remove this
router.patch("/http/appointments/:id", appointmentCtrl.patch)
router.get("/health", appointmentCtrl.get)



// router.get("/protected", auth.protected(process.env.APPOINTMENT_SECRET),  appointmentCtrl.get)
module.exports = router