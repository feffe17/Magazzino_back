-- -- ctrl + alt + e to exec your query

-- -- CREATE DATABASE
-- CREATE DATABASE "magazzinoprova";

-- -- CREATE TABLES
-- USE "magazzinoprova";

-- CREATE TABLE tecnici (
--     Matricola VARCHAR(20) NOT NULL,
--     Nome VARCHAR(50),
--     Cognome VARCHAR(50),
--     PRIMARY KEY (Matricola)
-- );

-- CREATE TABLE materiale (
--     Item VARCHAR(50) NOT NULL,
--     NomeOggetto VARCHAR(100),
--     PRIMARY KEY (Item)
-- );

-- -- CREATE RELATIONSHIP TABLE
-- CREATE TABLE tecnici_materiali (
--     MatricolaTecnico VARCHAR(20) NOT NULL,
--     Item VARCHAR(50) NOT NULL,
--     Utilizzabili INT DEFAULT 0,
--     Guasti INT DEFAULT 0,
--     PRIMARY KEY (MatricolaTecnico, Item),
--     FOREIGN KEY (MatricolaTecnico) REFERENCES tecnici(Matricola)
--         ON DELETE CASCADE ON UPDATE CASCADE,
--     FOREIGN KEY (Item) REFERENCES materiale(Item)
--         ON DELETE CASCADE ON UPDATE CASCADE
-- );


-- -- ADD NEW ITEM
-- INSERT INTO materiale (Item, NomeOggetto) 
-- VALUES ('F250', 'Shock Sensor')

-- -- ADD NEW TECHNICIAN
-- INSERT INTO tecnici (Matricola, Nome, Cognome)
-- VALUES ('Q06604', 'Alessio', 'Monti');

-- -- ASIGN ITEM TO TECHNICIAN
-- INSERT INTO tecnici_materiali (MatricolaTecnico, Item, Utilizzabili, Guasti)
-- VALUES ('Q06604', 'F250', 40, 0);

-- -- UPDATE ITEM QUANTITY
-- UPDATE tecnici_materiali
-- SET Guasti = +8
-- WHERE MatricolaTecnico = 'Q06604' AND Item = 'F250';