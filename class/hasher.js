"use strict";

let bcrypt = require('bcrypt');
let salt = bcrypt.genSaltSync(15);

class Hasher {

    static hash(stringToHash) {
        return bcrypt.hashSync(stringToHash, salt);
    }

    static compare(stringToCompare, hash) {
        return bcrypt.compareSync(stringToCompare, hash);
    }

    static getRandomId() {
        let chain = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789';
        let url = '';

        for (let i = 0; i < 15; i++) {
            url += chain.charAt(Math.round(Math.random() * 61));
        }

        return url;
    }

}

module.exports = Hasher;