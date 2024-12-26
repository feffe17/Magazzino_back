const connection = require("../db/db");

function index(req, res) {
    connection.query(
        `SELECT r.MatricolaTecnico, r.Item, r.Utilizzabili, r.Guasti, 
                t.Nome AS NomeTecnico, t.Cognome AS CognomeTecnico, 
                m.NomeOggetto 
         FROM tecnici_materiali r
         JOIN tecnici t ON r.MatricolaTecnico = t.Matricola
         JOIN materiale m ON r.Item = m.Item`,
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero delle relazioni.", details: err });
            res.json(results);
        }
    );
}

function store(req, res) {
    const { MatricolaTecnico, Item, Utilizzabili = 0, Guasti = 0 } = req.body;

    if (!MatricolaTecnico || !Item) {
        return res.status(400).json({ error: "I campi 'MatricolaTecnico' e 'Item' sono obbligatori." });
    }

    connection.query(
        "INSERT INTO tecnici_materiali (MatricolaTecnico, Item, Utilizzabili, Guasti) VALUES (?, ?, ?, ?)",
        [MatricolaTecnico, Item, Utilizzabili, Guasti],
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
    const { MatricolaTecnico, Item } = req.params;
    const { Utilizzabili, Guasti } = req.body;

    // Controllo che almeno uno dei due campi sia definito
    if (Utilizzabili === undefined && Guasti === undefined) {
        return res.status(400).json({ error: "Almeno uno dei campi 'Utilizzabili' o 'Guasti' deve essere fornito." });
    }

    // Costruzione dinamica della query in base ai campi forniti
    let updates = [];
    let params = [];

    if (Utilizzabili !== undefined) {
        updates.push("Utilizzabili = Utilizzabili + ?");
        params.push(Utilizzabili);
    }
    if (Guasti !== undefined) {
        updates.push("Guasti = Guasti + ?");
        params.push(Guasti);
    }

    params.push(MatricolaTecnico, Item);

    connection.query(`UPDATE tecnici_materiali SET ${updates.join(", ")} WHERE MatricolaTecnico = ? AND Item = ?`, params, (err, results) => {
        if (err) return res.status(500).json({ error: "Errore durante l'aggiornamento.", details: err });
        if (results.affectedRows === 0) return res.status(404).json({ error: "Relazione non trovata." });
        res.status(200).json({ message: "Relazione aggiornata con successo." });
    });
}


function destroy(req, res) {
    const { MatricolaTecnico, Item } = req.params;

    connection.query(
        "DELETE FROM tecnici_materiali WHERE MatricolaTecnico = ? AND Item = ?",
        [MatricolaTecnico, Item],
        (err, results) => {
            if (err) return res.status(500).json({ error: "Errore durante l'eliminazione.", details: err });
            if (results.affectedRows === 0) return res.status(404).json({ error: "Relazione non trovata." });
            res.status(200).json({ message: "Relazione eliminata con successo." });
        }
    );
}

module.exports = {
    index,
    store,
    update,
    destroy
};
