const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ezonshar_mdepsaddb',
    port: 3306
});

connection.connect((error) => {
    if (error) {
        throw error;
    } else {
        console.log('Conexion correcta.');
    }
});

module.exports = connection;