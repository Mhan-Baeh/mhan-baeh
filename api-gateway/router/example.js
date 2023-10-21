const express = require("express")
const exampleCtrl = require('../controller/example')

const router = express.Router()

router.get("/", exampleCtrl.get)
router.post("/", exampleCtrl.post)
router.put("/", exampleCtrl.put)
router.delete("/", exampleCtrl.del)

module.exports = router