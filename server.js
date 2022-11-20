const express = require('express');
const app = express();
const cors = require('cors');
// var bodyParser = require('body-parser');

// app.use(bodyParser.json())
app.use(express.json());
app.use(cors());

const dotenv = require('dotenv');

dotenv.config();
// sql12570631
let database = process.env.DB_NAME

const mysqlConnection = require('./src/config/dbconfig')
const port = 5000

const EmployeeRoutes = require('./src/routes/employee.routes');
const UserRoutes = require('./src/routes/users.routes');


mysqlConnection.connect((err) => {
    if (err) {
        console.log('Error in Connection', err)
    }
    else{
        console.log(database);
        console.log('Mysql Connection is Established');
    }
})

app.use('/employee', EmployeeRoutes);
app.use('/user', UserRoutes);

app.listen(port, () => {
    console.log(`Server is Running at ${port}`);
})