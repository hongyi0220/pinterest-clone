const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
require('dotenv').config();
const dbUrl = process.env.MONGOLAB_URI;
// const apiKey = process.env.API_KEY
const port = 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const webpack = require('webpack');
const webpackConfig = require('../webpack/webpack.dev.js');
const compiler = webpack(webpackConfig);
console.log('server loading');

app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('build'));

// app.get('/api_key', (req, res) => {
//     res.send(apiKey);
// });

MongoClient.connect(dbUrl, (err, database) => {
    if (err) return console.log(err);

    app.use(session({
        store: new MongoStore({db: database}),
        secret: 'old-dudes-walker',
        resave: false,
        saveUninitialized: false,
        unset: 'destroy'
    }));

    require('./routes')(app, database);

    app.get('/user_session', (req, res) => {
        console.log('req._passport.session:',req._passport.session);
        console.log('/user_session route');
        console.log('req.user:',req.user);
        console.log('req.isAuthenticated():',req.isAuthenticated());
        console.log('req.session:', req.session);
        res.send(req.user);
    });

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build/index.html'))
    });

    http.listen(port, () => console.log(`Connected to port ${port}`));
});
