const express = require('express')
const router = express.Router()
const tecController = require('../controllers/tecController')

router.get("/", tecController.index)

module.exports = router