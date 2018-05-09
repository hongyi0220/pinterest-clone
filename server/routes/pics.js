const apiKey = process.env.PIXABAY_API_KEY;
const fetch = require('node-fetch');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('cloudinary');
const ObjectId = require('mongodb').ObjectId;

module.exports = (app, db) => {
  const Users = db.collection('users');
  const Pins = db.collection('pins');
  app.get('/pics', (req, res) => { // search pics
    console.log('/images route reached!');
    console.log('session.id:', req.session.id);
    let { page, q } = req.query;
    page = +page;
    const url = `https://pixabay.com/api?key=${apiKey}&q=${q}&safesearch=true&page=${page}`;
    console.log(url);

    fetch(url)
      .then(res => res.json())
      .then(resJson => resJson.hits.map(hit => ({
        src: hit.webformatURL,
        tags: hit.tags.split(' ') })
      ))
      .then(imgs => {
        console.log('req.session:', req.session);
        if (page === 1) {
          req.session.page = page;
          req.session.imgs = imgs;
        } else {
          req.session.page ? req.session.page++ : req.session.page = page;
          req.session.imgs = [...req.session.imgs, ...imgs];
        }
        console.log('req.session2:', req.session);
        res.send(imgs);
      })
      .catch(err => console.log(err));
  });

  app.route('/pic') // from drag & drop
  .post(upload.single('imgFile'), (req, res) => {
    let { tags } = req.body;
    tags = tags.split(',');
    cloudinary.v2.uploader.upload_stream({ resource_type: 'raw'}, (err, result) => {
      if (err) { console.log(err); }
      Users.updateOne(
        { username: req.user.username },
        {
          $push: {
            pins: {
              src: result.secure_url,
              tags
            }
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
    }).end(req.file.buffer);

  })
  .put((req, res) => { // save from site URL
    console.log('PUT /pic reached');
    const { pic } = req.body;
    console.log('pic:', pic);
    Users.updateOne(
      { username: req.user.username },
      {
        $push: { pins: pic }
      }
    )
    .then(response => {
      const { matchedCount, modifiedCount } = response;
      res.send({
        matchedCount,
        modifiedCount
      });
    })
    .catch(err => res.status(500).json({ err }));
  });

  app.route('/pin')
    .put((req, res) => { // save pic as Pin
      console.log('GET pin reached!');
      // console.log('session.id:', req.session.id);
      // console.log('req._passport.session:',req._passport.session);
      // console.log('req.user:',req.user);
      // console.log('req.isAuthenticated():',req.isAuthenticated());
      // console.log('req.session:', req.session);
      const pindex = req.query.pindex;
      console.log(pindex);
      const cloudinaryUploadFolderName = 'saved_images';
      const resourceName = req.session.imgs[pindex].src.split('get/')[1];
      const cloudinaryUploadPath = `https://res.cloudinary.com/fluffycloud/image/upload/${cloudinaryUploadFolderName}/`;
      console.log(`${cloudinaryUploadFolderName}/${resourceName}`);
      cloudinary.image(`${cloudinaryUploadFolderName}/${resourceName}`);

      Users.updateOne(
        { email: req.user.email },
        {
          $push: { pins:
            {
              src: cloudinaryUploadPath + resourceName,
              tags: req.session.imgs[pindex].tags
            }
          }
        }
      )
      .catch(err => console.log(err));
      res.end();

    })
    .delete((req, res) => { // delete a Pin
      console.log('DELETE pin reached!');

      const pindex = req.query.pindex;
      console.log(`pindex: ${pindex}`);

      Users.updateOne(
        { email: req.user.email },
        {
          $unset: { [`pins.${pindex}`]: 1 }
        }
      )
      .then(() => Users.updateOne({ email: req.user.email }, { $pull: {pins: null}}))
      .catch(err => console.log(err));
      res.end();
    })
    .post((req, res) => { // share, save a Pin on pin-page or comment on a Pin
      console.log('POST /pin route reached!!');
      let { pin } = req.body;
      const shouldSave = req.query.save === 'true' ? true : false;
      pin.comments = [];
      Pins.update(
        {
          src: pin.src,
        },
        {
          $set: {
            comments: pin.comments,
          }
        },
        { upsert: true }
      )
        .then(() => {
          if (shouldSave) {
            Users.updateOne(
              { username: req.user.username },
              {
                $push: {
                  pins: pin
                }
              },
            )
              .then(() => res.end());
          } else {
            res.end();
          }
        })
        .catch(err => console.log(err));
    });

  app.route('/pins')
  .get((req, res) => { // get all Pins from all users
    console.log('GET /pins reached');
    Users.find({
      'pins': {
        $gte: {
          $size: 1
        }
      }
    }, {
      _id: 0,
      email: 0,
      password: 0,
    })
    .toArray((err, docs) => {
      if (err) { console.log(err); }
      console.log('DOCS:', docs);
      res.send(docs);

    });
  });

  app.route('/pin/:id')
    .get((req, res) => {
      const id = req.params.id;
      console.log(`route /pin/:id (${id}) reached `);
      Pins.findOne(
        {
          '_id': new ObjectId(id),
        }
      )
        .then(pin => res.send(pin))
        .catch(err => console.log(err));
    });

};
