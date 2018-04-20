module.exports = (app, db) => {
    require('./users')(app, db);
    require('./pics')(app, db);
}
