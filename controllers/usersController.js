const connection = require("../db/db");
const bcrypt = require('bcrypt');

function index(req, res) {
    connection.query("SELECT * FROM Users", (err, results) => {
        if (err) return res.status(500).json({ err: err });
        res.json({
            users: results,
            count: results.length
        });
    });
}

function store(req, res) {
    const { Username, Nome, Cognome, Email, Password } = req.body;

    // Verifica che i parametri siano forniti
    if (!Username || !Nome || !Cognome || !Email || !Password) {
        return res.status(400).json({ error: "I campi 'Username', 'Nome', 'Cognome', 'Email' e 'Password' sono obbligatori." });
    }

    // Criptazione della password
    bcrypt.hash(Password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante la criptazione della password.", details: err });
        }

        connection.query("INSERT INTO Users (Username, Nome, Cognome, Email, Password) VALUES (?, ?, ?, ?, ?)",
            [Username, Nome, Cognome, Email, hashedPassword], (err, results) => {
                if (err) {
                    if (err.code === "ER_DUP_ENTRY") {
                        return res.status(409).json({ error: `L'Username o l'Email '${Username}' esiste già.` });
                    }
                    return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
                }

                res.status(201).json({
                    message: "Utente aggiunto con successo.",
                    data: { Username, Nome, Cognome, Email }
                });
            });
    });
}

function destroy(req, res) {
    const { Username } = req.params;

    // Verifica che il parametro 'Username' sia fornito
    if (!Username) {
        return res.status(400).json({ error: "Il campo 'Username' è obbligatorio." });
    }

    connection.query("DELETE FROM Users WHERE Username = ?", [Username], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Nessun utente trovato con l'Username '${Username}'` });
        }

        res.status(200).json({
            message: `L'utente con Username '${Username}' è stato eliminato con successo.`
        });
    });
}


function update(req, res) {
    const { Username } = req.params; // Username da modificare
    const { Nome, Cognome, Email, Password } = req.body; // Nuovi dati

    if (!Username || !Nome || !Cognome || !Email) {
        return res.status(400).json({ error: "I campi 'Username', 'Nome', 'Cognome', 'Email' sono obbligatori." });
    }

    // Se la password è stata aggiornata, la criptografiamo
    let query = "UPDATE Users SET Nome = ?, Cognome = ?, Email = ? WHERE Username = ?";
    let values = [Nome, Cognome, Email, Username];

    if (Password) {
        bcrypt.hash(Password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante la criptazione della password.", details: err });
            }
            // Aggiorna anche la password
            query = "UPDATE Users SET Nome = ?, Cognome = ?, Email = ?, Password = ? WHERE Username = ?";
            values = [Nome, Cognome, Email, hashedPassword, Username];

            connection.query(query, values, (err, results) => {
                if (err) {
                    return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
                }

                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: `Nessun utente trovato con l'Username '${Username}'` });
                }

                res.status(200).json({
                    message: `I dati dell'utente con Username '${Username}' sono stati aggiornati con successo.`,
                    data: { Username, Nome, Cognome, Email }
                });
            });
        });
    } else {
        // Se non c'è una nuova password, aggiorniamo solo gli altri campi
        connection.query(query, values, (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Nessun utente trovato con l'Username '${Username}'` });
            }

            res.status(200).json({
                message: `I dati dell'utente con Username '${Username}' sono stati aggiornati con successo.`,
                data: { Username, Nome, Cognome, Email }
            });
        });
    }
}


module.exports = {
    index,
    store,
    destroy,
    update
}