const express = require("express")
const adminCtrl = require('../controller/admin')
const auth = require("../middleware/auth")

const router = express.Router()

// no protected
router.get("/health", adminCtrl.get) // all (should be internal)
router.post("/admin", adminCtrl.post) // no one *need backdoor
router.post("/admin/login", adminCtrl.post) // no auth

module.exports = router