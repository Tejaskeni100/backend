const mysqlConnection = require('../config/dbconfig');
var nodemailer = require('nodemailer');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
// const { application } = require('express');
const dotenv = require('dotenv');

dotenv.config();
// sql12570631
let database = process.env.DB_NAME

//  function verifyToken(req, res, next){
// module.exports.verifyToken = (req, res, next) => {
//     if(!req.headers.authorization){
//         return res.status(401).send('Unauthorized request')
//     }
//         let token = req.headers.authorization.split(' ')[1]
//         if(token === 'null'){
//             return res.status(401).send('Unauthorized request') 
//         }
//         let payload = jwt.verify(token, 'secretKey')
//         if(!payload) {
//             return res.status(401).send('Unauthorized request')
//         }
//             req.email_id = payload.subject
//         console.log(req.email_id);
//         console.log(payload.subject)
//         next()
//     }


// function verifyjwt(req,res,next){
//     const token = req.headers['authorization']
//     if(!token) return res.status(401).json('Unauthorize user')
    
//     try{
//         const decoded = jwt.verify(token, 'secretKey');
//         req.user = decoded
//         next()
    
//     }catch(e){
//         res.status(400).json('Token not valid')
//     }
// }
    
// module.exports = verifyjwt 

module.exports.getUsers = (req, res) => {
    mysqlConnection.query(`select * from ${database}.users`, (err, rows, fields) => {
        if (!err){
            res.send(rows)
            let payload = jwt.verify(token, 'secretKey');
            console.log(payload);
        }else{
            res.send(err)
        }
    })
}

module.exports.login = (req, res) => {
    let sql = `select name, email_id, password from ${database}.users`;

    let {email_id, password} = req.body; //destructoring
    console.log("Email ID :- "+email_id);
    console.log("Password :- "+password);
    // console.log(email_id, password);
    let hashPassword = md5(password);
    console.log(md5(hashPassword));
    let output = {}
    mysqlConnection.query(sql, (err, rows, fields) => {
        if (!err){
            // res.send(rows)        
            const user = rows.find((data) => {
               return data.email_id === email_id;
            })
            // console.log(user);
          
        if(user){
            if(user.password !== hashPassword){
                console.log("Password Incorrect!");
                output['message'] = "Password Incorrect!";
                // res.status(401).send("Password Incorrect!")
               
                res.status(200).send(output);
            } else{
                let payload = { name: user.name };
                console.log(payload);
                let token = jwt.sign(payload, 'secretKey');
                console.log("Token :- ",token);
                console.log("login successful!");
                output['name'] = user.name;
                output['message'] = "Login Successful!";
                output['token'] = token
                res.status(200).send(output);
            } 
        }else {
            console.log("Incorrect Credential!");
            res.status(401).send("Invalid EmailId & Password!")
        }
        // res.status(200).send(output);
            
        }else{
            res.send(err)
        }
    })
}


// module.exports.getUserName = (req, res) => {
//     let token = req.body.token;
//     console.log(token);
//     console.log(decodedToken.name);
//     return res.status(200).json(decodedToken.name)
// }

// var decodedToken = '';
// module.exports.verifyToken = (req, res, next) => {
//     let token = req.body.token;    
//     console.log("VerifyToken :- "+token);
//     console.log(decodedToken);
//     jwt.verify(token, 'secretKey', function(err, tokendata){

//         if(err){
//             return res.status(401).json({message: 'Unauthorized Request'});
//         }
        
//         if(tokendata) {
//             decodedToken = tokendata;
//             next()
//         }
//     })
// }


// module.exports.login = (req, res) => {
//     // console.log(verifyToken)
//     sql = 'select * from ril.users where email_id =? and password = ?';
//     let {email_id, password} = req.body; //destructoring

//     console.log(email_id, password);

//     let hashPassword = md5(password);
//     console.log(md5(hashPassword));
    
//     mysqlConnection.query(sql, [email_id, hashPassword], (err, rows, fields) => {
//         if (!err){
//             if(rows.length == 0){
//                 res.send("Incorrect Credential!")
//                 console.log("Undefined!")
//             } else {
//                 let output = {}

