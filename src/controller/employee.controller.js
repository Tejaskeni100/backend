const mysqlConnection = require('../config/dbconfig');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
let database = process.env.DB_NAME


module.exports.getEmployees = (req, res) => {
    mysqlConnection.query(`select * from ${database}.employees`, (err, rows, fields) => {
        if (!err){
            res.send(rows);


            // console.log("Req.email_id "+req.email_id);
            //         console.log("Payload : "+payload.subject)


        }else{
            res.send(err)
        }
    })
}



// module.exports.createEmployees = (req, res) => {
//     let sql = 'insert into ril.employees set employee_id =?, employee_name=?, email_id = ?, department= ?, designation=?';
//     let {employee_id, employee_name, email_id, department, designation} = req.body; //destructoring

//     mysqlConnection.query(sql, [employee_id, employee_name, email_id, department, designation], (err, rows, fields) => {
//         if (!err) {
//             res.send(rows)
//         }
//         else {
//             res.send(err)
//         }
//     })
// }

module.exports.createEmployees = (req, res) => {
    
    mysqlConnection.query(`SELECT employee_id FROM ${database}.employees`, (err, rows, fields) => {
        if (!err) {
            console.log(rows);
            console.log(rows.length)
            var employee_id;

            if(rows.length != 0){
                console.log("Filled ahe!")
                console.log(rows[0].employee_id.replace(/\D/g, ''));
                let temp = [];
                // console.log();
                for (let i = 0; i < rows.length; i++) {
                    temp[i] = parseInt(rows[i].employee_id.replace(/\D/g, ''), 10);
                }
                console.log(temp);
                // console.log(temp.replace(/\D/g, ''));   
                let emp = "emp";
                // let data = rows[0].employee_id.replace(/\D/g, '');
                let data = Math.max(...temp);
                console.log(data);
                data++;
                employee_id = emp + data;
                
            }else {
                console.log("Empty ahe!")
                employee_id = "emp1"
            }
                console.log(employee_id);

            let sql = `insert into ${database}.employees set employee_id =?, employee_name=?, email_id = ?, department= ?, designation=?`;
            let {employee_name, email_id, department, designation} = req.body; //destructoring

            mysqlConnection.query(sql, [employee_id, employee_name, email_id, department, designation], (err, rows, fields) => {
                if(!err){
                        res.send(rows);
                    }
                    else {
                        // res.status(342).json({
                        //     status: false,
                        //     error: err.sqlMessage,
                        //     user: null
                        //   })
                        // res.send(err.sqlMessage);
                        res.send(err);
                        console.log(err.sqlMessage);
                        // res.status(401).json({
                        //     message: "Duplicate Data"
                        // })
                    }
            })
        } else {
            res.send(err)
        }
    })

}

module.exports.updateEmployee = (req, res) => {
    let sql = `update ${database}.employees set employee_name=?, email_id = ?, department= ?, designation=? where employee_id =? `;
    let {employee_id} = req.params;
    let {employee_name, email_id, department, designation} = req.body; //destructoring

    mysqlConnection.query(sql, [employee_name, email_id, department, designation, employee_id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else {
            res.send(err)
        }
    })
}

module.exports.deleteEmployee = (req, res) => {
    let sql = `delete from ${database}.employees where employee_id =?`;
    let {employee_id} = req.params;

    mysqlConnection.query(sql, [employee_id], (err, rows, fields) => {
        if (!err) {
            res.send(rows)
        }
        else {
            res.send(err)
        }
    })
}


module.exports.getEmployee = (req, res) => {
    let {employee_id} = req.params;
    mysqlConnection.query(`select * from ${database}.employees where employee_id = ?`,[employee_id], (err, rows, fields) => {
        if (!err){
            res.send(rows)
        }else{
            res.send(err)
        }
    })
}


