module.exports = function(req, res, next) {
    if (req.session.login === undefined || '') {
        res.redirect('/');
        next();
    } else {
        next();
    }
};