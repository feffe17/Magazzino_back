const connection = require("../db/db");

function index(req, res) {
    console.log("Eseguito matController.index");
    connection.query("SELECT * FROM materiale", (err, results) => {
        if (err) return res.status(500).json({ err: err })
        res.json({
            materiale: results,
            count: results.length
        })
    })
}

module.exports = {
    index
}