const express = require("express")
const customerCtrl = require('../controller/customer')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", customerCtrl.get)
router.post("/api/register", customerCtrl.post)
router.post("/api/login", customerCtrl.post)
router.get("/api/customers/:customerId", customerCtrl.get)
router.get("/api/customers", customerCtrl.get)
router.post("/api/customers", customerCtrl.post)
router.put("/api/customers/:customerId", customerCtrl.put)
router.delete("/api/customers/:customerId", customerCtrl.del)

router.get("/api/addresses/:addressId", customerCtrl.get)
router.get("/api/addresses", customerCtrl.get)
router.get("/api/addresses/customers/:custmoerId", customerCtrl.get)
router.post("/api/customers/:customerId/addresses", customerCtrl.post)
router.delete("/api/addresses/:addressId", customerCtrl.del)

router.get("/", customerCtrl.get)



module.exports = router