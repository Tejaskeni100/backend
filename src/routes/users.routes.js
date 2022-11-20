const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next){
    if(!req.headers.authorization){
        console.log("Header Unauthorized request")
        return res.status(401).send('Unauthorized request')
    }
        let token = req.headers.authorization.split(' ')[1]
        if(token === 'null'){
            console.log("Null Unauthorized request")
            return res.status(401).send('Unauthorized request') 
        }
        let payload = jwt.verify(token, 'secretKey')
        // console.log(payload);
        if(!payload) {
            console.log("Payload Unauthorized request")
            return res.status(401).send('Unauthorized request')
        }
        console.log("Token Verified!", payload);
        req.name = payload.name;
        // console.log(req.name = payload.subject);
        // console.log(name);
        console.log(payload.name)
        next()
    }

const UserController = require('../controller/users.controllers');
router.get('/getusers', verifyToken, UserController.getUsers);  //Get Method
router.post('/login', UserController.login);
router.post('/create', UserController.createUser);
router.post('/update', UserController.updateUser);

router.post('/otp', UserController.otptosql);
// router.post('/name', UserController.getUserName);
// router.get('/login', UserController.login);

module.exports = router;        