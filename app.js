const express = require('express');
const app = express();
const host = process.env.HOST
const port = process.env.PORT
const cors = require('cors')

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send(`Server is up and running!`);
})

app.listen(port, () => {
    console.log(`Server in ascolto a http://${host}:${port}`);
})