const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const xlsxFile = require('read-excel-file/node');
// default options
app.use(fileUpload());

// const config = require("../conexion/credencialesSQL");
// const sqlConnection = require("../conexion/conexion_SQL_S");
// const sql = new sqlConnection(config);

const { getConnectionSql, sql } = require('../conexion/conexion_SQLServer');

let existeArchivo = (path) => {
    try {
        fs.accessSync(path);
    } catch (err) {
        // console.log("NNo existe");
        return false;
    }
    // console.log("Existe");
    return true;
}

app.post('/API/upload', async(req, res) => {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: "Nungun archivo cargado"
        });
    }
    // console.log('req.files >>>', req.files); // eslint-disable-line
    sampleFile = req.files.files;
    uploadPath = __dirname + '/uploads/';
    file1 = sampleFile[0].name;
    file2 = sampleFile[1].name;
    // console.log("0__>", sampleFile[0]);
    // console.log("1-->", sampleFile[1]);
    arch1 = existeArchivo(uploadPath + sampleFile[0].name)
    arch2 = existeArchivo(uploadPath + sampleFile[1].name)
    if (arch1) {
        return res.status(400).json({
            ok: false,
            message: `Archivo ${sampleFile[0].name} ya existe`
        });
    } else if (arch2) {
        return res.status(400).json({
            ok: false,
            message: `Archivo ${sampleFile[1].name} ya existe`
        });
    }
    sampleFile[0].mv(uploadPath + sampleFile[0].name, function(err) {
        if (err) {
            // return res.status(500).json({
            //     ok: false,
            //     err
            // });
            console.log("Error al mover 1 " + err);
        }
    });
    sampleFile[1].mv(uploadPath + sampleFile[1].name, function(err) {
        if (err) {
            // return res.status(500).json({
            //     ok: false,
            //     err
            // });
            console.log("Error al mover 2 " + err);
        }
    });
    // usuario = "Kevin";
    usuario = req.body.user;
    let fecha = new Date();
    let Fecha = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();

    /**
     * Insertar en la Base de datos 
     * Usuario , CLSX, PDF Ingresados
     */
    const pool = await getConnectionSql();
    const ingreso1 = await pool.request()
        .input('fecha', sql.VarChar, Fecha)
        .input('usuario', sql.VarChar, usuario)
        .input('xlsx', sql.VarChar, file1)
        .input('pdf', sql.VarChar, file2)
        .query("insert into TB_REGISTRO(fecha,usuario,XSLX,PDF) values (@fecha,@usuario,@xlsx,@pdf);")
    if (ingreso1.rowsAffected.length == 1) {
        console.log(`Insertado:${Fecha}-${usuario},${file1},${file2}`);
    } else {
        console.log(`No se pudo insertar: ${Fecha}-${usuario},${file1},${file2}`);
    }

    /**
     * LECTURA DEL ARCHIVO XLSX     
     * Ingreso de datos a la base SQL
     */
     console.log("leyendo archivo ",file1)
    xlsxFile(__dirname + '/uploads/' + file1).then(async(rows) => {
        console.log("Cantidad Columnas: ",rows[3].length);
        console.log("Cantidad Filas: ",rows.length - 3 - 1);
        for (fila = 4; fila < 50; fila++) {
            // let deportista = []
            // console.log("D->", rows[fila][1]);
            // deportista.push(rows[fila][1]); //cedula
            console.log("Cedula-->", rows[fila][1]);
            TB_deportista_genero = 0;
            if (rows[fila][6] == 'H') { //genero
                // deportista.push(1);
                TB_deportista_genero = 1;
            } else if (rows[fila][6] == 'M') {
                // deportista.push(2);
                TB_deportista_genero = 2;
            }
            /*
                        deportista.push(rows[fila][8]); //nombre
                        deportista.push(rows[fila][9]); //pelido
                        deportista.push(rows[fila][15]); //fecha nacimiento
                        deportista.push(rows[fila][16]); //edad
                        deportista.push(rows[fila][17]); //correo
                        deportista.push(rows[fila][18]); //num telefono
                        deportista.push(rows[fila][19]); //etnia
            */
            const ingreso2 = await pool.request()
                .input('cedula', sql.Int, rows[fila][1])
                .input('nombre', sql.VarChar, rows[fila][8])
                .input('apellido', sql.VarChar, rows[fila][9])
                .input('fecha_nacimiento', sql.VarChar, rows[fila][15])
                .input('edad', sql.Int, rows[fila][16])
                .input('correo', sql.VarChar, rows[fila][17])
                .input('num_telefono', sql.Int, rows[fila][18])
                .input('etnia', sql.VarChar, rows[fila][19])
                .input('id_genero', sql.Int, TB_deportista_genero)
                .query("insert into TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,correo,num_telefono,etnia,id_genero) values (@cedula,@nombre,@apellido,@fecha_nacimiento,@edad,@correo,@num_telefono,@etnia,@id_genero);");
            if (ingreso2.rowsAffected.length == 1) {
                console.log(`Insertado N:-> ${rows[fila][0]}`);
            } else {
                console.log(`No se pudo insertar ${rows[fila][0]}`);
            }
        }

    }).catch(err => {
        console.log("Error en la lactura del archivo ", err.message);
    });

    res.json({
        ok: true,
        message: `archivos cargados ${file1} y ${file2} en ${uploadPath} `
    });

});


