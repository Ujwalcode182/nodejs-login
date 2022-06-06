const express = require("express");
const bodyParser =require("body-parser");
const path = require("path");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const mongoose = require("mongoose");
const routes = require("./routes/routes.js");
const User =require('./models/user')
require('dotenv').config()

const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static( path.join(process.cwd(),"public")));
app.set("view engine", "ejs");
app.set("views", "views");


const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    collection: "mySessions",
});
store.on("error", function (error) {
    console.log(error);
});
app.use(
    session({
        secret: "this is key",
        reSave: false,
        saveUninitialized: false,
        store: store,
    })
);

app.use(routes);
app.get('/users', paginatedResults(User), (req, res) => {
    res.json(res.paginatedResults)
  })
  
  function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
  
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }






mongoose
    .connect(process.env.MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`listening on port ${PORT}`);
        });
    })
    .catch((err) => console.error(err.message));