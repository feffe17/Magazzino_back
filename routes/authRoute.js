const express = require("express")
const jwt = require("../middleware/jwt")
const loginRouter = express.Router()

loginRouter.post("/", (req, res) => {
    console.log(req.body.username, req.body.password);
    if (req.body.username == "feffe") {
        let token = jwt.setToken(2, req.body.username)
        let payLoad = jwt.getPayload(token)
        res.json({ token: token, payLoad: payLoad })
    } else {
        res.sendStatus(401);
    }

})


module.exports = loginRouter;