//                 // if(!rows){
//                 //     res.status(401).send("Invalid Email!")
//                 // }else if( rows[0].password !== hashPassword ){
//                 //     res.status(401).send('Invalid Password')
//                 // }else {

                    
//                     console.log(rows);
//                     // res.status(200).send(rows);
//                     // let email = rows[0].email_id;
                    
//                     let payload = { subject: rows[0].email_id };
//                     console.log(payload);
//                     let token = jwt.sign(payload, 'secretKey');
//                     console.log("Token :- ",token);
                    
//                     let token1 = jwt.verify(token, 'secretKey')
//                     console.log("Verification : ",token1)
                    

//                     // res.status(200).send({token});
//                     output['token'] = token
//                     output['name'] = rows[0].name;
                    
//                     res.status(200).send(output);
//                 }
                
                
//             // }
//                 // res.send(rows);
//                 // if(rows.length == 1){
//                     //     res.send("Success!")
//             // }else {
//             //     res.send("Failed!")
//             // }

//         }else{
//             res.send(err)
//         }
//         // req.email_id = payload.subject
    
//         // console.log("Req.email_id "+req.email_id);
//         // console.log("Payload : "+payload.subject)

//     })
// }


module.exports.createUser = (req, res) => {
    let sql = `insert into ${database}.users set email_id =?, name=?, password =?`;
    let {email_id, name, password} = req.body; //destructoring
    let hashPassword = md5(password);
    console.log("Creating User")
    mysqlConnection.query(sql, [email_id, name, hashPassword], (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            res.send(rows)
        }
        else {
            console.log(err);
            res.send(err)
        }
    })
}

module.exports.updateUser = (req, res) => {
    let sql = `select email_id from ${database}.users where email_id =? and otp = ?`;

    let { email_id, otp, password } = req.body;
    let hashPassword = md5(password);
    mysqlConnection.query(sql, [email_id, otp], (err, rows, fields) => {
        if (!err) {
            console.log("Verify!")
            // res.send(rows);

            let sql = `update ${database}.users set password =? where email_id=?`;
            // let {password} = req.body; //destructoring
            mysqlConnection.query(sql, [hashPassword,email_id], (err, rows1, fields) => {
                    if (!err) {
                        console.log("Password Updted!")
                        res.send(rows1)
                    }
                    else {
                        console.log("Not Updated!")
                        res.send(err)
                    }
                    console.log(rows);
                })
        }
        else {
            res.send(err)
        }
    })    

    // let sql = 'update ril.users set password =? where email_id=?';
    // let {email_id} = req.params;
    // let {password} = req.body; //destructoring
    // let hashPassword = md5(password);

    // mysqlConnection.query(sql, [hashPassword,email_id], (err, rows, fields) => {
    //     if (!err) {
    //         res.send(rows)
    //     }
    //     else {
    //         res.send(err)
    //     }
    // })
}

module.exports.otptosql = (req, res) => {
    var otp = Math.random();
    otp = otp * 1000000;
    otp = parseInt(otp);
    console.log(otp);
    let {email_id} = req.body;
    
    let transporter = nodemailer.createTransport({

        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        service : 'Gmail',
        
        auth: {
         user: 'tejaskeni100@gmail.com',
         pass: 'imrnznwmupaswhhm'
        },
        secureConnection: 'false',
        tls: {
            ciphers: 'SSLv3',
            rejectUnauthorized: false
        }
      });
      
      //defining port
      
      var mailOptions = {
      
       from: 'tejaskeni100@gmail.com',
       to: email_id,
       cc: 'tejaskeni20@gmail.com',
       subject: "Otp for registration is: ",
       text: "Please verify your OTP. Your OTP is "+otp+" Don't Share With Anyone!!!"
      
      };
      
      transporter.sendMail(mailOptions, function(error, info){
      
       if (error) {
        console.log(error);
       } else {
            // let {email_id} = req.body;
           console.log('Email sent: ' + info.response);
           console.log(email_id);
           let sql = `update ${database}.users set otp =? where email_id=?`;
           mysqlConnection.query(sql, [otp, email_id], (err, rows, fields) => {
               if (!err) {
                   res.send(rows)
                }
                else {
                    res.send(err)
                }
            })
        }
            
      });
      

}
