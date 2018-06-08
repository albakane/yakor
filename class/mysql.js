"use strict";

let connection = require('../config/connection');
let path = require('path');

class Mysql {

    static checkUserExists (formular, callback) {

        if (formular.login.trim() === (undefined || '') || formular.password.trim() === (undefined || '')) {
            callback({error : true, content : 'Veuillez remplir les champs'});
        } else {
            connection.query("SELECT LOGIN, PASSWORD FROM ADMIN WHERE LOGIN = ?", [formular.login], function(error, results) {
                if (error) throw error;
                if (results.length === 0) {
                    callback({error : true, content : 'Login incorrect'});
                } else {
                    let Hasher = require(path.join(__dirname, 'hasher'));
                    Hasher.compare(formular.password, results[0].PASSWORD) ? callback({error : false, content : results[0].LOGIN}) : callback({error : true, content : 'Mot de passe incorrect'});
                }
            });
        }

    }

    static records (callback) {

        let doorClosedRecord = [], doorOpenRecord = [];
        connection.query("SELECT EVENT_TIME, EVENT_DATE, ID_DOOR FROM DOOR_CLOSED WHERE ID_DOOR_CLOSED > 5", function(error, results) {
            for (let i = 0; i < results.length; i++) {
                let time = results[i].EVENT_TIME.split(':');
                let date = new Date(results[i].EVENT_DATE);
                date.setUTCHours(parseInt(time[0]));
                date.setUTCMinutes(parseInt(time[1]));
                date.setUTCSeconds(parseInt(time[2]));
                let record = {date : '', doorId : 0};
                record.date = date;
                record.doorId = results[i].ID_DOOR;
                doorClosedRecord[i] = record;
            }
            connection.query("SELECT EVENT_DATE, EVENT_TIME, ID_DOOR, ID_TAG FROM DOOR_OPEN", function(error, results) {
                for (let i = 0; i < results.length; i++) {
                    let time = results[i].EVENT_TIME.split(':');
                    let date = new Date(results[i].EVENT_DATE);
                    let record = {date : '', doorId : 0, tagId : 0};
                    date.setUTCHours(parseInt(time[0]));
                    date.setUTCMinutes(parseInt(time[1]));
                    date.setUTCSeconds(parseInt(time[2]));
                    record.date = date;
                    record.doorId = results[i].ID_DOOR;
                    record.tagId = results[i].ID_TAG;
                    doorOpenRecord[i] = record;
                }
                callback({
                  doorClosedRecord : doorClosedRecord,
                  doorOpenRecord : doorOpenRecord
                });
            });
        });
    }

    static selectAllUsers(callback) {

        connection.query("SELECT * FROM USER", function(error, results) {
            if (error) throw error;
            if (results.length === 0) {
                callback({error : true, content : 'La liste des utilisateurs est vide'});
            } else {
                callback({error : false, content : results});
            }
        });
    }

    static selectAllDoors(callback) {
        connection.query("SELECT * FROM DOOR", function(error, results) {
            if (error) throw error;
            if (results.length === 0) {
                callback({error : true, content : 'La liste des portes est vide'});
            } else {
                callback({error : false, content : results});
            }
        });
    }

    static selectAllTags(callback) {
        connection.query("SELECT * FROM TAG", function(error, results) {
            if (error) throw error;
            if (results.length === 0) {
                callback({error : true, content : 'La liste de tags est vide'});
            } else {
                callback({error : false, content : results});
            }
        });
    }

    static createUser(formular, callback) {

        let Hasher = require('../class/hasher');
        let url = Hasher.getRandomId();

        if (formular.firstName.trim() === (undefined || '') || formular.lastName.trim() === (undefined || '') || formular.email.trim() === (undefined || '')) {
            callback({error : true, content : 'Veuillez remplir les champs'})
        } else {
            connection.query("INSERT INTO USER SET ?",
                {
                    URL : url,
                    FIRST_NAME : formular.firstName,
                    LAST_NAME : formular.lastName,
                    EMAIL : formular.email},
                function(error, results, fields) {
                    if (error) throw error;
                    callback({error : false, content : 'L\'utilisateur a bien été ajouté'});
                }

            )
        }
    }

    static createDoor(formular, callback) {

        let Hasher = require('../class/hasher');
        let encryptedId = Hasher.getRandomId();

        if (formular.name.trim() === (undefined || '')) {
            callback({error : true, content : 'Veuillez remplir les champs'});
        } else {
            let date = new Date();
            connection.query("INSERT INTO DOOR SET ?", {
                ID_DOOR_ENCRYPTED : encryptedId,
                CREATION_DATE : date,
                CREATION_TIME : date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                NAME : formular.name
            }, function(error, results, fields) {
                if (error) throw error;
                callback({error : false, content : "La porte a bien été ajouté"});
            });
        }
    }

    static createTag(formular, callback) {

        let Hasher = require('../class/hasher');
        let encryptedId = Hasher.getRandomId();

        let date = new Date();

        if (formular.name.trim() === (undefined || '') || formular.user === (undefined || 0)) {
            callback({error : true, content : 'Veuillez remplir les champs'});
        } else {
            connection.query("INSERT INTO TAG SET ?", {
                ID_TAG_ENCRYPTED : encryptedId,
                CREATION_DATE    : date,
                CREATION_TIME    : date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
                NAME             : formular.name,
                ID_USER          : formular.userId
            }, function(error, results, fields) {
                if (error) throw error;
                callback({error : false, content : 'Le tag a bien été ajouté, veuillez le configurer en allant dans la liste des tags'});
            });
        }

    }

