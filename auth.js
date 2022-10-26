const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/OTOT-C');
const { ROLE, User, JwtTokenStorage } = require('./data');

function authUser(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        res.status(401)
        return res.send('You need to sign in')
    }

    const userId = parseInt(req.query.userId)
    if (userId) {
        User.find( {id: userId}, function(err, user) {
            const currUser = user[0]
            JwtTokenStorage.find({id: currUser.id}, function (err, entry) {
                if (entry.length === 0) {
                    res.status(401)
                    return res.send('You are not logged in')
                }

                if (entry[0].jwtToken != token) {
                    res.status(401)
                    return res.send('You are using a wrong token.')
                } else {
                    next()
                }
            })
        })
    } else {
        next()
    }
}

function authRole(role) {
    return (req, res, next) => {
        const userId = parseInt(req.query.userId)
        if (userId) {
            User.find( {id: userId}, function(err, user) {
                if (user[0].role !== role) {
                    res.status(403)
                    return res.send('You are not an admin.')
                } else {
                    next()
                }
            })
        } else {
            next()
        }
    }
}

module.exports = {
    authUser,
    authRole
}