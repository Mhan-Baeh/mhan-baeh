const express = require("express")
const housekeeperCtrl = require('../controller/housekeeper')
const auth = require("../middleware/auth")

const router = express.Router()
// no protected
router.get("/health", housekeeperCtrl.get)


router.post("/housekeeper", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), housekeeperCtrl.post) // admin
router.post("/housekeeper/login", housekeeperCtrl.post) // no protect
router.get("/housekeepers", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), housekeeperCtrl.get) // admin
router.get("/housekeeper/:housekeeperId", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), housekeeperCtrl.get) // admin

module.exports = router