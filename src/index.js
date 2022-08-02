const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const route = require('./routes/route');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer().any())

mongoose.connect('mongodb+srv://AshutoshGupta:ashutosh54264850@cluster0.ukus0.mongodb.net/group68Database', {useNewUrlParser: true})
.then( () => console.log('MongoDB is connected successfully.'))
.catch( (err) => console.log(err))

app.use('/', route);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function (){
  console.log('The application is running on PORT', PORT);
})