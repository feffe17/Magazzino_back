const connection = require("../db/db");

function index(req, res) {
    console.log("Eseguito materialController.index");

    connection.query("SELECT * FROM Materiale", (err, results) => {
        if (err) return res.status(500).json({ err: err });

        res.json({
            materiale: results,
            count: results.length
        });
    });
}

function store(req, res) {
    const { Item, Descrizione, MagazzinoID, Utilizzabili, Guasti } = req.body;

    // Verifica che i parametri siano forniti
    if (!Item || !MagazzinoID) {
        return res.status(400).json({ error: "I campi 'Item' e 'MagazzinoID' sono obbligatori." });
    }

    connection.query(
        "INSERT INTO Materiale (Item, Descrizione, Utilizzabili, Guasti, MagazzinoID) VALUES (?, ?, ?, ?, ?)",
        [Item, Descrizione, Utilizzabili, Guasti, MagazzinoID],
        (err, results) => {
            if (err) {
                // Gestione degli errori, ad esempio violazione di chiave primaria o altro
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ error: `L'Item '${Item}' esiste già nel magazzino.` });
                }
                return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
            }

            // Risposta in caso di successo
            res.status(201).json({
                message: "Item aggiunto con successo.",
                data: { Item, Descrizione, MagazzinoID }
            });
        }
    );
}

function destroy(req, res) {
    const { Item, MagazzinoID } = req.params;

    // Verifica che i parametri siano forniti
    if (!Item || !MagazzinoID) {
        return res.status(400).json({ error: "I campi 'Item' e 'MagazzinoID' sono obbligatori." });
    }

    connection.query("DELETE FROM Materiale WHERE Item = ? AND MagazzinoID = ?", [Item, MagazzinoID], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
        }

        // Verifica se è stato effettivamente eliminato un record
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Nessun 'Item' trovato con il valore '${Item}' nel magazzino '${MagazzinoID}'` });
        }

        // Risposta in caso di successo
        res.status(200).json({
            message: `L'Item '${Item}' è stato eliminato con successo dal magazzino '${MagazzinoID}'.`
        });
    });
}

function update(req, res) {
    const { Item, MagazzinoID } = req.params; // Item da modificare e MagazzinoID
    const { Descrizione, Utilizzabili, Guasti } = req.body; // Nuovi dati

    // Verifica che i parametri siano forniti
    if (!Item || !MagazzinoID) {
        return res.status(400).json({ error: "I campi 'Item' e 'MagazzinoID' sono obbligatori." });
    }

    // Query per aggiornare l'Item
    connection.query(
        "UPDATE Materiale SET Descrizione = ?, Utilizzabili = ?, Guasti = ? WHERE Item = ? AND MagazzinoID = ?",
        [Descrizione, Utilizzabili, Guasti, Item, MagazzinoID],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
            }

            // Verifica se è stato effettivamente aggiornato un record
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Nessun 'Item' trovato con il valore '${Item}' nel magazzino '${MagazzinoID}'` });
            }

            // Risposta in caso di successo
            res.status(200).json({
                message: `L'Item '${Item}' nel magazzino '${MagazzinoID}' è stato aggiornato con successo.`,
                data: { Item, Descrizione, Utilizzabili, Guasti }
            });
        }
    );
}


module.exports = {
    index,
    store,
    destroy,
    update
};

