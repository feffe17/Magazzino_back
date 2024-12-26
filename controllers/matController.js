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

function store(req, res) {
    const { Item, NomeOggetto } = req.body;

    // Verifica che i parametri siano forniti
    if (!Item || !NomeOggetto) {
        return res.status(400).json({ error: "I campi 'Item' e 'NomeOggetto' sono obbligatori." });
    }

    connection.query("INSERT INTO materiale (Item, NomeOggetto) VALUES (?, ?)", [Item, NomeOggetto], (err, results) => {
        if (err) {
            // Gestione degli errori, ad esempio violazione di chiave primaria o altro
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: `L'Item '${Item}' esiste già.` });
            }
            return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
        }

        // Risposta in caso di successo
        res.status(201).json({
            message: "Item aggiunto con successo.",
            data: { Item, NomeOggetto }
        });
    });
}

function destroy(req, res) {
    const { Item } = req.params;

    // Verifica che il parametro 'Item' sia fornito
    if (!Item) {
        return res.status(400).json({ error: "Il campo 'Item' è obbligatorio." });
    }

    connection.query("DELETE FROM materiale WHERE Item = ?", [Item], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
        }

        // Verifica se è stato effettivamente eliminato un record
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Nessun 'Item' trovato con il valore '${Item}'` });
        }

        // Risposta in caso di successo
        res.status(200).json({
            message: `L'Item '${Item}' è stato eliminato con successo.`
        });
    });
}

function update(req, res) {
    const { Item } = req.params; // Item da modificare
    const { NomeOggetto } = req.body; // Nuovo NomeOggetto

    // Verifica che i parametri siano forniti
    if (!Item || !NomeOggetto) {
        return res.status(400).json({ error: "Il campo 'Item' e 'NomeOggetto' sono obbligatori." });
    }

    // Query per aggiornare il NomeOggetto dell'Item specificato
    connection.query(
        "UPDATE materiale SET NomeOggetto = ? WHERE Item = ?",
        [NomeOggetto, Item],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
            }

            // Verifica se è stato effettivamente aggiornato un record
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Nessun 'Item' trovato con il valore '${Item}'` });
            }

            // Risposta in caso di successo
            res.status(200).json({
                message: `Il 'NomeOggetto' dell'Item '${Item}' è stato aggiornato con successo.`,
                data: { Item, NomeOggetto }
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

