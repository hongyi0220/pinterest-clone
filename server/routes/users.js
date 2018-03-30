const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectId;

module.exports = (app, db) => {
    const Users = db.collection('users');

    // Configure passportJs login strategy
    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        (username, password, done) => {
            Users.findOne({ 'email': username })
            .then(() => {
                if (!user || user.password !== password) {
                    console.log('!user');
                    return done(null, false);
                }
                return done(null, user);
            })
            .catch(err => done(err));
        }
    ));

    // This stores user in session after authentication
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    // This retrieves user info from database using user._id set in session
    //and store it in req.user because it is more secure
    passport.deserializeUser((id, done) => {
        Users.findOne({'_id': new ObjectId(id)}, (err, user) => {
            delete user._id;
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/auth', (req, res) => {
        const { email, password } = req.body;
        passport.authenticate('local', (err, user, info) => {
           if (err) { return console.log(err); }
           if (!user) {
               Users.insertOne({ email, password })
               .then(() => { //Sign user in
                    Users.findOne({ email })
                    .then(user => {
                        req.login(user, err => {
                            if (err) {
                                return res.status(500).json({
                                    error: info
                                });
                            }
                            return res.end();
                        });
                    })
                    .catch(err => console.log(err))
               });
           } else {
               req.login(user, err => {
                   if (err) {
                       return res.status(500).json({
                           error: info
                       });
                   }
                   return res.end();
               });
           }
         })(req, res);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.end();
    });

    app.post('/profile', (req, res) => {
        const { username, password, location, id } = req.body;

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
