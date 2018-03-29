const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectId;

module.exports = function(app, db) {
    const Users = db.collection('users');

    // Configure passportJs login strategy
    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        function(username, password, done) {
            console.log('username, password at localStrategy cb:',username, password);
            Users.findOne({ 'email': username }, (err, user) => {
                console.log('err at passport strategy cb:', err);
                console.log('user at passport strategy cb:', user);
                if (err) {
                    return done(err);
                }
                if (!user || user.password !== password) {
                    console.log('!user');
                    return done(null, false);
                }
                console.log('user found0');
                return done(null, user);
            });
        }
    ));

    // This stores user in session after authentication
    passport.serializeUser(function(user, done) {
        console.log('Serializing user');
        console.log('user at serialize user:', user);
        done(null, user._id);
    });

    // This retrieves user info from database using user._id set in session
    //and store it in req.user because it is more secure
    passport.deserializeUser(function(id, done) {
        console.log('Deserializing user');
        console.log('id at deserialize user:', id);
        Users.findOne({_id: new ObjectId(id)}, (err, user) => {
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    app.post('/auth', (req, res) => {
        const { email, password } = req.body;
        console.log(`route /auth reached; email: ${email}, password: ${password}`);
        // Check if the email is already taken

        passport.authenticate('local', function(err, user, info) {
           if (err) { return console.log(err); }
           if (!user) {
               console.log('user matching email and password not found');

               Users.insertOne({ email, password })
               .then(() => { //Sign user in
                   console.log('created user in database');
                   Users.findOne({ email }, function(err, user) {
                       if (err) return console.log(err);
                       console.log('logging in user after account creation');
                       req.login(user, err => {
                           if (err) {
                               return res.status(500).json({
                                   error: info
                               });
                           }
                           res.send(user);
                       });
                   });
               });
           } else {
               console.log('user found');
               console.log('logging in user');
               req.login(user, err => {
                   if (err) {
                       return res.status(500).json({
                           error: info
                       });
                   }
                   res.send(user);
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
