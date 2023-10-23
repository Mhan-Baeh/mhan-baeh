const express = require("express")
const matchingCtrl = require('../controller/matching')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", matchingCtrl.get)
// router.get("/protected", auth.protected(process.env.MATCHING_SECRET),  matchingCtrl.get)
module.exports = router