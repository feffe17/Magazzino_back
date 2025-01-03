const connection = require("../db/db");

// Funzione per ottenere i permessi di un magazzino
function index(req, res) {
    const { magazzinoId } = req.params;

    connection.query(
        "SELECT * FROM Permessi WHERE MagazzinoID = ?",
        [magazzinoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero dei permessi.", details: err });
            res.json(results);
        }
    );
}

// Funzione per assegnare i permessi a un utente
function store(req, res) {
    const { UserID, Ruolo } = req.body;
    const { magazzinoId } = req.params;

    // Controllo che tutti i parametri siano presenti
    if (!UserID || !Ruolo) {
        return res.status(400).json({ error: "I campi 'UserID' e 'Ruolo' sono obbligatori." });
    }

    // Inserimento del permesso nella tabella
    connection.query(
        "INSERT INTO Permessi (UserID, MagazzinoID, Ruolo) VALUES (?, ?, ?)",
        [UserID, magazzinoId, Ruolo],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'assegnazione dei permessi.", details: err });
            res.status(201).json({ message: "Permessi assegnati con successo." });
        }
    );
}

// Funzione per aggiornare il ruolo di un utente in un magazzino
function update(req, res) {
    const { permessoId } = req.params;
    const { Ruolo } = req.body;

    // Controllo che il ruolo sia presente
    if (!Ruolo) {
        return res.status(400).json({ error: "Il campo 'Ruolo' è obbligatorio." });
    }

    // Aggiornamento del ruolo
    connection.query(
        "UPDATE Permessi SET Ruolo = ? WHERE ID = ?",
        [Ruolo, permessoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'aggiornamento dei permessi.", details: err });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Permesso non trovato." });
            res.status(200).json({ message: "Ruolo aggiornato con successo." });
        }
    );
}

// Funzione per rimuovere i permessi di un utente da un magazzino
function destroy(req, res) {
    const { userId, magazzinoId } = req.params;

    // Eliminazione dei permessi
    connection.query(
        "DELETE FROM Permessi WHERE UserID = ? AND MagazzinoID = ?",
        [userId, magazzinoId],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante la rimozione dei permessi.", details: err });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Permessi non trovati." });
            res.status(200).json({ message: "Permessi rimossi con successo." });
        }
    );
}

module.exports = {
    index,
    store,
    update,
    destroy
};