// app.get('/API/uploadBDD', (req, res) => {
//     // let deportistas = [];
//     xlsxFile(__dirname + '/uploads/01-01-2021.xlsx').then((rows) => {
//         // console.log(rows[3][1]);
//         // console.log(rows[3].length);
//         // console.log(rows.length - 3 - 1);
//         // console.log(typeof(rows));
//         // console.log(rows);
//         for (fila = 4; fila < 20; fila++) {
//             // let deportista = []
//             // console.log("D->", rows[fila][1]);
//             // deportista.push(rows[fila][1]); //cedula
//             TB_deportista_genero = 0;
//             if (rows[fila][6] == 'H') { //genero
//                 // deportista.push(1);
//                 TB_deportista_genero = 1;
//             } else if (rows[fila][6] == 'M') {
//                 // deportista.push(2);
//                 TB_deportista_genero = 2;
//             }
//             /*
//                         deportista.push(rows[fila][8]); //nombre
//                         deportista.push(rows[fila][9]); //pelido
//                         deportista.push(rows[fila][15]); //fecha nacimiento
//                         deportista.push(rows[fila][16]); //edad
//                         deportista.push(rows[fila][17]); //correo
//                         deportista.push(rows[fila][18]); //num telefono
//                         deportista.push(rows[fila][19]); //etnia
//             */
//             try {
//                 let select = sql.ejecuta(`insert into TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,correo,num_telefono,etnia,id_genero) values (${rows[fila][1]},'${rows[fila][8]}','${rows[fila][9]}','${rows[fila][15]}',${rows[fila][16]},'${rows[fila][17]}',${rows[fila][18]},'${rows[fila][19]}',${TB_deportista_genero});`);
//                 // return select.recordset;
//                 console.log(select.recordset);
//             } catch (error) {
//                 sql.close();
//                 console.log("Error Insertar");
//                 console.log(error);
//             }

//         }

//     }).catch(err => {
//         console.log("Error en la lactura del archivo ", err.message);
//     });


// });







// ***********************
/*
let guardar_BDD = async(id) => { 
    console.log("Metodo Guardar");
    try {
        console.log("ID->", id);
        let select = await sql.ejecuta(`insert into TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,correo,num_telefono,etnia,id_genero) values (${id},'Kevin','Ram','05/08/1998',23,'stalram@.com',0998007844,'mestizo',1);`);
        // let select = await sql.ejecuta(`SELECT * FROM  TB_DEPORTISTA`);
        // let select = await sql.ejecuta(``)
        // return select.recordset;
        // console.log("Select->", select);
        // console.log(select.rowsAffected);
        // console.log(select.rowsAffected.length);
        return { ok: select.rowsAffected.length, data: select.recordset, cantidad: select.rowsAffected }
    } catch (error) {
        sql.close();
        console.log("Error metodo asincor");
        console.log(error);
    }
}
app.get('/BDD', (req, res) => {
    for (id = 0; id < 20; id++) {
        guardar_BDD(id)
            .then(msg => {
                console.log(" MSG-> ", msg.ok, "Can->", msg.cantidad);
            })
            .catch(err => { console.log("Eeeor en guardar", err) });
    }
});
*/

module.exports = app;