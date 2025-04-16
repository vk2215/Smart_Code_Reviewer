const express = require("express")

const router = express.Router()

const aiController = require("../controllers/ai.controller")

router.post("/get-review",aiController.getResponse)

module.exports = router