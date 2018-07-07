const apiKey = process.env.PIXABAY_API_KEY;
const fetch = require('node-fetch');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('cloudinary');
const ObjectId = require('mongodb').ObjectId;

module.exports = (app, db) => {
  const Pins = db.collection('pins');
  const uploadPixabayImgToCloudinary = img => {
      const cloudinaryUploadFolderName = 'saved_images';
      const resourceName = img.src.split('get/')[1];
      cloudinary.image(`${cloudinaryUploadFolderName}/${resourceName}`);

      const uploadedResourceLocationOnCloudinary = `https://res.cloudinary.com/fluffycloud/image/upload/${cloudinaryUploadFolderName}/${resourceName}`;
      return uploadedResourceLocationOnCloudinary;
  };

  const beautifyTags = tags => {
    const result = tags.map(tag => tag.toString().trim().toLowerCase().replace(',', '').replace(/[-_]/g, ' ')).sort();
    return result;
  };

  app.get('/pics', (req, res) => { // search pics
    let { page, q } = req.query;
    q = q.split('&&');
    page = +page;


    const removeDuplicates = items => {
      let len = items.length; // eslint-disable-line no-unused-vars
      for (let i = 0; i < items.length; i++ ) {
          if ([...items.slice(0, i), ...items.slice(i + 1)].includes(items[i])) {
              items.splice(i, 1);
              i--;
              len--;
          }
          continue;
      }
      return items;
    };

    const stack = [];
    q.forEach(query => {
      const url = `https://pixabay.com/api?key=${apiKey}&q=${query}&safesearch=true&page=${page}`;
      stack.push(new Promise((resolve, reject) => {
        fetch(url)
          .then(res => {
            if (res.status <= 300) {
              return res.json();
            } else {
              resolve([]);
            }
          })
          .then(resJson =>
            resolve(resJson.hits.map(hit => ({
              src: hit.webformatURL,
              tags: beautifyTags(removeDuplicates(hit.tags.split(' '))),
              comments: [],
              users: [],
              height: hit.webformatHeight,
            }))
          ))
          .catch(err => reject(err));
      }));
    });

    Promise.all(stack)
      .then(values => {
        const imgs = values.reduce((curr, next) => [...curr, ...next], []);
        if (page === 1) {
          req.session.imgs = imgs;
        } else {

          req.session.imgs = req.session.imgs ? [...req.session.imgs, ...imgs] : imgs;
        }
        req.session.page = page;
        res.send(req.session.imgs);
      })
      .catch(err => console.log(err));
  });

  app.route('/pic') // From drag & drop pic
    .post(upload.single('imgFile'), (req, res) => {
      let { tags, height } = req.body;
      tags = beautifyTags(tags.split(','));
      cloudinary.v2.uploader.upload_stream({ resource_type: 'raw'}, (err, result) => {
        if (err) { console.log(err); }
        const pic = {
          src: result.secure_url,
          tags,
          comments: [],
          users: [req.user.username],
          height,
        };
        Pins.insertOne(
         pic,
        )
          .then(response => {
            const { insertedId } = response;
            res.send({ insertedId });
          })
          .catch(err => console.log(err));
      }).end(req.file.buffer);

    })
    .put((req, res) => { // Save pic from site URL
      const { pic } = req.body;
      Pins.insertOne(
       pic,
      )
        .then(response => {
          const { insertedId } = response;
          res.send({ insertedId });
        })
        .catch(err => console.log(err));
    });

  app.route('/pin')
    .get((req, res) => { // Save pic as Pin
      const { pindex, fromotheruser, magnified } = req.query;
      let pin;
      let isResourceFromPixabay = false;
      if (pindex) {
        pin = req.session.imgs[pindex];
        isResourceFromPixabay = pin.src.includes('https://pixabay.com/get/');
      }

      if (fromotheruser === 'true') {
        pin = req.session.otherUser.pins[pindex];
      } else if (isResourceFromPixabay) {
        pin.src = uploadPixabayImgToCloudinary(req.session.imgs[pindex]);
      } else if (magnified === 'true') {
        pin = req.session.magnifiedPin;
      }
      pin.users.push(req.user.username);
      delete pin._id;
      Pins.findOneAndUpdate(
        { src: pin.src },
        {
          $set: pin,
        },
        {
          upsert: true,
        }
      )
        .then(() => {
          req.session.pins.push(pin);
          res.send({ pin });
        })
        .catch(err => console.log(err));
    })
    .delete((req, res) => { // Delete a Pin

      const { pinId } = req.query;

      Pins.updateOne(
        { _id: new ObjectId(pinId) },
        {
          $pullAll: { users: [ req.user.username ] }
        }
      )
        // .then(() => Users.updateOne({ email: req.user.email }, { $pull: {pins: null}}))
        .then(() => res.end())
        .catch(err => console.log(err));

    })
    .post((req, res) => { // This sends back objectId of the Pin magnified
      const { pindex } = req.body;
      const pin = req.session.imgs[pindex];
      const isResourceFromPixabay = pin.src.includes('https://pixabay.com/get/');

      if (isResourceFromPixabay) {

        pin.src = uploadPixabayImgToCloudinary(pin);
        req.session.imgs[pindex] = pin;
      }

      delete pin._id;
      Pins.findOneAndUpdate(
        {
          src: pin.src,
          tags: pin.tags[0],
        },
        {
          $set: pin,
        },
        {
          projection: { _id: 1 },
          upsert: true,
        }
      )
        .then(doc => {
          const pinId = doc.value ? doc.value._id : doc.lastErrorObject.upserted;
            req.session.magnifiedPin = pin;
            res.send({ pinId });
        })
        .catch(err => console.log(err));
    })
    .put((req, res) => { // Save or comment on pin-page
      const { comments } = req.body;
      let pin = req.session.magnifiedPin;
      if (comments) {
        pin.comments = comments;
      }
      delete pin._id;
      Pins.findOneAndUpdate(
        {
          src: pin.src,
          tags: pin.tags[0],
        },
        {
          $set: pin
        },
        {
          upsert: true,
        }
      )
      .then(() => res.end())
      .catch(err => console.log(err));
    });

  app.route('/pins')
    .get((req, res) => { // Get all pins
      Pins.find({})
        .toArray((err, docs) => {
          if (err) { console.log(err); }
          req.session.pins = docs;
          res.send(docs);
        });
    });

  app.route('/pin/:id')
    .get((req, res, next) => {
      const id = req.params.id;
      Pins.findOne(
        {
          '_id': new ObjectId(id),
        }
      )
        .then(pin => {
          req.session.magnifiedPin = pin;
          next();
        })
        .catch(err => console.log(err));
    });

  app.get('/search', (req, res, next) => {
    next();
  });

  app.get('/find', (req, res, next) => {
    next();
  });
};
