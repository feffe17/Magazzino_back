const express = require('express');
const app = express();
const host = process.env.HOST
const port = process.env.PORT
const cors = require('cors')
const router = require("./routes/routes")

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.send(`Server is up and running!`);
})


app.use('/', router)



app.listen(port, () => {
    console.log(`Server in ascolto a http://${host}:${port}`);
})