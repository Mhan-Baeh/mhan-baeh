const express = require("express")
const customerCtrl = require('../controller/customer')
const auth = require("../middleware/auth")

const router = express.Router()

// router.get("/", customerCtrl.get)
// no protect
router.post("/api/register", customerCtrl.post)
router.post("/api/login", customerCtrl.post)

// protected
router.get("/api/customers/:customerId", auth.protected(auth.admin, auth.customer), auth.authorized([{role: "admin"}, {role: "customer", idParam: "customerId"}]), customerCtrl.get) // customer(self), admin
router.get("/api/customers", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), customerCtrl.get) // admin
router.post("/api/customers", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), customerCtrl.post) // admin
router.put("/api/customers/:customerId", auth.protected(auth.admin, auth.customer), auth.authorized([{role: "admin"}, {role: "customer", idParam: "customerId"}]), customerCtrl.put) // customer(self), admin
router.delete("/api/customers/:customerId", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), customerCtrl.del) // admin
router.post("/api/customers/:customerId/addresses", auth.protected(auth.admin, auth.customer), auth.authorized([{role: "admin"}, {role: "customer", idParam: "customerId"}]), customerCtrl.post) // customer(self), admin

router.get("/api/addresses/:addressId", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), customerCtrl.get) // admin
router.get("/api/addresses", auth.protected(auth.admin), auth.authorized([{role: "admin"}]), customerCtrl.get) // admin
router.get("/api/addresses/customers/:customerId", auth.protected(auth.admin, auth.customer), auth.authorized([{role: "admin"}, {role: "customer", idParam: "customerId"}]), customerCtrl.get) // customer(self), admin
router.delete("/api/addresses/:addressId", auth.protected(auth.admin, auth.customer), auth.authorized([{role: "admin"}, {role: "customer"}]), customerCtrl.del) // customer(self), admin

// health hidden
router.get("/", customerCtrl.get)



module.exports = router