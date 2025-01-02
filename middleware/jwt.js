var jwt = require('jsonwebtoken');

let options = {
    algorithm: 'HS256',
    expiresIn: 86400 // expires in 24 hours
}

let getPayload = (token) => {
    var decode = jwt.decode(token, { complete: true })
    return decode.payload;
}

let setToken = (id, username) => {
    let payload = {
        id: id,
        username: username
    };
    var token = jwt.sign(payload, 'secret', options);
    return token;
};

let checkToken = (token) => {
    jwt.verify(token, 'secret', options)
}

module.exports = {
    setToken,
    getPayload,
    checkToken
}