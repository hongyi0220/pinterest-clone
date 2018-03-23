module.exports = function(app, db) {
    require('./users')(app, db);
}
