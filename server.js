require('dotenv').config()

const express = require('express')
const jwt = require('jsonwebtoken')
const { authUser, authRole } = require('./auth')
const mongoose = require('mongoose');

const app = express()

const ACCESS_TOKEN = process.env.ACCESS_TOKEN || 'secret';
const PORT = 3000

mongoose.connect('mongodb://localhost/OTOT-C');
const { ROLE, User, JwtTokenStorage } = require('./data');

User.deleteMany({}, function(err) {
    if (err) {
        console.log(err);
    } else {
        console.log("seeding...")
        const users = [
            { id: 1, name: 'Hazel', role: ROLE.ADMIN },
            { id: 2, name: 'Jude', role: ROLE.BASIC },
            { id: 3, name: 'Irene', role: ROLE.BASIC }
        ]
        for (var i = 0; i < users.length ; i++) {
            const currUser = new User(users[i])
            currUser.save(function(err){
                if(err){
                    console.log('error!',err);
                }
            });
        }
    }
});

app.post('/login', (req, res) => {
    const userId = parseInt(req.query.userId)
    if (userId && userId <= 3) {
        const accessToken = jwt.sign(userId, ACCESS_TOKEN)
        const jwtTokenStorageEntry = new JwtTokenStorage({id: userId, jwtToken: accessToken})
        jwtTokenStorageEntry.save(function(err){
            if(err){
                console.log('error!',err);
            }
        });
        res.json({ accessToken: accessToken })
    } else {
        res.status(400)
        res.send('User id not present')
    }
})

app.get("/welcome", authUser, (req, res) => {
    res.json({ message: "Welcome!" });
});

app.get("/admin", authUser, authRole(ROLE.ADMIN), (req, res) => {
    res.json({ message: "Welcome, Admin." })
})

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
