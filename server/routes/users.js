const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongodb').ObjectId;
const TwitterStrategy = require('passport-twitter').Strategy;
const consumerKey = process.env.TWITTER_CONSUMER_KEY;
const consumerSecret = process.env.TWITTER_CONSUMER_SECRET;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('cloudinary');

cloudinary.config({
    cloud_name: 'fluffycloud',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

module.exports = (app, db) => {
    const Users = db.collection('users');

    passport.use(new TwitterStrategy({
            consumerKey,
            consumerSecret,
            callbackURL: 'http://localhost:3000/auth/twitter/callback'
        },
        (token, tokenSecret, profile, done) => {
            // const strProfile = JSON.stringify(profile);
            // console.log(`profile: ${strProfile}`);
            Users.findOne({ email: profile.username })
            .then(user => {
                if (!user) {
                    const newUser = {
                        email: 'n/a',
                        username: profile.username,
                        passpord: 'n/a',
                        "profileImg": "./images/default-profile-image.png",
                        pins: []
                    };
                    Users.insertOne(newUser);
                    return done(null, newUser);
                }
                done(null, user);
            })
            .catch(err => {
                console.log(err);
                done(err);
            });
        }
    ));

    // Configure passportJs login strategy
    passport.use(new LocalStrategy({
            usernameField: 'email'
        },
        (username, password, done) => {
            Users.findOne({ 'email': username })
            .then(user => {
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
        console.log('SERIALIZING USER');
        done(null, user._id);
    });

    // This retrieves user info from database using user._id set in session
    //and store it in req.user because it is more secure
    passport.deserializeUser((id, done) => {
        console.log('DESERIALIZING USER');

        Users.findOne({'_id': new ObjectId(id)}, (err, user) => {
            delete user._id;
            done(err, user);
        });
    });

    app.use(passport.initialize());
    app.use(passport.session());

    // Redirect the user to Twitter for authentication.  When complete, Twitter
    // will redirect the user back to the application at
    //   /auth/twitter/callback
    app.get('/auth/twitter', passport.authenticate('twitter'));


    // Twitter will redirect the user to this URL after approval.  Finish the
    // authentication process by attempting to obtain an access token.      If
    // access was granted, the user will be logged in.  Oth    erwise,
    // authentication has failed.
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/',
            failureRedirect: '/'
        }
    ));

    app.post('/auth', (req, res) => {
        const { email, password } = req.body;
        passport.authenticate('local', (err, user, info) => {
           if (err) { return console.log(err); }
           if (!user) {
               Users.insertOne({
                   email,
                   username: email.split('@')[0],
                   password,
                   "profileImg": "./images/default-profile-image.png",
                   pins: [],

               })
               .then(() => { //Sign user in
                    Users.findOne({ email })
                    .then(user => {
                        req.login(user, err => {
                            if (err) {
                                return res.status(500).json({
                                    error: info
                                });
                            }
                            return res.redirect('/');
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
                   return res.redirect('/');
               });
           }
         })(req, res);
    });

    app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.put('/profile', (req, res) => {
        console.log('/profile reached!');
        const { email, username, uploadedImg } = req.body;
        console.log('req.body:',req.body);
        console.log('email, username, uploadedImg:',email, username, uploadedImg);


        Users.updateOne(
            { username: req.user.username },
            { $set: {
                email,
                username,
                profileImg: uploadedImg
            }}
        )
        .catch(err => console.log(err));
    });

    app.post('/profile-img', upload.single('imgFile'), (req, res) => {
        cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' }, (err, result) => {
            if (err) console.log(err);
            console.log('result:', result);
            console.log('result.secure_url:',result.secure_url);
            res.status(201).json({url:result.secure_url});
        }).end(req.file.buffer);
    });

    app.put('/password', (req, res) => {
        const { oldPassword, newPassword } = req.body;
        console.log('oldPassword, newPassword:', oldPassword, newPassword);
        console.log('req.user.username:',req.user.username);
        Users.updateOne(
            {
                username: req.user.username,
                password: req.body.oldPassword
            },
            {
                $set: {
                    password: req.body.newPassword
                }
            }
        )
        .then(response => {
            const { matchedCount, modifiedCount } = response;
            res.send({
                matchedCount,
                modifiedCount
            });
        })
        .catch(err => console.log(err));
    });
}
