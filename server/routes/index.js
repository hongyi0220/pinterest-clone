module.exports = (app, db) => {
    require('./users')(app, db);
    require('./images')(app, db);
}
