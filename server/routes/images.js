const apiKey = process.env.API_KEY;
const http = require('https');
const fetch = require('node-fetch');

module.exports = (app, db) => {
    app.get('/images', (req, res) => {
        console.log('/images route reached!');
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
    })
};
