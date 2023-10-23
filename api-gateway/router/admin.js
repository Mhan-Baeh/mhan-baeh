const express = require("express")
const adminCtrl = require('../controller/admin')
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/health", adminCtrl.get)
router.post("/admin", adminCtrl.post)
router.post("/admin/login", adminCtrl.post)

module.exports = router