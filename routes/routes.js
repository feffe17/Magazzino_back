const express = require('express')
const router = express.Router()
const tecController = require('../controllers/tecController')
const matController = require('../controllers/matController')
const relController = require("../controllers/relController");



router.get("/tecnici", tecController.index)
router.post("/tecnici", tecController.store)
router.delete("/tecnici/:Matricola", tecController.destroy)
router.put("/tecnici/:Matricola", tecController.update)

router.get("/materiale", matController.index)
router.post("/materiale", matController.store)
router.delete("/materiale/:Item", matController.destroy)
router.put("/materiale/:Item", matController.update)

router.get("/relazioni", relController.index);
router.post("/relazioni", relController.store);
router.put("/relazioni/:MatricolaTecnico/:Item", relController.update);
router.delete("/relazioni/:MatricolaTecnico/:Item", relController.destroy);


module.exports = router