    static createDoorOpen(formular, callback) {

        let date = new Date();

        if (formular.doorId === (0 || undefined) || formular.tagId === (0 || undefined)){
            callback({error : true, content : "Erreur dans l'insertion de la table DOOR_OPENED"});
        } else {
            connection.query("INSERT INTO DOOR_OPEN SET ?", {
                ID_DOOR : formular.doorId,
                ID_TAG  : formular.tagId,
                EVENT_DATE : date,
                EVENT_TIME : date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            }, function(error, results, fields) {
                if (error) throw error;
                callback({error :false, content : "Insertion réussie"});
            });
        }
    }

    static createDoorControl(formular, callback) {
        let date = new Date();

        connection.query("INSERT INTO DOOR_CONTROL SET ?", {
            ID_DOOR : formular.doorId,
            ID_TAG : formular.tagId,
            CREATION_DATE : date,
            CREATION_TIME : date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        }, function(error, results, fields) {
            if (error) throw error;
            callback({error : false, content : "Modification des droits effectuée sur le tag"});
        });
    }

    static getTagsFromUserId(userId, callback) {
        connection.query("SELECT * FROM TAG WHERE ID_USER = ?", [userId], function(error, results) {
            if (error) throw error;
            let tags = [];
            for (let i = 0; i < results.length; i++) {
                tags[i] = results[i];
            }
            callback(tags);
        });
    }

    static getDoorControlFromTagId(tagId, callback) {
        connection.query("SELECT ID_DOOR FROM DOOR_CONTROL WHERE ID_TAG = ?", [tagId], function(error, results) {
            if (error) throw error;
            let select = "SELECT * FROM DOOR WHERE";
            let doorIds = [], doorsControled = [], doorsNotControled = [];
            for (let i = 0; i < results.length; i++) {
                doorIds[i] = results[i].ID_DOOR;
                i === (results.length - 1) ? (select += " ID_DOOR = ?") : (select += " ID_DOOR = ? OR");
            }
            if (doorIds.length > 0) {
              connection.query(select, doorIds, function(error, results) {
                if (error) throw error;
                doorsControled = results;
                let notSelect = "SELECT * FROM DOOR WHERE";
                let notDoorsIds = [];
                for (let i = 0; i < doorsControled.length; i++) {
                  notDoorsIds[i] = doorsControled[i].ID_DOOR;
                  i === (doorsControled.length - 1) ? (notSelect += " ID_DOOR != ?") : (notSelect += " ID_DOOR != ? AND");
                }
                connection.query(notSelect, notDoorsIds, function(error, results) {
                  if (error) throw error;
                  doorsNotControled = results;
                  callback({
                    doorsControled : doorsControled,
                    doorsNotControled : doorsNotControled
                  });
                });
              });
            } else {
                connection.query("SELECT * FROM DOOR", function(error, results) {
                    if (error) throw error;
                    doorsControled = [];
                    doorsNotControled = results;
                    callback({
                      doorsControled : doorsControled,
                      doorsNotControled : doorsNotControled
                    });
                });
            }
        });
    }

    static openTheDoor(doorId, callback) {
        connection.query("UPDATE DOOR SET STATE = \"open\" WHERE ID_DOOR = ?", [doorId], function(error, results) {
            if (error) throw error;
            callback(results);
        })
    }

    static closeTheDoor(doorId, callback) {
        connection.query("UPDATE DOOR SET STATE = \"closed\" WHERE ID_DOOR = ?", [doorId], function(error, results) {
            if (error) throw error;
            callback(results);
        })
    }

    static checkRight(formular, callback) {
        connection.query("SELECT * FROM DOOR_CONTROL WHERE ID_TAG = ? AND ID_DOOR = ?", [formular.tagId, formular.doorId], function(error, results) {
            if (error) throw error;
            callback(results);
        })
    }

    static getTagAndDoorFromIds(ids, callback) {
        if (ids.tagId.trim().length === 0) {
            connection.query("SELECT ID_DOOR FROM DOOR WHERE ID_DOOR_ENCRYPTED = ?", [ids.doorId], function(error, results) {
                if (error) throw error;
                callback(results);
            })
        } else {
            connection.query("SELECT ID_TAG, ID_DOOR FROM TAG, DOOR WHERE ID_DOOR_ENCRYPTED = ? AND ID_TAG_ENCRYPTED = ?", [ids.doorId, ids.tagId], function(error, results) {
                if (error) throw error;
                callback(results);
            });
        }
    }

    static deleteTagFromTagId(tagId, callback) {
        connection.query("DELETE FROM TAG WHERE ID_TAG = ?", [tagId], function(error, results, fields) {
            if (error) throw error;
            callback(results);
        });
    }

    static deleteUserFromUserId(userId, callback) {
        connection.query("DELETE FROM USER WHERE ID_USER = ?", [userId], function(error, results, fields) {
            if (error) throw error;
            callback(results);
        });
    }

    static deleteDoorFromDoorId(doorId, callback) {
        connection.query("DELETE FROM DOOR WHERE ID_DOOR = ?", [doorId], function(error, results, fields) {
            if (error) throw error;
            callback(results);
        });
    }

    static deleteDoorControlFromTagAndDoor(formular, callback) {
        connection.query("DELETE FROM DOOR_CONTROL WHERE ID_TAG = ? AND ID_DOOR = ?",
          [formular.idTag, formular.idDoorControl],
          function(error, results, fields) {
            if (error) throw error;
            callback(results);
          });
    }

}

module.exports = Mysql;
