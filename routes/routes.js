const express = require('express')
const router = express.Router()
const usersController = require('../controllers/usersController')
const materialController = require('../controllers/materialController')
const relController = require("../controllers/magazziniController");



router.get("/tecnici", usersController.index)
router.post("/tecnici", usersController.store)
router.delete("/tecnici/:Matricola", usersController.destroy)
router.put("/tecnici/:Matricola", usersController.update)

router.get("/materiale", materialController.index)
router.post("/materiale", materialController.store)
router.delete("/materiale/:Item", materialController.destroy)
router.put("/materiale/:Item", materialController.update)

router.get("/relazioni", relController.index);
router.post("/relazioni", relController.store);
router.put("/relazioni/:MatricolaTecnico/:Item", relController.update);
router.delete("/relazioni/:MatricolaTecnico/:Item", relController.destroy);


module.exports = router