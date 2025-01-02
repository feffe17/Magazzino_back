const express = require('express');
const app = express();

require('dotenv').config();
const cors = require('cors')
const router = require("./routes/routes")
const loginRouter = require("./routes/authRoute")
const mid = require("./middleware/mid")

const host = process.env.HOST
const port = process.env.PORT





app.use(cors())
app.use(express.json())

app.use('/login', loginRouter)

app.get('/', [mid.checkAuth], (req, res) => {
    res.send(`Server is up and running!`);
})

app.use('/', [mid.checkAuth], router)



app.listen(port, () => {
    console.log(`Server in ascolto a http://${host}:${port}`);
})