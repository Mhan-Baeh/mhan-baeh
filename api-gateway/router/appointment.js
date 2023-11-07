const express = require("express")
const appointmentCtrl = require('../controller/appointment')
const auth = require("../middleware/auth")

const router = express.Router()

// protected
router.post("/http/jobs", auth.protected, auth.authorized([{role: "admin"}]), appointmentCtrl.post) // admin
router.get("/http/jobs", auth.protected, auth.authorized([{role: "all"}]), appointmentCtrl.get) // all

// protected
router.get("/http/appointments", auth.protected, auth.authorized([{role: "all"}]), appointmentCtrl.get) // all
router.post("/http/appointments", auth.protected, auth.authorized([{role: "customer"}]), appointmentCtrl.pushKafka) // customer
// router.post("/http/appointments/kafka", appointmentCtrl.post) // TODO remove this
router.patch("/http/appointments/:id", auth.protected, auth.authorized([{role: "all"}]), appointmentCtrl.patch) // all

// no protect
router.get("/health", appointmentCtrl.get)



// router.get("/protected", auth.protected(process.env.APPOINTMENT_SECRET),  appointmentCtrl.get)
module.exports = router