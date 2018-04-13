const apiKey = process.env.API_KEY;
const http = require('https');
const fetch = require('node-fetch');

module.exports = (app, db) => {
    const Users = db.collection('users');
    app.get('/images', (req, res) => {
        console.log('/images route reached!');
        console.log('session.id:', req.session.id);
        let { page, q } = req.query;
        const url = `https://pixabay.com/api?key=${apiKey}&q=${q}&safesearch=true&page=${page}`;
        console.log(url);

        fetch(url)
        .then(res => res.json())
        .then(resJson => resJson.hits.map(hit => ({src: hit.webformatURL, tags: hit.tags})))
        .then(images => {
            console.log('req.session:', req.session);
            req.session.images = images;
            console.log('req.session2:', req.session);
            res.send(images)
        })
        .catch(err => console.log(err));
    });

    app.get('/save-pin', (req, res) => {
        console.log('/save-pin reached!');
        console.log('session.id:', req.session.id);
        console.log('req._passport.session:',req._passport.session);
        console.log('req.user:',req.user);
        console.log('req.isAuthenticated():',req.isAuthenticated());
        console.log('req.session:', req.session);
        const pindex = req.query.pindex;
        console.log(pindex);
        console.log('req.user:',req.user);
        Users.updateOne(
            { email: req.user.email },
            {
                $push: { pins: req.session.images[pindex] }
            }
        );
        res.end();
    });

    app.get('/delete-pin', (req, res) => {
        console.log('/delete-pin reached!');

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
    });
};
