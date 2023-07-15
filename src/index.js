const express = require('express');

const route = require('./routes/routes.js');
const mongoose  = require('mongoose');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://localhost:27017/book-code", {
    useNewUrlParser: true
})
.then( () => console.log("MongoDb is connected"))
.catch ( err => console.log(err) )



app.use('/', route);

app.use('/*', function (req, res) {
    return res.status(400).send({ status: false, msg: 'Page Not Found' })
 })

app.listen(3000, function () {
    console.log('Express app running on port ' +3000)
});