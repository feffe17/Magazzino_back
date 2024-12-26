const connection = require("../db/db");

function index(req, res) {
    console.log("Eseguito tecController.index");
    connection.query("SELECT * FROM tecnici", (err, results) => {
        if (err) return res.status(500).json({ err: err })
        res.json({
            tecnici: results,
            count: results.length
        })
    })
}



module.exports = {
    index
}