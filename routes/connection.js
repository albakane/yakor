let express = require('express');
let router = express.Router();

router.use(require('../config/flash'));

router.get('/', function(req, res, next) {
    if (req.session.login !== undefined || '') {
        req.flash('error', 'Veuillez vous deconnecter d\'abord');
        res.redirect('/dashboard');
    } else {
      res.render('index', { title: 'Page de connexion' });
    }
});

router.post('/connection', function(req, res, next) {

    if (req.session.login !== undefined || '') {
        req.flash('error', 'Veuillez vous deconnecter dabord');
        res.redirect('/dashboard');
    } else {
        let MysqlQuery = require('../class/mysql');
        MysqlQuery.checkUserExists({login : req.body.login, password : req.body.password}, function(results) {
            if (results.error === true) {
                req.flash('error', results.content);
                res.redirect('/');
            } else {
                req.session.login = results.content;
                res.redirect('/dashboard');
            }
        });
    }
});

router.get('/connection', function(req, res, next) {
    if (req.session.login !== undefined || '') {
        req.flash('error', 'Veuillez vous deconnecter dabord');
        res.redirect('/dashboard');
    } else {
        req.flash('error', 'Veuillez remplir les champs');
        res.redirect('/');
    }
});

router.get('/disconnect', function(req, res, next) {
    if (req.session.login !== undefined || '') {
        req.session.login = undefined;
        res.redirect('/');
    }
});

module.exports = router;
