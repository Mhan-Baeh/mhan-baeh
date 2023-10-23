const express = require("express")
const housekeeperCtrl = require('../controller/housekeeper')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", housekeeperCtrl.get)
// router.get("/protected", auth.protected(process.env.HOUSEKEEPER_SECRET),  housekeeperCtrl.get)
module.exports = router