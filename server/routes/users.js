const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const ObjectId = require('mongo').ObjectId;
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
  const Users = db('pinterest-clone').collection('users');
  passport.use(new TwitterStrategy({
    consumerKey,
    consumerSecret,
    callbackURL: 'https://fierce-anchorage-98806.herokuapp.com/auth/twitter/callback',
  }, (token, tokenSecret, profile, done) => {
    Users.findOne({ email: profile.username })
      .then(user => {
        if (!user) {
          const newUser = {
            email: '',
            username: profile.username,
            password: '',
            'profileImg': '/images/default-profile-image.png',
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
    Users.findOne({ 'email': username, password })
      .then(user => {
        if (!user) {
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

  // Redirect the user to Twitter for authentication.  When complete, Twitter
  // will redirect the user back to the application at '/auth/twitter/callback'
  app.get('/auth/twitter', passport.authenticate('twitter'));

  // Twitter will redirect the user to this URL after approval.  Finish the
  // authentication process by attempting to obtain an access token.      If
  // access was granted, the user will be logged in.  Oth    erwise,
  // authentication has failed.
  app.get('/auth/twitter/callback', passport.authenticate('twitter', {
      successRedirect: '/home',
      failureRedirect: '/'
    })
  );

  app.get('/auth/:email', (req, res) => {
    const { email } = req.params;
    Users.findOne(
      { email },
      { email: 1, },
    )
      .then(user => {
        if (user) {
          res.send({ typeOfSubmitButton: 'login' });
        } else {
          res.send({ typeOfSubmitButton: 'signup' });
        }
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.post('/signup', (req, res) => {
    const { email, password } = req.body;
    let newUser = { // Create new user
      email,
      username: email.split('@')[0],
      password,
      profileImg: '/images/default-profile-image.png',
    };
    Users.insertOne(newUser)
      .then((result) => { //Sign user in
        if (result.insertedId) {
          newUser._id = result.insertedId;
          req.login(newUser, err => {
            if (err) {
              return res.status(500).json({
                err
              });
            }
            return res.redirect('/home');
          });
        }
      })
      .catch(err => console.log(err));
  });

  app.post('/auth', (req, res) => {
    // const { email, password } = req.body;

    passport.authenticate('local', (err, user, info) => {
      if (err) { return console.log(err); }
      if (!user) {
        res.redirect('/login-error');

      } else {
        req.login(user, err => {
          if (err) {
            return res.status(500).json({
              error: info
            });
          }
          return res.redirect('/home');
        });
      }
    })(req, res);
  });

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.put('/profile', (req, res) => {
    let { email, username, previewImg } = req.body;
    if (!email) {
      email = req.user.email;
    }
    if (!username) {
      username = req.user.username;
    }
    if (!previewImg) {
      previewImg = req.user.profileImg;
    }
    Users.updateOne(
      { username: req.user.username, password: req.user.password, },
      { $set: {
        email,
        username,
        profileImg: previewImg,
      }},
    )
      .then(() => res.end())
      .catch(err => console.log(err));

  });

  app.post('/profile-img', upload.single('imgFile'), (req, res) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' }, (err, result) => {
      if (err) console.log(err);
      res.status(201).json({ url:result.secure_url });
    }).end(req.file.buffer);
  });

  app.put('/password', (req, res) => {
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

  app.get('/user/:username', (req, res, next) => {
    const { externalapi, session, } = req.query;
    const username = req.params.username;
    if (username) {
      const pins = req.session.pins.filter(pin => pin.users.includes(username));

      Users.findOne(
        { username },
        { _id: 0, password: 0, email: 0, }
      )
        .then(otherUser => {
          if (!otherUser) {
            return res.send({ match: 0 });
          }
          if (session === 'false') {
            return res.send({ match: 1 });
          }
          otherUser.pins = pins;
          req.session.otherUser = otherUser;
          if (externalapi === 'false') {
            res.send(otherUser);
          } else {
            next();
          }
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      next();
    }
  });
};
