const express = require("express")
const housekeeperCtrl = require('../controller/housekeeper')
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/health", housekeeperCtrl.get)
router.post("/housekeeper", housekeeperCtrl.post)
router.post("/housekeeper/login", housekeeperCtrl.post)
router.get("/housekeeper", housekeeperCtrl.get)
router.get("/housekeeper/:housekeeperId", housekeeperCtrl.get)

module.exports = router