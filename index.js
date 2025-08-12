const express = require('express');
const app = express();
const getRouter = require('./routes/getRouter');
const postRouter = require('./routes/postRouter');

// app.use(express.static('js'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

app.use("/", getRouter);
app.use("/validate", postRouter);

app.listen(3000, function(req, res){
    console.log("Listening at port 3000");
});