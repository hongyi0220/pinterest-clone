const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
require('dotenv').config();
const dbUrl = process.env.MONGOLAB_URI;
const googleApiKey = process.env.GOOGLEAPIKEY;
const port = 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.dev.js');
const compiler = webpack(webpackConfig);
// const routes = require('./routes');

app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('build'));

app.get('/apikey', (req, res) => {
    res.send({apiKey: googleApiKey});
});

MongoClient.connect(dbUrl, (err, database) => {
    if (err) return console.log(err);

    app.use(session({
        store: new MongoStore({db: database}),
        secret: 'old-dudes-walker',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy'
    }));

    // routes(app, database);

    app.get('/user', (req, res) => {
        res.send(req.user);
    });

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build/index.html'))
    });

    http.listen(port);
});
