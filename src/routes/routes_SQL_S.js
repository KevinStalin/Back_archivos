const express = require('express');
const app = express();
const { getConnectionSql, sql } = require('../conexion/conexion_SQLServer');

/* //respuesta del SQL-server
{
  recordsets: [],
  recordset: undefined,
  output: {},
  rowsAffected: [ 1 ]
}
*/


app.get('/API/reporte', async(req, res) => {
    const pool = await getConnectionSql();
    const result = await pool.request().query('select fecha,usuario,XSLX,PDF from TB_REGISTRO;');
    res.json(result.recordset);

});

/**
 * PAGINA REGISTROS
 */
//Federacion
// app.get('/API/muestra_federacion', async(req, res) => {
//     const pool = await getConnectionSql();
//     const result = await pool.request().query('select name,quantity from Inventory;');
//     res.json(result.recordset);
// });
app.get('/API/muestra_federacion', metodoMuestra('SELECT federacion FROM TB_FEDERACION ORDER BY federacion;'));

app.get('/API/muestra_provincia', metodoMuestra('SELECT provincia FROM TB_PROVINCIA ORDER BY provincia;'));

app.get('/API/muestra_deporte', metodoMuestra('SELECT deporte FROM TB_DEPORTE ORDER BY deporte;'));

function metodoMuestra(consuta) {
    return async(req, res) => {
        const pool = await getConnectionSql();
        const result = await pool.request().query(consuta);
        res.json(result.recordset);
    }
}
app.post('/API/Insert/federacion', async(req, res) => {
    let federacion = req.body.federacion;
    const pool = await getConnectionSql();
    const ingreso1 = await pool.request()
        .input('nuevo', sql.VarChar, federacion)
        .query("insert into TB_FEDERACION(federacion) values (@nuevo);")
    if (ingreso1.rowsAffected.length == 1) {
        console.log(`Insertado ${federacion}`);
        res.json({
            ok: true,
            message: `Insertado ${federacion}`
        });
    } else {
        res.json({
            ok: true,
            message: `No se pudo insertar: ${federacion}`
        });
        console.log(`No se pudo insertar: ${federacion}`);
    }

});
app.post('/API/Insert/provincia', async(req, res) => {
    let provincia = req.body.provincia;
    console.log(provincia);
    const pool = await getConnectionSql();
    const ingreso1 = await pool.request()
        .input('nuevo', sql.VarChar, provincia)
        .query("insert into TB_PROVINCIA(provincia) values (@nuevo);")
    if (ingreso1.rowsAffected.length == 1) {
        console.log(`Insertado ${provincia}`);
        res.json({
            ok: true,
            message: `Insertado ${provincia}`
        });
    } else {
        res.json({
            ok: true,
            message: `No se pudo insertar: ${provincia}`
        });
        console.log(`No se pudo insertar: ${provincia}`);
    }

});



/**
 * Validaciones asincronas Tablas
 */
app.get('/API/ASYNC/federacion/:fede', async(req, res) => {
    let federacion = req.params.fede;
    console.log(federacion);
    const pool = await getConnectionSql();
    const result = await pool.request()
        .input('name', sql.VarChar, federacion)
        .query(`select name from Inventory where name=@name`)
    if (result.rowsAffected.length == 1) {
        // console.log("Ya esta");
        res.json({
            ok: false,
            message: `Federacion: ${result.recordset.name} ya existe`,
        });
    } else {
        console.log("No esta");
        res.json({
            ok: true,
            message: "Federacion no encontrada",
        });
    }
});



// app.get('/API/inserta', async(req, res) => {
//     const pool = await getConnectionSql();
//     for (i = 0; i < 20; i++) {
//         nombre = `nombre${i}`;
//         const respuesta = await pool.request()
//             .input('name', sql.VarChar, nombre)
//             .input('id', sql.Int, i)
//             .input('q', sql.Int, 100 + i)
//             .query("insert into Inventory(id,name,quantity) values(@id,@name,@q)");
//         if (respuesta.rowsAffected.length == 1) {
//             console.log(`Insertado ${nombre}`);
//         } else {
//             console.log(`No se pudo insertar ${nombre}`);
//         }
//         // console.log(respuesta);
//     }
//     // insert into Inventory(name) values ('SR')

//     res.send('Metodo');
// });


module.exports = app;