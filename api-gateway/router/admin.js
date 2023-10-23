const express = require("express")
const adminCtrl = require('../controller/admin')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", adminCtrl.get)
// router.get("/protected", auth.protected(process.env.ADMIN_SECRET),  adminCtrl.get)
module.exports = router