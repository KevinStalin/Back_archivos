const e = require('express');
const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const xlsxFile = require('read-excel-file/node');
const xlsx = require('xlsx');
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
    arch1 = existeArchivo(uploadPath + sampleFile[0].name)
        //**arch2 = existeArchivo(uploadPath + sampleFile[1].name)
    if (arch1) {
        return res.json({
            ok: false,
            message: `Archivo ${sampleFile[0].name} ya existe`
        });
    }
    /*
        if (arch2) {
            return res.status(400).json({
                ok: false,
                message: `Archivo ${sampleFile[1].name} ya existe`
            });
        }
    */
    sampleFile[0].mv(uploadPath + sampleFile[0].name, function(err) {
        if (err) {
            // return res.status(500).json({
            //     ok: false,
            //     err
            // });
            console.log("Error al mover 1 " + err);
        }
    });
    /*
        sampleFile[1].mv(uploadPath + sampleFile[1].name, function(err) {
            if (err) {
                // return res.status(500).json({
                //     ok: false,
                //     err
                // });
                console.log("Error al mover 2 " + err);
            }
        });
    */
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
    /*
    getRespuestaCarga(file1)
        .then(resCarga => {
            console.log(resCarga);
            

        })
        .catch();
        */

    console.log("leyendo archivo ", file1)
    xlsxFile(__dirname + '/uploads/' + file1)
        .then(rows => {
            getRespuestaCarga(rows)
                .then(carga => {
                    console.log("Mensaje Carga", carga);
                    res.json({
                        ok: true,
                        message: `archivos cargados ${file1} y ${file2} en ${uploadPath} `
                    });
                })
                .catch(e => {
                    console.log("Mensaje Err", e);
                })
        })
        .catch(err => {
            console.log("Error en la lectura del archivo ", err.message);
        });
});
let getRespuestaCarga = async(rows) => {
    let res = await cargaBDD(rows);
    // let res = await nuevaCargaBDD(rows);
    return res;
}
let nuevaCargaBDD = async(rows) => {
    const pool = await getConnectionSql();
    for (fila = 4; fila < rows.length; fila++) {
        if (numero[0] == 'O') {
            console.log("Tiene O");
            resultado = numero.padStart(10, "0");
        }
        if (numero[0] == "`") {
            console.log("Biñeta");
        }
/*
        const ingreso2 = await pool.request()
            .input('cedula', sql.VarChar, rows[fila][1])
            .input('federacion', sql.VarChar, rows[fila][2])
            .input('deporte', sql.VarChar, rows[fila][3])
            .input('diciplina_discapacidad', sql.VarChar, rows[fila][4])
            .input('prueba', sql.VarChar, rows[fila][4])
            .input('genero', sql.VarChar, rows[fila][6])
            .input('categoriedad', sql.VarChar, rows[fila][7])
            .input('nombres', sql.VarChar, rows[fila][8])
            .input('apellidos', sql.VarChar, rows[fila][9])
            .input('provincia_representacion', sql.VarChar, rows[fila][10])
            .input('categoria', sql.VarChar, rows[fila][11])
            .input('valor_mensual', sql.VarChar, rows[fila][12])
            .input('num_meses', sql.VarChar, rows[fila][13])
            .input('valor_total', sql.VarChar, rows[fila][14])
            .input('fecha_nacimiento', sql.VarChar, rows[fila][15])
            .input('edad', sql.VarChar, rows[fila][16])
            .input('correo', sql.VarChar, rows[fila][17])
            .input('numero_telefno', sql.VarChar, rows[fila][18])
            .input('etnia', sql.VarChar, rows[fila][19])
            .input('sector', sql.VarChar, rows[fila][20])
            .input('mes', sql.VarChar, rows[fila][21])
            .input('anio', sql.VarChar, rows[fila][22])
            // .query("insert into TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,correo,num_telefono,etnia,id_genero) values (@cedula,@nombre,@apellido,@fecha_nacimiento,@edad,@correo,@num_telefono,@etnia,@id_genero);");
            .query("insert into TBG_ALTO_RENDIMIENTO(cedula,federacion,deporte,diciplina_discapacidad,prueba,genero,categoriedad,nombres,apellidos,provincia_representacion,categoria,valor_mensual,num_meses,valor_total,fecha_nacimiento,edad,correo,numero_telefno,etnia,sector,mes,anio) values (@cedula,@federacion,@deporte,@diciplina_discapacidad,@prueba,@genero,@categoriedad,@nombres,@apellidos,@provincia_representacion,@categoria,@valor_mensual,@num_meses,@valor_total,@fecha_nacimiento,@edad,@correo,@numero_telefno,@etnia,@sector,@mes,@anio)")
*/
    }
}

