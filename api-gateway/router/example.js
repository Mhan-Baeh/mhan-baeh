const express = require("express")
const exampleCtrl = require('../controller/example')
const auth = require("../middleware/auth")

const router = express.Router()

router.get("/", exampleCtrl.get)
router.post("/a", exampleCtrl.post)
router.put("/a/b", exampleCtrl.put)
router.delete("/a/c", exampleCtrl.del)
router.post("/login", exampleCtrl.post)
router.post("/logout", exampleCtrl.post)
router.post("/register", exampleCtrl.post)
router.get("/protected", auth.protected(process.env.EXAMPLE_SECRET),  exampleCtrl.get)
module.exports = router