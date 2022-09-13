'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const app = express();
const serverHttp = require('http').Server(app);
const io= require('socket.io')(serverHttp, {
    cors: {
      origin: "https://app-medica-oss.herokuapp.com/",
      methods: ["GET", "POST"]
    }
  });

app.use(cors());
app.use(express.urlencoded({ extended: false }));
const fecha = Date.now();
const storage = multer.diskStorage({
    destination: path.join(__dirname, '/public/uploads'),
    filename: (req, files, cb) => {
        cb(null,files.originalname);
    }
})
app.use(multer({ storage }).array('images'));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/", require("./Routes/routes"));

const mensajes=[]

io.on('connection', function(socket){
    socket.on('send-message', (data) =>{
        console.log(socket.username + ": " + data.text);
        mensajes.push(data);
        socket.emit('leer', mensajes);
        socket.broadcast.emit('leer', mensajes);
    })

    socket.emit('leer', mensajes);
    socket.broadcast.emit('leer', mensajes);

    socket.on("set username", (username) => {
        socket.username = username;
    });
})

const puerto = process.env.PORT ? process.env.PORT : 8080;
serverHttp.listen(puerto);

console.log("http://localhost:" + puerto);

