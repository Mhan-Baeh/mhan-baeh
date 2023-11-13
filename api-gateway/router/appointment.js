const express = require("express")
const appointmentCtrl = require('../controller/appointment')
const auth = require("../middleware/auth")

const router = express.Router()

// protected
router.post("/http/jobs", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), appointmentCtrl.post) // admin
router.get("/http/jobs", auth.protected(...auth.allRoles), auth.authorized([{role: "all"}]), appointmentCtrl.get) // all

// protected
router.get("/http/appointments", auth.protected(...auth.allRoles), auth.authorized([{role: "all"}]), appointmentCtrl.get) // all
router.post("/http/appointments", auth.protected(auth.customer), auth.authorized([{role: "customer"}]), appointmentCtrl.pushKafka) // customer
// router.post("/http/appointments/kafka", appointmentCtrl.post) // TODO remove this
router.get("/http/appointments/:id", auth.protected(...auth.allRoles), auth.authorized([{role: "all"}]), appointmentCtrl.get) // all
router.patch("/http/appointments/:id/status", auth.protected(...auth.allRoles), auth.authorized([{role: "all"}]), appointmentCtrl.patch) // all

// no protect
router.get("/http/health", appointmentCtrl.get)



// router.get("/protected", auth.protected(process.env.APPOINTMENT_SECRET),  appointmentCtrl.get)
module.exports = router