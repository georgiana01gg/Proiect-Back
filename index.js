const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const messagesRouter = require('./router/messagesRouter');
const connection = require("./database.js");



const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/diary",messagesRouter);



const port = process.env.PORT || 8080;


app.listen(port, () => {
  console.log(`Cloud comp app listening on port ${port}!`)
});


