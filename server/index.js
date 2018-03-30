const path = require('path')
    ,express = require('express')
    ,app = express()
    ,http = require('http').Server(app)
    ,mongo = require('mongodb')
    ,MongoClient = mongo.MongoClient
    require('dotenv').config()
    ,dbUrl = process.env.MONGOLAB_URI
    ,googleApiKey = process.env.GOOGLE_API_KEY
    ,cseId = process.env.CSE_ID
    ,port = 3000
    ,session = require('express-session')
    ,bodyParser = require('body-parser')
    ,MongoStore = require('connect-mongo')(session)
    ,webpack = require('webpack')
    ,webpackConfig = require('../webpack/webpack.dev.js')
    ,compiler = webpack(webpackConfig)
console.log('server loaded');

app.use(require('webpack-dev-middleware')(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
app.use(require("webpack-hot-middleware")(compiler));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('build'));

app.get('/env_keys', (req, res) => {
    res.send({
        googleApiKey,
        cseId
    });
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

    require('./routes')(app, database);

    app.get('/user_session', (req, res) => {
        console.log('req._passport.session:',req._passport.session);
        console.log('/user_session route');
        console.log('req.user:',req.user);
        console.log('req.isAuthenticated():',req.isAuthenticated());
        res.send(req.user);
    });

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../build/index.html'))
    });

    http.listen(port, () => console.log(`Connected to port ${port}`));
});
