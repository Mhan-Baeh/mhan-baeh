const express = require('express');

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const router = express.Router()
router.get("/", (req, res) => {
    res.status(502).json({
        success: true
    })
})

router.post('/', (req, res) => {
    console.log(req.body)
    res.status(201).json(req.body)
})

app.use(router)

app.listen(4000, () => {
    console.log("server up")
})