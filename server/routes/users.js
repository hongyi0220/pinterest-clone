const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectId;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = function(app, db) {
    const Users = db.collection('users');

    // Configure passportJs login strategy
    passport.use(new LocalStrategy(
        function(username, password, done) {
            Users.findOne({ username: username }, function(err, user) {
                if (err) return done(err);
                if (!user) return done(null, false, {message: 'Incorrect username.'});
                if (user.password !== password) return done(null, false, {message: 'Incorrect password'});
                return done(null, user);
            });
        }
    ));

    // This stores user in session after authentication
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    // This retrieves user info from database using user._id set in session
    //and store it in req.user because it is more secure
    passport.deserializeUser(function(id, done) {
        Users.findOne({_id: new ObjectId(id)}, function(err, user) {
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/login',
        function(req, res) {
            passport.authenticate('local', function(err, user, info) {
                if (err) return console.log(err);
                if (!user) return res.redirect('/login/error');
                req.login(user, function(err) {
                    if (err) return console.log(err);
                    return res.redirect('/' + user.username);
                });
                res.end();
            })(req, res);
    });

    app.post('/signup', (req, res) => {
        console.log(`req.body: ${req.body}`);
        const email = req.body.email;
        const password = req.body.password;
        console.log(`route /signup reached; email: ${email}, password: ${password}`);
        // Check if the email is already taken
        Users.findOne({ email, password }, function(err, user) {
            if (err) console.log(err);
            if (user) { //Sign user in
                req.login(user, err => {
                    if (err) {
                        return res.status(500).json({
                            error: 'Could not login user'
                        });
                        res.end();
                    }
                })
            } else {
                const user = {
                    email,
                    password
                };
                Users.insertOne(user)
                .then(() => { //Sign user in
                    Users.findOne({email}, function(err, user) {
                        if (err) return loglog(err);
                        req.login(user, err => {
                            if (err) return res.status(500).json({
                                error: 'Could not login user'
                            });
                            res.end();
                        });
                    });
                });
            }
        });
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.end();
    });

    app.post('/profile', (req, res) => {
        const username = req.body.username || req.user.username;
        const password = req.body.password || req.user.password;
        const location = req.body.location || req.user.location;
        const id = req.body.id;

        Users.updateOne(
            { _id: ObjectId(id) },
            { $set: {
                username: username,
                password: password,
                location: location
            }}
        );
        res.redirect('/profile/updated');
    });
}
