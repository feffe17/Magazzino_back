var jwt = require('jsonwebtoken');

let setToken = (id, username) => {
    var token = jwt.sign({
        id: id,
        username: username
    }, 'secret', {
        algorithm: 'HS256',
        expiresIn: 86400 // expires in 24 hours
    });
    return token;
};

module.exports = {
    setToken
}