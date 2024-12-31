const connection = require("../db/db");

function index(req, res) {
    // console.log("Eseguito tecController.index");
    connection.query("SELECT * FROM tecnici", (err, results) => {
        if (err) return res.status(500).json({ err: err })
        res.json({
            tecnici: results,
            count: results.length
        })
    })
}

function store(req, res) {
    const { Matricola, Nome, Cognome } = req.body;

    // Verifica che i parametri siano forniti
    if (!Matricola || !Nome || !Cognome) {
        return res.status(400).json({ error: "I campi 'Matricola', 'Nome' e 'Cognome' sono obbligatori." });
    }

    connection.query("INSERT INTO tecnici (Matricola, Nome, Cognome) VALUES (?, ?, ?)", [Matricola, Nome, Cognome], (err, results) => {
        if (err) {
            // Gestione degli errori, ad esempio violazione di chiave primaria o altro
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: `La matricola  '${Matricola}' esiste già.` });
            }
            return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
        }

        // Risposta in caso di successo
        res.status(201).json({
            message: "Tecnico aggiunto con successo.",
            data: { Matricola, Nome, Cognome }
        });
    });
}

function destroy(req, res) {
    const { Matricola } = req.params;

    // Verifica che il parametro 'Item' sia fornito
    if (!Matricola) {
        return res.status(400).json({ error: "Il campo 'Matricola' è obbligatorio." });
    }

    connection.query("DELETE FROM tecnici WHERE Matricola = ?", [Matricola], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
        }

        // Verifica se è stato effettivamente eliminato un record
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Nessuna 'Matricola' trovato con il valore '${Matricola}'` });
        }

        // Risposta in caso di successo
        res.status(200).json({
            message: `La Matricola '${Matricola}' è stato eliminato con successo.`
        });
    });
}

function update(req, res) {
    const { Matricola } = req.params; // Matricola da modificare
    const { Nome, Cognome } = req.body; // Nuovo Nome e Cognome

    // Verifica che i parametri siano forniti
    if (!Matricola || !Nome || !Cognome) {
        return res.status(400).json({ error: "I campi 'Matricola', 'Nome' e 'Cognome' sono obbligatori." });
    }

    // Query per aggiornare il Nome e/o il Cognome della Matricola specificata
    connection.query(
        "UPDATE tecnici SET Nome = ?, Cognome = ? WHERE Matricola = ?",
        [Nome, Cognome, Matricola],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
            }

            // Verifica se è stato effettivamente aggiornato un record
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Nessuna 'Matricola' trovata con il valore '${Matricola}'` });
            }

            // Risposta in caso di successo
            res.status(200).json({
                message: `Il Nome e Cognome della Matricola '${Matricola}' sono stati aggiornati con successo.`,
                data: { Matricola, Nome, Cognome }
            });
        }
    );
}

module.exports = {
    index,
    store,
    destroy,
    update
}