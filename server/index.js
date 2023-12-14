const path = require('path');
const { createServer } = require('http');
require("dotenv").config();
const cors = require('cors');   // Cross-Origin Resource Sharing (Condivisione delle Risorse tra Origini Diverse).
const mongoose = require('mongoose');   //interfacciamento con il database
const authRoutes = require('./routes/auth');   
const exp = require('constants');

//nodemon -r esm index.js
//sostituire nel file  .json

const express = require('express');
const { getIO, initIO,chatRooms } = require('./socket');

const morgan = require("morgan")

const app = express();

mongoose
.connect(process.env.DATABASE)
.then(() => console.log("DB connected"))
.catch((err) => console.log("DB CONNECTION ERROR: ", err));



app.use('/', express.static(path.join(__dirname, 'static')));
app.use(express.json());    //analizzo le richieste alle api in formato JSON
app.use(express.urlencoded({ extended:true}));  //richieste di tipo form HTML
app.use(cors());         //abilito a domini diversi di accedere alle risorse provenienti da diversi domini
app.use(morgan("dev"));      //registra i dettagli delle richieste in arrivo come URL, metodo HTTP ecc...
app.use("/api",authRoutes);
app.get('/apiChat', (req, res) => {
    res.json(chatRooms);
  });
  


const httpServer = createServer(app);

let port = process.env.PORT || 3500;

initIO(httpServer);

//mettiamo il server creato in ascolto sulla porta data.
httpServer.listen(port)
console.log("Server started on ", port);

getIO();