const connection = require("../db/db");
const table2 = process.env.TABLE2;
const table2Columns = process.env.TABLE2_COLUMNS.split(',');

function index(req, res) {
    connection.query("SELECT * FROM ??", [table2], (err, results) => {
        if (err) return res.status(500).json({ err: err });
        res.json({
            results,
            count: results.length
        });
    });
}

function store(req, res) {
    const columnValues = table2Columns.map(column => req.body[column]);

    // Verifica che tutti i valori siano forniti
    if (columnValues.includes(undefined)) {
        return res.status(400).json({ error: `I campi ${table2Columns.join(', ')} sono obbligatori.` });
    }

    const placeholders = table2Columns.map(() => "?").join(", ");
    connection.query(
        `INSERT INTO ?? (${table2Columns.join(', ')}) VALUES (${placeholders})`,
        [table2, ...columnValues],
        (err, results) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ error: `Un record con questi dati esiste già.` });
                }
                return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
            }

            res.status(201).json({
                message: "Record aggiunto con successo.",
                data: Object.fromEntries(table2Columns.map((col, idx) => [col, columnValues[idx]]))
            });
        }
    );
}

function destroy(req, res) {
    const primaryKey = table2Columns[0]; // Supponiamo che la prima colonna sia la chiave primaria
    const primaryKeyValue = req.params[primaryKey];

    if (!primaryKeyValue) {
        return res.status(400).json({ error: `Il campo '${primaryKey}' è obbligatorio.` });
    }

    connection.query(
        "DELETE FROM ?? WHERE ?? = ?",
        [table2, primaryKey, primaryKeyValue],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Nessun record trovato con '${primaryKey}' = '${primaryKeyValue}'` });
            }

            res.status(200).json({
                message: `Il record con '${primaryKey}' = '${primaryKeyValue}' è stato eliminato con successo.`
            });
        }
    );
}

function update(req, res) {
    const primaryKey = table2Columns[0]; // Supponiamo che la prima colonna sia la chiave primaria
    const primaryKeyValue = req.params[primaryKey];

    if (!primaryKeyValue) {
        return res.status(400).json({ error: `Il campo '${primaryKey}' è obbligatorio.` });
    }

    const updateData = table2Columns.slice(1).reduce((acc, column) => {
        if (req.body[column] !== undefined) {
            acc.columns.push(column);
            acc.values.push(req.body[column]);
        }
        return acc;
    }, { columns: [], values: [] });

    if (updateData.columns.length === 0) {
        return res.status(400).json({ error: "Almeno un campo deve essere fornito per l'aggiornamento." });
    }

    const updatePlaceholders = updateData.columns.map(column => `${column} = ?`).join(", ");
    connection.query(
        `UPDATE ?? SET ${updatePlaceholders} WHERE ?? = ?`,
        [table2, ...updateData.values, primaryKey, primaryKeyValue],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({ error: `Nessun record trovato con '${primaryKey}' = '${primaryKeyValue}'` });
            }

            res.status(200).json({
                message: `Il record con '${primaryKey}' = '${primaryKeyValue}' è stato aggiornato con successo.`,
                data: Object.fromEntries(updateData.columns.map((col, idx) => [col, updateData.values[idx]]))
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
