require('dotenv').config()
const express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;
const morgan = require('morgan');
const mainRoutes = require('./src/routes/main.route');

app.use(express.json());
app.use(morgan('dev'));
app.use('/', mainRoutes);

const server = app.listen(port, function () {
    let port = server.address().port;
    console.log('Online server at: '+port);
});



