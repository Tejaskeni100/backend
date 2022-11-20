const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const EmployeeController = require('../controller/employee.controller');


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
        console.log(payload.name)
        next()
    }

router.get('/getemployee', verifyToken, EmployeeController.getEmployees);  //Get Method
router.post('/addemployee', verifyToken, EmployeeController.createEmployees); // Add or Post Method
router.put('/editemployee/:employee_id', verifyToken, EmployeeController.updateEmployee); // Update or Put Method
router.delete('/deleteemployee/:employee_id', verifyToken, EmployeeController.deleteEmployee); // Delete Method
router.get('/getemployee/:employee_id',verifyToken, EmployeeController.getEmployee);  //Get Method

// router.get('/new', EmployeeController.createEmployees);
// router.get('/detail/:id', ProductController.getProduct);

module.exports = router;
