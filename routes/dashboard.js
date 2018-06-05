let express = require('express');
let router = express.Router();

router.use(require('../config/session'));

router.get('/', function(req, res, next) {
    let userList = [], doorList = [], tagList = [];
    let Mysql = require('../class/mysql');
    Mysql.selectAllUsers(function(results) {
        userList = results.content;
        Mysql.selectAllDoors(function(results) {
            doorList = results.content;
            Mysql.selectAllTags(function(results) {
                tagList = results.content;
                res.render('dashboard', {
                    users : userList,
                    doors : doorList,
                    tags  : tagList
                });
            });
        });
    });
});

router.get('/records', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.selectAllDoors(function(results) {
        Mysql.records(function(records) {
            let doorRecords = records.doorClosedRecord;
            for (let i = 0; i < doorRecords.length; i++) {
                console.log(i);
                for (let j = 0; j < records.doorOpenRecord.length; j++) {
                    if (doorRecords[i].date.getTime() >= records.doorOpenRecord[j].date.getTime()) {
                        doorRecords.splice(i, 0, records.doorOpenRecord[j]);
                        records.doorOpenRecord.splice(j, 1);
                    }
                }
            }
            console.log(doorRecords);
            res.render('records', {
                doors : results.content,
                doorRecords : doorRecords
            });
        });
    });
});

router.get('/newuser', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.selectAllDoors(function(results) {
        res.render('newuser', {
            doors : results.content
        });
    });
});

router.get('/newdoor', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.selectAllDoors(function(results) {
        res.render('newdoor', {
            doors : results.content
        });
    });
});

router.get('/newtag', function(req, res, next) {
    let Mysql = require('../class/mysql');
    let users = [];
    Mysql.selectAllUsers(function(results) {
        users = results.content;
        Mysql.selectAllDoors(function(results) {
            res.render('newtag', {
                users : users,
                doors : results.content
            });
        });
    });
});

router.post('/newdoorcontrol', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.createDoorControl({doorId : parseInt(req.body.doorId), tagId : parseInt(req.body.tagId)}, function(results) {
        if (results.error === true) {
            req.flash('error', results.content);
            res.redirect('/dashboard');
        } else {
            req.flash('done', results.content);
            res.redirect('/dashboard');
        }
    });
});

router.post('/newuser/check', function(req, res, next) {
   let Mysql = require('../class/mysql');
   Mysql.createUser(req.body, function(results) {
       if (results.error === true) {
           req.flash('error', results.content);
           res.redirect('/dashboard/newuser');
       } else {
           req.flash('done', results.content);
           res.redirect('/dashboard');
       }
   });
});

router.post('/newdoor/check', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.createDoor(req.body, function(results) {
        if (results.error === true) {
            req.flash('error', results.content);
            res.redirect('/dashboard/newdoor');
        } else {
            req.flash('done', results.content);
            res.redirect('/dashboard');
        }
    })
});

router.post('/newtag/check', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.createTag(req.body, function(results) {
        if (results.error === true) {
            req.flash('error', results.content);
            res.redirect('/dashboard/newtag');
        } else {
            req.flash('done', results.content);
            res.redirect('/dashboard');
        }
    })
});

router.post('/user/*', function(req, res, next) {
    let Mysql = require('../class/mysql');
    Mysql.getTagsFromUserId(req.body.idUser, function(tags) {
        Mysql.selectAllDoors(function(results) {
          res.render('user', {
            tags : tags,
            doors : results.content
          });
        });
    });
});

router.post('/tag/*', function(req, res, next) {
    let Mysql = require('../class/mysql');
    let tagId = parseInt(req.body.idTag);
    let doors = [];
    Mysql.selectAllDoors(function(results) {
        doors = results.content;
        Mysql.getDoorControlFromTagId(tagId, function(results) {
          res.render('tag', {
            tagId : tagId,
            doors : doors,
            doorsControled : results.doorsControled,
            doorsNotControled : results.doorsNotControled
          });
        });
    });
});

router.post('/deleteuser', function(req, res, next) {

    let Mysql = require('../class/mysql');
    Mysql.deleteUserFromUserId(req.body.idUser, function(results) {
        req.flash('done', 'L\'utilisateur a bien été supprimé');
        res.redirect('/dashboard');
    });

});

router.post('/deletedoor', function(req, res, next) {

    let Mysql = require('../class/mysql');
    Mysql.deleteDoorFromDoorId(req.body.idDoor, function(results) {
        req.flash('done', 'La porte a bien été supprimé');
        res.redirect('/dashboard');
    });

});

router.post('/deletetag', function(req, res, next) {

    let Mysql = require('../class/mysql');
    Mysql.deleteTagFromTagId(req.body.idTag, function(results) {
        req.flash('done', 'Le tag a bien été supprimé');
        res.redirect('/dashboard');
    });

});

router.post('/deletedoorcontrol', function(req, res, next) {

    let Mysql = require('../class/mysql');
    Mysql.deleteDoorControlFromTagAndDoor({idTag : req.body.idTag, idDoorControl : req.body.idDoorControl}, function(results) {
        req.flash('done', 'Droit supprimé avec succès');
        res.redirect('/dashboard');
    });

});

module.exports = router;