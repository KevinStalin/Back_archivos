const express = require('express');
const app = express();

const config = require("../conexion/credencialesSQL");
const sqlConnection = require("../conexion/conexion_SQL_S");
const sql = new sqlConnection(config);

// (async() => {
//     try {
//         let select = await sql.select("select * from Inventory");
//         console.log(select.recordset);
//         console.log(select);
//     } catch (error) {
//         sql.close();
//         console.log(error);
//     }
// })();
let getDataSelect = async() => {
    try {
        let select = await sql.ejecuta("select * from Inventory");
        // console.log(select.recordset);
        // console.log(select);
        return select.recordset;
    } catch (error) {
        sql.close();
        console.log(error);
    }
}
app.get('/API/mostrar2', (req, res) => {
    getDataSelect()
        .then(data => {
            res.json(data);
        })
        .catch()
});



module.exports = app;