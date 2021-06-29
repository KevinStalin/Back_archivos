const express = require('express');
const app = express();
const { getConnectionSql, sql } = require('../conexion/conexion_SQLServer');

// const config = require("../conexion/credencialesSQL");
// const sqlConnection = require("../conexion/conexion_SQL_S");
// const sql = new sqlConnection(config);

/* //respuesta del SQL-server
{
  recordsets: [],
  recordset: undefined,
  output: {},
  rowsAffected: [ 1 ]
}
*/


app.get('/API/ingresaS', async(req, res) => {
    const pool = await getConnectionSql();
    const result = await pool.request().query('select * from TB_DEPORTISTA');
    console.log(result);

    res.json(result);

});

app.get('/API/inserta', async(req, res) => {
    const pool = await getConnectionSql();
    for (i = 0; i < 20; i++) {
        nombre = `nombre${i}`;
        const respuesta = await pool.request()
            .input('name', sql.VarChar, nombre)
            .input('id', sql.Int, i)
            .input('q', sql.Int, 100 + i)
            .query("insert into Inventory(id,name,quantity) values(@id,@name,@q)");
        if (respuesta.rowsAffected.length == 1) {
            console.log(`Insertado ${nombre}`);
        } else {
            console.log(`No se pudo insertar ${nombre}`);
        }
        // console.log(respuesta);
    }
    // insert into Inventory(name) values ('SR')

    res.send('Metodo');
});


module.exports = app;

/*
 console.log(e);
        uploadPath = __dirname + '/uploads/' + e.name;
        if (existeArchivo(uploadPath)) {
            return res.status(400).json({
                ok: false,
                message: `Archivo ${e.name} ya existe`
            });
        } else {
            let fecha = new Date();
            let Fecha = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
            console.log(fecha.getDate(), fecha.getMonth(), fecha.getFullYear(), fecha.getHours(), fecha.getMinutes(), fecha.getSeconds());

            setDataUpload(Fecha, req.body.user, e.name, 'prueba.pdf').then((msg) => {
                e.mv(uploadPath, function(err) {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err,
                            msg
                        });
                    }
                    res.json({
                        ok: true,
                        message: "archivo cargado" + uploadPath
                    });
                });
            }).catch(err => {
                console.log("Error en la consulta", err);
            });
        }
    });

*/
// *****************
/*
for (e of sampleFile) {
        uploadPath += e.name;
        if (existeArchivo(uploadPath)) {
            return res.status(400).json({
                ok: false,
                message: `Archivo ${e.name} ya existe`
            });
        } else {
            setDataUpload(Fecha, req.body.user, e.name, 'prueba.pdf').then((msg) => {
                e.mv(uploadPath, function (err) {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err,
                            msg
                        });
                    }
                    res.json({
                        ok: true,
                        message: "archivo cargado" + uploadPath
                    });
                });
            }).catch(err => {
                console.log("Error en la consulta", err);
            });
        }
    }
*/