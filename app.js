const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
const Article = require('./models/article');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open', () =>{
    console.log('Connected MongoDb Successfully!!');
});
//check err
db.on('error', (err)=>{
    console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  // res.send('Hello World!!');
  /*   let articles = [
       {id: 1, title: 'This is firstOne', author: 'authorOne'},
       {id: 2, title: 'This is SecondOne', author: 'SecondOne'},
       {id: 3, title: 'This is ThirdOne', author: 'ThirdOne'},
       {id: 4, title: 'This is FourthOne', author: 'FourthOne'},
   ]; */
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});

app.get('/articles/add', (req, res) =>{
    res.render('add_articles',{
        title: 'Add Articles'
    });
 });

 // Add Submit POST Route
 app.post('/articles/add', (req, res) =>{
   let article = new Article();
   article.title = req.body.title;
   article.author = req.body.author;
   article.body = req.body.body;

   article.save((err) =>{
     if(err){
       console.log(err);
       return;
     }else{
       res.redirect('/');
     }
   });
  
 });


app.listen(3000, () => console.log('Server is running on port 3000....'));