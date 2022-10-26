var mongoose = require('mongoose');

const ROLE = {
    ADMIN: 'admin',
    BASIC: 'basic'
} // extend this to add more roles.


var userSchema = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
})

var User = mongoose.model('user', userSchema)

var jwtTokenStorage = mongoose.Schema({
    id: {
        type: Number,
        required: true
    },
    jwtToken: {
        type: String,
        required: true
    }
})

var JwtTokenStorage = mongoose.model('jwtTokenStorage', jwtTokenStorage)

module.exports = {
    ROLE,
    User,
    JwtTokenStorage
}
