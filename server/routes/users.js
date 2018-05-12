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
  }, (token, tokenSecret, profile, done) => {
    // const strProfile = JSON.stringify(profile);
    // console.log(`profile: ${strProfile}`);
    Users.findOne({ email: profile.username })
      .then(user => {
        if (!user) {
          const newUser = {
            email: 'n/a',
            username: profile.username,
            password: 'n/a',
            'profileImg': './images/default-profile-image.png',
            pins: [],
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
    successRedirect: '/home',
    failureRedirect: '/'
  }
  ));

  app.post('/auth', (req, res) => {
    const { email, password } = req.body;
    passport.authenticate('local', (err, user, info) => {
      if (err) { return console.log(err); }
      if (!user) {

        Users.insertOne({ // Create new user
          email,
          username: email.split('@')[0],
          password,
          profileImg: './images/default-profile-image.png',
          pins: [],
          // favs: []
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
                return res.redirect('/home');
              });
            });
        }).catch(err => console.log(err));
      } else {
        console.log('recovered session, logging user in');
        req.login(user, err => {
          if (err) {
            return res.status(500).json({
              error: info
            });
          }
          console.log('no err, redirect to /home');
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
    console.log('/profile reached!');
    let { email, username, previewImg } = req.body;
    console.log('req.body:',req.body);
    console.log('email, username, uploadedImg:',email, username, previewImg);
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
      { username: req.user.username },
      { $set: {
        email,
        username,
        profileImg: previewImg,
      }}
    )
      .then(() => res.end())
      .catch(err => console.log(err));

  });

  app.post('/profile-img', upload.single('imgFile'), (req, res) => {
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw' }, (err, result) => {
      if (err) console.log(err);
      console.log('result:', result);
      console.log('result.secure_url:',result.secure_url);
      res.status(201).json({ url:result.secure_url });
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

  // app.get('/user', (req, res) => {
  //   console.log('/user reached!');
  //   const { username } = req.query;
  // })

  app.get('/user/:username', (req, res, next) => {
    console.log('/user/:username reached!!');
    // console.log('/user/* reached! req.url:', req.url);
    // console.log('/user/* reached! req.url.split:', req.url.split('/'));
    //
    // const username = req.url.split('/')[2];
    const { externalapi } = req.query;
    const username = req.params.username;

    if (username) {
      console.log('req.params at /user/:username :', username);
      Users.findOne(
        { username },
        { _id: 0, password: 0, email: 0, }
      )
        .then(user => {
          console.log('user @ /user/:username:', user);
          if (externalapi === 'false') {
            req.session.otherUser = user;
            res.send(user);
          } else {
            req.session.otherUser = user;
            next();
          }
        })
        .catch(err => console.log(err));
    } else {
      console.log('!username; next()');
      next();
    }

  });

};
