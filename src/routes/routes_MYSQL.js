const express = require('express');
const app = express();

const connection_Mysql = require('../conexion/conexion_MYSQL');


app.get('/API/mostrar', (req, res) => {
    connection_Mysql.query('select * from th_roles;', (error, result) => {
        if (error) {
            console.log("Error en la consulya MYSQL");
            throw error;
        } else {
            // console.log(result);
            res.json(result);
        }
    });
    connection_Mysql.end();
});

app.get('/API/mensaje', (req, res) => {
    res.json({ "ok": "Mensaje Sevidorrrr" });
});


app.post('/API/login', (req, res) => {
    console.log("En el metodo");
    let body = req.body;
    let userData = {
        user: body.user,
        password: body.password
    }
    console.log(userData);
    connection_Mysql.query(`select U.cedula,R.id_rol,U.password from th_usuario as U,th_usuario_roles as R where U.id_usuario=R.id_usuario and cedula=${userData.user};`, (error, result) => {
        if (error) {
            console.log("Error en la consulta");
        } else {
            // console.log(typeof(result));
            // console.log("RESULT->", result);
            // console.log("PPAS->", result.password);
            // console.log(result.RowDataPacket);
            // if (result.password == undefined) {
            //     res.json({
            //         ok: false,
            //         message: "Usuario o contraseña invalidos"
            //     });
            // } else {
            result.forEach(element => {
                if (element.password == userData.password) {
                    res.json({
                        ok: true,
                        message: "Usuario valido",
                        rol: element.id_rol
                    });
                } else {
                    res.json({
                        ok: false,
                        message: "Usuario o contraseña invalidos"
                    });
                }
            });
            // }
        }

    });


});


module.exports = app;