let cargaBDD = async(rows) => {
    const pool = await getConnectionSql();
    console.log("Cantidad Columnas: ", rows[3].length);
    console.log("Cantidad Filas: ", rows.length - 3 - 1);
    for (fila = 4; fila < rows.length; fila++) {
        console.log("Cedula-->", rows[fila][1]);
        const ingreso2 = await pool.request()
            .input('cedula', sql.VarChar, rows[fila][1])
            .input('federacion', sql.VarChar, rows[fila][2])
            .input('deporte', sql.VarChar, rows[fila][3])
            .input('diciplina_discapacidad', sql.VarChar, rows[fila][4])
            .input('prueba', sql.VarChar, rows[fila][4])
            .input('genero', sql.VarChar, rows[fila][6])
            .input('categoriedad', sql.VarChar, rows[fila][7])
            .input('nombres', sql.VarChar, rows[fila][8])
            .input('apellidos', sql.VarChar, rows[fila][9])
            .input('provincia_representacion', sql.VarChar, rows[fila][10])
            .input('categoria', sql.VarChar, rows[fila][11])
            .input('valor_mensual', sql.VarChar, rows[fila][12])
            .input('num_meses', sql.VarChar, rows[fila][13])
            .input('valor_total', sql.VarChar, rows[fila][14])
            .input('fecha_nacimiento', sql.VarChar, rows[fila][15])
            .input('edad', sql.VarChar, rows[fila][16])
            .input('correo', sql.VarChar, rows[fila][17])
            .input('numero_telefno', sql.VarChar, rows[fila][18])
            .input('etnia', sql.VarChar, rows[fila][19])
            .input('sector', sql.VarChar, rows[fila][20])
            .input('mes', sql.VarChar, rows[fila][21])
            .input('anio', sql.VarChar, rows[fila][22])
            // .query("insert into TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,correo,num_telefono,etnia,id_genero) values (@cedula,@nombre,@apellido,@fecha_nacimiento,@edad,@correo,@num_telefono,@etnia,@id_genero);");
            .query("insert into TBG_ALTO_RENDIMIENTO(cedula,federacion,deporte,diciplina_discapacidad,prueba,genero,categoriedad,nombres,apellidos,provincia_representacion,categoria,valor_mensual,num_meses,valor_total,fecha_nacimiento,edad,correo,numero_telefno,etnia,sector,mes,anio) values (@cedula,@federacion,@deporte,@diciplina_discapacidad,@prueba,@genero,@categoriedad,@nombres,@apellidos,@provincia_representacion,@categoria,@valor_mensual,@num_meses,@valor_total,@fecha_nacimiento,@edad,@correo,@numero_telefno,@etnia,@sector,@mes,@anio)")
        if (ingreso2.rowsAffected.length == 1) {
            console.log(`Insertado N:-> ${rows[fila][0]}`);
        } else {
            console.log(`No se pudo insertar ${rows[fila][0]}`);
        }
    }
    return "Datos Cargados BDD";
}


app.post('/BDD', async(req, res) => {
    let sampleFile;
    let uploadPath;
    let fecha = new Date();
    let fecha_ingreso = fecha.getDate() + "/" + fecha.getMonth() + "/" + fecha.getFullYear() + " " + fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
    let usuario = req.body.user;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            message: "Nungun archivo cargadooo"
        });
    }
    // console.log('req.files >>>', req.files); // eslint-disable-line
    sampleFile = req.files.files;
    uploadPath = __dirname + '/uploads/';
    // console.log(sampleFile);
    console.log(sampleFile.length);
    if (sampleFile.length >= 2) {
        for (e of sampleFile) {
            let nombreArchivo = e.name;
            let nombreArr = nombreArchivo.split('.');
            let extencion = nombreArr[nombreArr.length - 1];
            if (extencion == 'xlsx' || extencion == 'pdf') {
                if (existeArchivo(uploadPath + nombreArchivo)) {
                    return res.status(400).json({
                        ok: false,
                        message: `Archivo ${nombreArchivo} ya existe`
                    });
                }
                e.mv(uploadPath + nombreArchivo, (err) => {
                    if (err) {
                        console.log(`Error al mover archivo ${nombreArchivo} : ${err.message}`);
                    }
                });
                /**
                 * Buscar una solucion al querer guardar los dos archivos    
                 * que estan siendo recorridos en este for
                 * asu vez ver como seguir ingresando si un usuario manda mas de 2 archivos
                 * como guardar
                 */

                const pool = await getConnectionSql();
                const ingreso1 = await pool.request()
                    .input('fecha', sql.VarChar, fecha_ingreso)
                    .input('usuario', sql.VarChar, usuario)
                    .input('xlsx', sql.VarChar, file1)
                    .input('pdf', sql.VarChar, file2)
                    .query("insert into TB_REGISTRO(fecha,usuario,XSLX,PDF) values (@fecha,@usuario,@xlsx,@pdf);")
                if (ingreso1.rowsAffected.length == 1) {
                    console.log(`Insertado:${Fecha}-${usuario},${file1},${file2}`);
                } else {
                    console.log(`No se pudo insertar: ${Fecha}-${usuario},${file1},${file2}`);
                }
                //Error asta aqui

            } else {
                res.status(400).json({
                    ok: false,
                    message: `Archvo ${e.name} rechazado Solo con extencion xlsx y pdf`
                });
            }
        }
    } else {

    }


    res.send('OK');
});

app.get('/API/envio', (req, res) => {
    // console.log(__dirname);
    // res.sendFile(__dirname + '/../public/Formato.xlsx');
    const excel = xlsx.readFile(__dirname + '/../public/Formato.xlsx')
    let nombreHoja = excel.SheetNames;
    // let data = xlsx.utils.
    const ller01 = new xlsx.FileRead();
    ller01.onload = (e) => {
        const bstr = e.target.result;
        console.log("BSRT-->", bstr);

    }

});

app.get('/API/envio2', (req, res) => {


});





module.exports = app;