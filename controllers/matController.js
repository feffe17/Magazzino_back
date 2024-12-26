const connection = require("../db/db");
const table1 = process.env.TABLE1;
const table1Columns = process.env.TABLE1_COLUMNS.split(',');

function index(req, res) {
    connection.query(`SELECT * FROM ??`, [table1], (err, results) => {
        if (err) return res.status(500).json({ err });
        res.json({
            materiale: results,
            count: results.length
        });
    });
}

function store(req, res) {
    const { Item, NomeOggetto } = req.body;

    if (!Item || !NomeOggetto) {
        return res.status(400).json({ error: "I campi 'Item' e 'NomeOggetto' sono obbligatori." });
    }

    const query = `INSERT INTO ?? (${table1Columns.join(', ')}) VALUES (?, ?)`;

    connection.query(query, [table1, Item, NomeOggetto], (err, results) => {
        if (err) {
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(409).json({ error: `L'Item '${Item}' esiste già.` });
            }
            return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
        }

        res.status(201).json({
            message: "Item aggiunto con successo.",
            data: { Item, NomeOggetto }
        });
    });
}

function destroy(req, res) {
    const { Item } = req.params;

    if (!Item) {
        return res.status(400).json({ error: "Il campo 'Item' è obbligatorio." });
    }

    const query = "DELETE FROM ?? WHERE ?? = ?";
    connection.query(query, [table1, table1Columns[0], Item], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Nessun 'Item' trovato con il valore '${Item}'` });
        }

        res.status(200).json({
            message: `L'Item '${Item}' è stato eliminato con successo.`
        });
    });
}

function update(req, res) {
    const { Item } = req.params;
    const { NomeOggetto } = req.body;

    if (!Item || !NomeOggetto) {
        return res.status(400).json({ error: "I campi 'Item' e 'NomeOggetto' sono obbligatori." });
    }

    const query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    connection.query(query, [table1, table1Columns[1], NomeOggetto, table1Columns[0], Item], (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: `Nessun 'Item' trovato con il valore '${Item}'` });
        }

        res.status(200).json({
            message: `Il 'NomeOggetto' dell'Item '${Item}' è stato aggiornato con successo.`,
            data: { Item, NomeOggetto }
        });
    });
}

module.exports = {
    index,
    store,
    destroy,
    update
};
