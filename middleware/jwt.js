var jwt = require('jsonwebtoken');
let fs = require('fs');
const path = require('path');


let options = {
    algorithm: 'RS256',
    expiresIn: 86400 // expires in 24 hours
}

let getPayload = (token) => {
    var decode = jwt.decode(token, { complete: true })
    return decode.payload;
}

let setToken = (id, username) => {
    let payload = { id: id, username: username };
    let privateKey = fs.readFileSync(__dirname + "/rsa.key")
    var token = jwt.sign(payload, privateKey, options);
    return token;
};

let checkToken = (token) => {
    let publicKey = fs.readFileSync(__dirname + '/rsa.pem')
    jwt.verify(token, publicKey, options)
}

module.exports = {
    setToken,
    getPayload,
    checkToken
}