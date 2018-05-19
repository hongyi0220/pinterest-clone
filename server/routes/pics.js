const apiKey = process.env.PIXABAY_API_KEY;
const fetch = require('node-fetch');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });
const cloudinary = require('cloudinary');
const ObjectId = require('mongodb').ObjectId;

module.exports = (app, db) => {
  // const Users = db.collection('users');
  const Pins = db.collection('pins');
  const uploadPixabayImgToCloudinary = img => {
      console.log('rsc from pixabay');
      const cloudinaryUploadFolderName = 'saved_images';
      const resourceName = img.src.split('get/')[1];
      cloudinary.image(`${cloudinaryUploadFolderName}/${resourceName}`);

      const uploadedResourceLocationOnCloudinary = `https://res.cloudinary.com/fluffycloud/image/upload/${cloudinaryUploadFolderName}/${resourceName}`;
      return uploadedResourceLocationOnCloudinary;
  };

  const beautifyTags = tags => {
    const result = tags.map(tag => tag.toString().trim().toLowerCase().replace(',', '').replace(/[-_]/g, ' ')).sort();
    // console.log('result from beautifying tags:', result);
    return result;
  };

  app.get('/pics', (req, res) => { // search pics
    console.log('GET /pics route reached!');
    console.log('session.id:', req.session.id);
    let { page, q } = req.query;
    page = +page;
    const url = `https://pixabay.com/api?key=${apiKey}&q=${q}&safesearch=true&page=${page}`;
    console.log(url);

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

    fetch(url)
      .then(res => res.json())
      .then(resJson =>
        resJson.hits.map(hit => ({
          src: hit.webformatURL,
          tags: beautifyTags(removeDuplicates(hit.tags.split(' '))),
          comments: [],
          users: [],
          height: hit.webformatHeight,
          // width: hit.webformatWidth,
        })
      ))
      .then(imgs => {
        // console.log('req.session:', req.session);

        if (page === 1) {
          req.session.page = page;
          req.session.imgs = imgs;
        } else {
          console.log('page > 1, concating imgs');
          req.session.page ? req.session.page++ : req.session.page = page;
          req.session.imgs = [...req.session.imgs, ...imgs];
        }
        // console.log('req.session2:', req.session);
        res.send(imgs);
      })
      .catch(err => console.log(err));
  });

  app.route('/pic') // From drag & drop pic
    .post(upload.single('imgFile'), (req, res) => {
      console.log('POST /pic reached; processing dragged & dropped pic');
      // console.log('req.session.user:',req.session.user );
      let { tags, height } = req.body;
      tags = beautifyTags(tags.split(','));
      cloudinary.v2.uploader.upload_stream({ resource_type: 'raw'}, (err, result) => {
        console.log('upload pic to cloudinary result:', result);
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
      console.log('PUT /pic reached');
      const { pic } = req.body;
      console.log('pic:', pic);
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
      console.log('GET pin reached!');

      // console.log('req.user:',req.user);
      // console.log('req.session:', req.session);
      const { pindex, fromotheruser, magnified } = req.query;
      let pin;
      let isResourceFromPixabay = false;
      console.log('pindex:',pindex);
      if (pindex) {
        pin = req.session.imgs[pindex];
        isResourceFromPixabay = pin.src.includes('https://pixabay.com/get/');
      }

      if (fromotheruser === 'true') {
        console.log('req.session @ GET /pin fromotheruser:',req.session);
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
        .then(() => res.end())
        .catch(err => console.log(err));
    })
    .delete((req, res) => { // Delete a Pin
      console.log('DELETE pin reached!');

      const { pinId } = req.query;
      console.log(`pinId: ${pinId}`);
      // console.log('req.user:',req.user);
      // let pin = req.user.pins[pindex];
      // console.log('Pin to delete:', pin);

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
      console.log('POST /pin route reached!!');
      console.log('req.body:', req.body);
      const { pindex } = req.body;
      const pin = req.session.imgs[pindex];
      console.log('pin:', pin);
      const isResourceFromPixabay = pin.src.includes('https://pixabay.com/get/');

      if (isResourceFromPixabay) {
        console.log('rsc is from pixabay');

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
          console.log('doc returned from findOneAndUpdate:', doc);
          const pinId = doc.value ? doc.value._id : doc.lastErrorObject.upserted;
            // console.log('doc.upserted:', doc.upserted);
            console.log('pinId:', pinId);
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
      console.log('GET /pins reached');
      Pins.find({})
        .toArray((err, docs) => {
          if (err) { console.log(err); }
          // req.session.imgs = docs;
          req.session.pins = docs;
          // req.user.pins = req.session.pins.filter(pin => pin.users.includes(req.user.username));
          console.log('DOCS:', docs);
          res.send(docs);
        });
    });

  app.route('/pin/:id')
    .get((req, res, next) => {
      const id = req.params.id;
      console.log(`route /pin/:id (${id}) reached `);
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
};
