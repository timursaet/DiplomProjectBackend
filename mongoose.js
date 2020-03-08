const mongoose = require("mongoose");
const Schema = mongoose.Schema;
  
// установка схемы
const userScheme = new Schema({
    login: String,
    password: String,
    name: String,
    lastname: String,
    email: String,
    company: String,
    phone: String,
    age: Number,
    task: String, 
    status: String,
    messengerMessage: String,
},
{
    versionKey: false
});
  
// подключение
//mongoose.connect("mongodb://localhost:27017/document", { useNewUrlParser: true });

const User = mongoose.model("User", userScheme);
module.exports = User;
//  const user = new User({
//     login: "timursaet",
//     password: "11224433",
//     name: "Тимур",
//     lastname: "Саетгареев",
//     email: "s.timursaet@yandex.ru",
//     company: "Bashkir state university",
//     phone: "8-937-158-05-08",
//     age: 22,
//     task: '-',
//     status: "manager",
//     messengerMessage: ""   
//  });

//  const user = new User({
//     login: "ilshat",
//     password: "123",
//     name: "Ильшат",
//     lastname: "Хисамов",
//     email: "khisamov98@inbox.ru",
//     company: "BSU",
//     phone: "8-952-688-597",
//     age: 22,
//     task: '-',
//     status: "employee",
//     messengerMessage: ""   
//  });

// user.save(function(err){
//     mongoose.disconnect();  // отключение от базы данных
      
//     if(err) return console.log(err);
//     console.log("Сохранен объект", user);
// });

// User.remove({}, function(err, doc){
//     mongoose.disconnect();
     
//     if(err) return console.log(err);
     
//     console.log("Удален пользователь ", doc);
// });

// User.find({/*login: "timursaet", password: "11224433"*/}, function(err, docs){
//     mongoose.disconnect();
     
//     if(err) return console.log(err);
     
//     console.log(docs);
// });

// User.findByIdAndUpdate(id, {name: username, lastname: lastname, age: age, email: email, 
//     company: company, phone: phone}, {new: true}, function(err, user){
//     if(err) return console.log(err);
// });