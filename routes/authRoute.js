const express = require("express")
const loginRouter = express.Router()

loginRouter.post("/", (req, res) => {
    console.log(req.body.username, req.body.password);
    res.end("ciaoooo")

})


module.exports = loginRouter;