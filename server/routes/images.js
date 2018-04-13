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
        .then(result => {
            console.log('req.session:', req.session);
            req.session.images = result;
            console.log('req.session2:', req.session);
            res.send(result)
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
        const pindex = req.query.pin;
        console.log(pinIndex);
        console.log('req.user:',req.user);
        Users.updateOne(
            { email: req.user.email },
            {
                $push: { pins: req.session.images[pindex] }
            }
        );
        res.end();
    })
};
