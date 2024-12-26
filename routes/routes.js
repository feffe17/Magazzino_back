const express = require('express')
const router = express.Router()
const tecController = require('../controllers/tecController')
const matController = require('../controllers/matController')


router.get("/tecnici", tecController.index)

router.get("/materiale", matController.index)

module.exports = router