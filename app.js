const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const exjwt = require("express-jwt");
const morgan = require("morgan");
const User = require('./mongoose')

const app = express();
const jsonParser = express.json();

app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const jwtMW = exjwt({
    secret: "topsecretkey"
  });
 
mongoose.connect("mongodb://localhost:27017/document", { useNewUrlParser: true }, function(err){
    if(err) return console.log(err);
});

let server = app.listen(3000, function(){
    console.log("Сервер ожидает подключения...");
});

let io = require('socket.io').listen(server);
let connection = [];

io.sockets.on('connection', function(socket) {
    console.log('Успешное соединение');
    connection.push(socket);

    socket.on('disconnect',(data) => {
        connection.splice(connection.indexOf(socket), 1);
        console.log('Отключились')
    })
    socket.on('send mess', (data) => {
        console.log(data.message, data.id)
        if (data.id.length != 0) {
            User.findByIdAndUpdate(data.id, {messengerMessage: data.message}, function(err, user){
                if(err) return console.log(err);
            });
         }
        io.sockets.emit('add mess', {msg: data.message});
    })    
});

app.post("/editMssengerMessage", (req, res) => {
    const { id } = req.body;
    User.findByIdAndUpdate(id, {messengerMessage: ''}, {new: true}, function(err, user){
        if(err) return console.log(err);
    });
})

app.post("/login", (req, res) =>  {
    const { username, password } = req.body;
    User.find({login: username, password: password}, function(err, doc){     
        if(err) return console.log(err); 
        if(doc.length != 0) {      
            const token = jwt.sign(
                { login: username },
                "topsecretkey",
                { expiresIn: 129600 } 
            );
            res.json({
                error: null,
                status: doc[0].status,
                token
            }); 
            } else {
                res.status(401).json({
                    token: null,
                    error: "Введите правильные имя пользователя/пароль"
                });
            }
    });
});

app.get("/admin", jwtMW, (req, res) => {
    const { login } = req.user; 
    User.find({login: login}, function(err, doc){  
        if(err) return console.log(err); 
        if (doc.length != 0) {
            res.json({
                data: doc
            });
            } else {
                res.status(400).json({
                    error: "Не удалось получить информацию о пользователе"
                });  
            }
});
});

app.post("/edit", (req, res) => {
    const { id, username, lastname, age, email, company, phone} = req.body;
    User.findByIdAndUpdate(id, {name: username, lastname: lastname, age: age, email: email, 
        company: company, phone: phone}, {new: true}, function(err, user){
        if(err) return console.log(err);
    });
})

app.get("/employee", (req, res) => {
    User.find({}, function(err, doc){  
        if(err) return console.log(err); 
        if (doc.length != 0) {
            res.json({
                data: doc
            });
            } else {
                res.status(400).json({
                    error: "Не удалось загрузить соотрудников"
                });  
            }
});
});

app.post("/add", (req, res) => {
    const {username, lastname, age, email, company, phone, login, password, status} = req.body;
     const user = new User({
        login: login,
        password: password,
        name: username,
        lastname: lastname,
        email: email,
        company: company,
        phone: phone,
        age: age,
        task: '-',
        status: status
 });
    user.save(function(err){      
        if(err) return console.log(err);
    });
});

app.post("/delete", (req, res) => {
    const { id } = req.body;
    User.remove({_id:id}, function(err, doc){         
        if(err) return console.log(err);
    });
});

app.post("/addTask", (req, res) => {
    const {id, task} = req.body;
    console.log(id, task)
    User.findByIdAndUpdate(id, {task: task}, function(err, user){
        if(err) return console.log(err);
    });
})