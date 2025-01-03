const connection = require("../db/db");

function index(req, res) {
    const userId = req.user.ID; // Assumendo che l'utente sia autenticato e il suo ID sia disponibile nel middleware

    connection.query(
        "SELECT * FROM Magazzini WHERE UserID = ?",
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero dei magazzini.", details: err });
            res.json(results);
        }
    );
}

function store(req, res) {
    const { NomeMagazzino } = req.body;
    const userId = req.user.ID; // ID dell'utente associato al magazzino

    if (!NomeMagazzino) {
        return res.status(400).json({ error: "Il campo 'NomeMagazzino' è obbligatorio." });
    }

    connection.query(
        "INSERT INTO Magazzini (NomeMagazzino, UserID) VALUES (?, ?)",
        [NomeMagazzino, userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
            res.status(201).json({ message: "Magazzino creato con successo." });
        }
    );
}

function destroy(req, res) {
    const { magazzinoId } = req.params;

    connection.query(
        "DELETE FROM Magazzini WHERE ID = ?",
        [magazzinoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Magazzino non trovato." });
            res.status(200).json({ message: "Magazzino eliminato con successo." });
        }
    );
}

function update(req, res) {
    const { magazzinoId } = req.params;
    const { NomeMagazzino } = req.body;

    if (!NomeMagazzino) {
        return res.status(400).json({ error: "Il campo 'NomeMagazzino' è obbligatorio." });
    }

    connection.query(
        "UPDATE Magazzini SET NomeMagazzino = ? WHERE ID = ?",
        [NomeMagazzino, magazzinoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Magazzino non trovato." });
            res.status(200).json({ message: "Magazzino aggiornato con successo." });
        }
    );
}

module.exports = {
    index,
    store,
    update,
    destroy
};
