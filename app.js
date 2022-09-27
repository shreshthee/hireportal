require('dotenv').config();
const cookieParser = require('cookie-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.connect(
process.env.MONGO_URL
, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName:process.env.DB_NAME
});
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.error("database connected"));

const app = express();
app.use(require('morgan')('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser())
app.set('view engine', 'ejs');

app.use('/student',require('./routes/students'))

app.use('/admin',require('./routes/admin'))

//errors
app.use((err, req, res, next) => {
  console.log(err.message);
    res.status(500).send('500 - Something was error!');
});
app.use((req, res, next) => {
    res.status(404).send('404 - Not Found!');
});

const port = process.env.PORT
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});