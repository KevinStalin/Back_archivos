const sql = require('mssql');
const config = require('./credencialesSQL');

let getConnectionSql = async() => {
    try {
        const pool = await sql.connect(config);
        return pool;
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getConnectionSql, sql };