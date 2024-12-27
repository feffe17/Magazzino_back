const connection = require("../db/db");
const reltable = process.env.RELTABLE; // Nome della tabella
const reltableColumns = process.env.RELTABLE_COLUMNS.split(","); // Nomi delle colonne

// Estrazione dinamica delle colonne
const [primaryKey1, primaryKey2, ...otherColumns] = reltableColumns;

function index(req, res) {
    connection.query(
        `SELECT r.${primaryKey1}, r.${primaryKey2}, ${otherColumns
            .map((col) => `r.${col}`)
            .join(", ")}, 
                t.Nome AS NomeTecnico, t.Cognome AS CognomeTecnico, 
                m.NomeOggetto 
         FROM ?? r
         JOIN tecnici t ON r.${primaryKey1} = t.Matricola
         JOIN materiale m ON r.${primaryKey2} = m.Item`,
        [reltable],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero delle relazioni.", details: err });
            res.json(results);
        }
    );
}

function store(req, res) {
    const data = req.body;

    // Controllo obbligatorietà delle chiavi primarie
    if (!data[primaryKey1] || !data[primaryKey2]) {
        return res
            .status(400)
            .json({ error: `I campi '${primaryKey1}' e '${primaryKey2}' sono obbligatori.` });
    }

    // Preparazione valori
    const values = reltableColumns.map((col) => data[col] || 0); // Valori mancanti saranno 0 di default

    connection.query(
        `INSERT INTO ?? (${reltableColumns.join(", ")}) VALUES (${new Array(reltableColumns.length)
            .fill("?")
            .join(", ")})`,
        [reltable, ...values],
        (err) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(409).json({ error: "La relazione esiste già." });
                }
                return res.status(500).json({ error: "Errore durante l'inserimento.", details: err });
            }
            res.status(201).json({ message: "Relazione creata con successo." });
        }
    );
}

function update(req, res) {
    const pk1 = reltableColumns[0]; // Prima colonna (PK1)
    const pk2 = reltableColumns[1]; // Seconda colonna (PK2)
    const colUtilizzabili = reltableColumns[2]; // Colonna Utilizzabili
    const colGuasti = reltableColumns[3]; // Colonna Guasti

    const { MatricolaTecnico, Item } = req.params; // Assumi che i parametri siano in req.params
    const { Utilizzabili, Guasti } = req.body; // Dati aggiornamento

    // Controllo che almeno uno dei due campi sia definito
    if (Utilizzabili === undefined && Guasti === undefined) {
        return res
            .status(400)
            .json({ error: "Almeno uno dei campi 'Utilizzabili' o 'Guasti' deve essere fornito." });
    }

    // Costruzione dinamica della query in base ai campi forniti
    let updates = [];
    let params = [];

    if (Utilizzabili !== undefined) {
        updates.push(`${colUtilizzabili} = ${colUtilizzabili} + ?`);
        params.push(Utilizzabili);
    }
    if (Guasti !== undefined) {
        updates.push(`${colGuasti} = ${colGuasti} + ?`);
        params.push(Guasti);
    }

    // Aggiunta delle chiavi primarie alla lista dei parametri
    params.push(MatricolaTecnico, Item);

    // Creazione della query
    const query = `UPDATE ${reltable} 
                   SET ${updates.join(", ")} 
                   WHERE ${pk1} = ? AND ${pk2} = ?`;

    connection.query(query, params, (err, results) => {
        if (err) {
            return res.status(500).json({
                error: "Errore durante l'aggiornamento.",
                details: err,
            });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "Relazione non trovata." });
        }

        res.status(200).json({ message: "Relazione aggiornata con successo." });
    });
}




function destroy(req, res) {
    const { [primaryKey1]: pk1, [primaryKey2]: pk2 } = req.params;

    connection.query(
        `DELETE FROM ?? WHERE ?? = ? AND ?? = ?`,
        [reltable, primaryKey1, pk1, primaryKey2, pk2],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
            if (results.affectedRows === 0) {
                return res.status(404).json({ error: "Relazione non trovata." });
            }
            res.status(200).json({ message: "Relazione eliminata con successo." });
        }
    );
}

module.exports = {
    index,
    store,
    update,
    destroy,
};
