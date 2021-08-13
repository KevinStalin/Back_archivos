const e = require("express");
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const fs = require("fs");
const xlsxFile = require("read-excel-file/node");
const xlsx = require("xlsx");
const path = require("path");
// default options
app.use(fileUpload());

// const config = require("../conexion/credencialesSQL");
// const sqlConnection = require("../conexion/conexion_SQL_S");
// const sql = new sqlConnection(config);

const { getConnectionSql, sql } = require("../conexion/conexion_SQLServer");

let existeArchivo = (path) => {
  try {
    fs.accessSync(path);
  } catch (err) {
    // console.log("NNo existe");
    return false;
  }
  // console.log("Existe");
  return true;
};

app.post("/API/upload", async (req, res) => {
  let sampleFile;
  let uploadPath;
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "Nungun archivo cargado",
    });
  }
  // console.log('req.files >>>', req.files); // eslint-disable-line
  sampleFile = req.files.files;
  uploadPath = __dirname + "/uploads/";
  uploadPath2 = __dirname + "/PDF/";
  file1 = sampleFile[0].name;
  file2 = sampleFile[1].name;
  arch1 = existeArchivo(uploadPath + sampleFile[0].name);
  arch2 = existeArchivo(uploadPath2 + sampleFile[1].name);
  if (arch1) {
    return res.json({
      ok: false,
      message: `Archivo ${sampleFile[0].name} ya existe`,
    });
  }

  if (arch2) {
    return res.json({
      ok: false,
      message: `Archivo ${sampleFile[1].name} ya existe`,
    });
  }

  sampleFile[0].mv(uploadPath + sampleFile[0].name, function (err) {
    if (err) {
      // return res.status(500).json({
      //     ok: false,
      //     err
      // });
      console.log("Error al mover xlsx " + err);
    }
  });

  sampleFile[1].mv(uploadPath2 + sampleFile[1].name, function (err) {
    if (err) {
      // return res.status(500).json({
      //     ok: false,
      //     err
      // });
      console.log("Error al mover pdf " + err);
    }
  });

  // usuario = "Kevin";
  usuario = req.body.user;
  let fecha = new Date();
  let Fecha =
    fecha.getDate() +
    "/" +
    (fecha.getMonth()+1) +
    "/" +
    fecha.getFullYear() +
    " " +
    fecha.getHours() +
    ":" +
    fecha.getMinutes() +
    ":" +
    fecha.getSeconds();

  /**
   * Insertar en la Base de datos
   * Usuario , XLSX, PDF Ingresados
   */
  const pool = await getConnectionSql();
  const ingreso1 = await pool
    .request()
    .input("fecha", sql.VarChar, Fecha)
    .input("usuario", sql.VarChar, usuario)
    .input("xlsx", sql.VarChar, file1)
    .input("pdf", sql.VarChar, file2)
    .query(
      "insert into TB_REGISTRO(fecha,usuario,XLSX,PDF) values (@fecha,@usuario,@xlsx,@pdf);"
    );
  if (ingreso1.rowsAffected.length == 1) {
    console.log(`Insertado:${Fecha}-${usuario},${file1},${file2}`);
  } else {
    console.log(`No se pudo insertar: ${Fecha}-${usuario},${file1},${file2}`);
  }

  /**
   * LECTURA DEL ARCHIVO XLSX
   * Ingreso de datos a la base SQL
   */
  console.log("leyendo archivo ", file1);
  xlsxFile(__dirname + "/uploads/" + file1)
    .then((rows) => {
      getRespuestaCarga(rows)
        .then((carga) => {
          console.log("Mensaje Carga", carga);
          res.json({
            ok: true,
            message: `archivos cargados ${file1} en ${uploadPath} y ${file2} en ${uploadPath2} `,
          });
        })
        .catch((e) => {
          console.log("Mensaje Err en la carga", e);
        });
    })
    .catch((err) => {
      console.log("Error en la lectura del archivo ", err.message);
    });
});

// trataDT("Test.xlsx");
function trataDT(file1) {
  xlsxFile(__dirname + "/uploads/" + file1)
    .then((rows) => {
      getRespuestaCarga(rows)
        .then((carga) => {
          console.log("Mensaje Carga", carga);
        })
        .catch((e) => {
          console.log("Mensaje Err", e);
        });
    })
    .catch((err) => {
      console.log("Error en la lectura del archivo ", err.message);
    });
}

let getRespuestaCarga = async (rows) => {
  // let res = await cargaBDD(rows);
  // let res = await nuevaCargaBDD(rows);
  let res = await CargaBDD_final(rows);
  return res;
};
function eliminarDiacriticosEs(texto) {
  return texto
    .normalize("NFD")
    .replace(
      /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
      "$1"
    )
    .normalize();
}
  // TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,id_genero,id_etnia)
let nuevaCargaBDD = async (rows) => {
  console.log("Metodo para caragr *DATOS*");
  const pool = await getConnectionSql();
  for (fila = 1; fila < rows.length; fila++) {
    // aumentar el cero en las cedulas
    if (rows[fila][1].length < 10) {
      rows[fila][1] = "0" + rows[fila][1];
    }

    rows[fila][4] = eliminarDiacriticosEs(rows[fila][4].trim().toUpperCase());
    rows[fila][5] = eliminarDiacriticosEs(rows[fila][5].trim().toUpperCase());
    rows[fila][8] = eliminarDiacriticosEs(rows[fila][8].trim().toUpperCase());
    rows[fila][9] = eliminarDiacriticosEs(rows[fila][9].trim().toUpperCase());
    rows[fila][13] = eliminarDiacriticosEs(rows[fila][13].trim().toUpperCase());
    rows[fila][14] = eliminarDiacriticosEs(rows[fila][14].trim().toUpperCase());
    rows[fila][17] = eliminarDiacriticosEs(rows[fila][17].trim().toUpperCase());
    rows[fila][18] = eliminarDiacriticosEs(rows[fila][18].trim().toUpperCase());
    rows[fila][19] = eliminarDiacriticosEs(rows[fila][19].trim().toUpperCase());
    rows[fila][23] = eliminarDiacriticosEs(rows[fila][23].trim().toUpperCase());

    const id_etnia = await pool
      .request()
      .query(
        `SELECT id_etnia AS ID FROM TB_ETNIA where etnia='${rows[fila][13]}';`
      );
    const id_genero = await pool
      .request()
      .query(
        `SELECT id_genero AS ID FROM TB_GENERO WHERE genero='${rows[fila][4]}';`
      );
    const id_federacion = await pool
      .request()
      .query(
        `SELECT id_federacion AS ID FROM TB_FEDERACION WHERE federacion='${rows[fila][17]}';`
      );
    const id_disciplina = await pool
      .request()
      .query(
        `SELECT id_disciplina AS ID FROM TB_DISCIPLINA WHERE disciplina='${rows[fila][19]}';`
      );
    const id_categoria_edad = await pool
      .request()
      .query(
        `SELECT id_categoria_edad AS ID FROM TB_CATEGORIA_EDAD WHERE categoria_edad='${rows[fila][5]}';`
      );
    const id_provincia = await pool
      .request()
      .query(
        `SELECT id_provincia AS ID FROM TB_PROVINCIA WHERE provincia='${rows[fila][8]}';`
      );
    const id_categoria_proyecto = await pool
      .request()
      .query(
        `SELECT id_categoria AS ID FROM TB_CATEGORIA_PROYECTO WHERE categoria_proyecto='${rows[fila][9]}';`
      );
    const id_deporte = await pool
      .request()
      .query(
        `SELECT id_deporte AS ID FROM TB_DEPORTE WHERE deporte='${rows[fila][18]}';`
      );
    const id_sector = await pool
      .request()
      .query(
        `SELECT id_sector AS ID FROM TB_SECTOR WHERE sector='${rows[fila][14]}';`
      );
    const id_prueba = await pool
      .request()
      .query(
        `SELECT id_prueba AS ID FROM TB_PRUEBA WHERE prueba='${rows[fila][23]}';`
      );

    console.log(
      rows[fila][0],
      "Deportista->",
      rows[fila][1],
      rows[fila][6],
      rows[fila][7],
      // rows[fila][11],
      // rows[fila][12],
      rows[fila][4],
      "iD->",
      id_genero.recordset[0].ID,
      rows[fila][5],
      "iD->",
      id_categoria_edad.recordset[0].ID,
      rows[fila][8],
      "iD->",
      id_provincia.recordset[0].ID,
      rows[fila][9],
      "iD->",
      id_categoria_proyecto.recordset[0].ID,
      rows[fila][13],
      "iD->",
      id_etnia.recordset[0].ID,
      rows[fila][14],
      "iD->",
      id_sector.recordset[0].ID,
      rows[fila][17],
      "iD->",
      id_federacion.recordset[0].ID,
      rows[fila][18],
      "iD->",
      id_deporte.recordset[0].ID,
      rows[fila][19],
      "iD->",
      id_disciplina.recordset[0].ID,
      rows[fila][23],
      "iD->",
      id_prueba.recordset[0].ID
      // rows[fila][16],
      // rows[fila][17],
      // rows[fila][18],
      // rows[fila][19],
      // rows[fila][20],
      // rows[fila][5],
      // rows[fila][8],
      // rows[fila][9],
      // rows[fila][10]
      // rows[fila][14],
      // rows[fila][15],
    );

    const ingreso = await pool
      .request()
      .input("id_genero", sql.Int, id_genero.recordset[0].ID)
      .input("id_federacion", sql.Int, id_federacion.recordset[0].ID)
      .input("id_disciplina", sql.Int, id_disciplina.recordset[0].ID)
      .input("id_categoria_edad", sql.Int, id_categoria_edad.recordset[0].ID)
      .input("id_provincia", sql.Int, id_provincia.recordset[0].ID)
      .input("id_categoria", sql.Int, id_categoria_proyecto.recordset[0].ID)
      .input("id_deporte", sql.Int, id_deporte.recordset[0].ID)
      .input("id_sector", sql.Int, id_sector.recordset[0].ID)
      .input("id_prueba", sql.Int, id_prueba.recordset[0].ID)
      .input("id_etnia", sql.Int, id_etnia.recordset[0].ID)
      .input("valor_mensual", sql.VarChar, rows[fila][10])
      .input("anio", sql.VarChar, rows[fila][16])
      .input("cedula", sql.VarChar, rows[fila][1])
      .input("edad", sql.VarChar, rows[fila][12])
      .input("nombre", sql.VarChar, rows[fila][6])
      .input("apellido", sql.VarChar, rows[fila][7])
      .input("fecha_nacimiento", sql.VarChar, rows[fila][11])
      .input("mes", sql.VarChar, rows[fila][15])
      .query(
        "INSERT INTO TB_ALTO_RENDIMIENTO(id_genero,id_federacion,id_disciplina,id_categoria_edad,id_provincia,id_categoria,id_deporte,id_sector,id_prueba,id_etnia,valor_mensual,anio,cedula,edad,nombre,apellido,fecha_nacimiento,mes) values(@id_genero,@id_federacion,@id_disciplina,@id_categoria_edad,@id_provincia,@id_categoria,@id_deporte,@id_sector,@id_prueba,@id_etnia,@valor_mensual,@anio,@cedula,@edad,@nombre,@apellido,@fecha_nacimiento,@mes);"
      );
    if (ingreso.rowsAffected.length == 1) {
      console.log(`Insertado N:-> ${rows[fila][0]}`);
    } else {
      console.log(`No se pudo insertar ${rows[fila][0]}`);
    }
  }
  return "Carga completa";
};
let CargaBDD_final = async (rows) => {
  const pool = await getConnectionSql();
  for (fila = 1; fila < rows.length; fila++) {
    // aumentar el cero en las cedulas
    if (rows[fila][1].length < 10) {
      rows[fila][1] = "0" + rows[fila][1];
    }

    rows[fila][2] = eliminarDiacriticosEs(rows[fila][2].trim().toUpperCase());
    rows[fila][3] = eliminarDiacriticosEs(rows[fila][3].trim().toUpperCase());
    rows[fila][6] = eliminarDiacriticosEs(rows[fila][6].trim().toUpperCase());
    rows[fila][7] = eliminarDiacriticosEs(rows[fila][7].trim().toUpperCase());
    rows[fila][11] = eliminarDiacriticosEs(rows[fila][11].trim().toUpperCase());
    rows[fila][12] = eliminarDiacriticosEs(rows[fila][12].trim().toUpperCase());
    rows[fila][15] = eliminarDiacriticosEs(rows[fila][15].trim().toUpperCase());
    rows[fila][16] = eliminarDiacriticosEs(rows[fila][16].trim().toUpperCase());
    rows[fila][17] = eliminarDiacriticosEs(rows[fila][17].trim().toUpperCase());
    rows[fila][18] = eliminarDiacriticosEs(rows[fila][18].trim().toUpperCase());

    const id_etnia = await pool
      .request()
      .query(
        `SELECT id_etnia AS ID FROM TB_ETNIA where etnia='${rows[fila][11]}';`
      );
    const id_genero = await pool
      .request()
      .query(
        `SELECT id_genero AS ID FROM TB_GENERO WHERE genero='${rows[fila][2]}';`
      );
    const id_federacion = await pool
      .request()
      .query(
        `SELECT id_federacion AS ID FROM TB_FEDERACION WHERE federacion='${rows[fila][15]}';`
      );
    const id_disciplina = await pool
      .request()
      .query(
        `SELECT id_disciplina AS ID FROM TB_DISCIPLINA WHERE disciplina='${rows[fila][17]}';`
      );
    const id_categoria_edad = await pool
      .request()
      .query(
        `SELECT id_categoria_edad AS ID FROM TB_CATEGORIA_EDAD WHERE categoria_edad='${rows[fila][3]}';`
      );
    const id_provincia = await pool
      .request()
      .query(
        `SELECT id_provincia AS ID FROM TB_PROVINCIA WHERE provincia='${rows[fila][6]}';`
      );
    const id_categoria_proyecto = await pool
      .request()
      .query(
        `SELECT id_categoria AS ID FROM TB_CATEGORIA_PROYECTO WHERE categoria_proyecto='${rows[fila][7]}';`
      );
    const id_deporte = await pool
      .request()
      .query(
        `SELECT id_deporte AS ID FROM TB_DEPORTE WHERE deporte='${rows[fila][16]}';`
      );
    const id_sector = await pool
      .request()
      .query(
        `SELECT id_sector AS ID FROM TB_SECTOR WHERE sector='${rows[fila][12]}';`
      );
    const id_prueba = await pool
      .request()
      .query(
        `SELECT id_prueba AS ID FROM TB_PRUEBA WHERE prueba='${rows[fila][18]}';`
      );

    const ingreso = await pool
      .request()
      .input("id_genero", sql.Int, id_genero.recordset[0].ID)
      .input("id_federacion", sql.Int, id_federacion.recordset[0].ID)
      .input("id_disciplina", sql.Int, id_disciplina.recordset[0].ID)
      .input("id_categoria_edad", sql.Int, id_categoria_edad.recordset[0].ID)
      .input("id_provincia", sql.Int, id_provincia.recordset[0].ID)
      .input("id_categoria", sql.Int, id_categoria_proyecto.recordset[0].ID)
      .input("id_deporte", sql.Int, id_deporte.recordset[0].ID)
      .input("id_sector", sql.Int, id_sector.recordset[0].ID)
      .input("id_prueba", sql.Int, id_prueba.recordset[0].ID)
      .input("id_etnia", sql.Int, id_etnia.recordset[0].ID)
      .input("valor_mensual", sql.VarChar, rows[fila][8])
      .input("anio", sql.VarChar, rows[fila][14])
      .input("cedula", sql.VarChar, rows[fila][1])
      .input("edad", sql.VarChar, rows[fila][10])
      .input("nombre", sql.VarChar, rows[fila][4])
      .input("apellido", sql.VarChar, rows[fila][5])
      .input("fecha_nacimiento", sql.VarChar, rows[fila][9])
      .input("mes", sql.VarChar, rows[fila][13])
      .query(
        "INSERT INTO TB_ALTO_RENDIMIENTO(id_genero,id_federacion,id_disciplina,id_categoria_edad,id_provincia,id_categoria,id_deporte,id_sector,id_prueba,id_etnia,valor_mensual,anio,cedula,edad,nombre,apellido,fecha_nacimiento,mes) values(@id_genero,@id_federacion,@id_disciplina,@id_categoria_edad,@id_provincia,@id_categoria,@id_deporte,@id_sector,@id_prueba,@id_etnia,@valor_mensual,@anio,@cedula,@edad,@nombre,@apellido,@fecha_nacimiento,@mes);"
      );
    if (ingreso.rowsAffected.length == 1) {
      console.log(`Insertado N:-> ${rows[fila][0]}`);
    } else {
      console.log(`No se pudo insertar ${rows[fila][0]}`);
    }
  }
  return "Carga completa";
};

let cargaBDD = async (rows) => {
  const pool = await getConnectionSql();
  console.log("Cantidad Columnas: ", rows[3].length);
  console.log("Cantidad Filas: ", rows.length - 3 - 1);
  for (fila = 4; fila < rows.length; fila++) {
    console.log("Cedula-->", rows[fila][1]);
    const ingreso2 = await pool
      .request()
      .input("cedula", sql.VarChar, rows[fila][1])
      .input("federacion", sql.VarChar, rows[fila][2])
      .input("deporte", sql.VarChar, rows[fila][3])
      .input("diciplina_discapacidad", sql.VarChar, rows[fila][4])
      .input("prueba", sql.VarChar, rows[fila][4])
      .input("genero", sql.VarChar, rows[fila][6])
      .input("categoriedad", sql.VarChar, rows[fila][7])
      .input("nombres", sql.VarChar, rows[fila][8])
      .input("apellidos", sql.VarChar, rows[fila][9])
      .input("provincia_representacion", sql.VarChar, rows[fila][10])
      .input("categoria", sql.VarChar, rows[fila][11])
      .input("valor_mensual", sql.VarChar, rows[fila][12])
      .input("num_meses", sql.VarChar, rows[fila][13])
      .input("valor_total", sql.VarChar, rows[fila][14])
      .input("fecha_nacimiento", sql.VarChar, rows[fila][15])
      .input("edad", sql.VarChar, rows[fila][16])
      .input("correo", sql.VarChar, rows[fila][17])
      .input("numero_telefno", sql.VarChar, rows[fila][18])
      .input("etnia", sql.VarChar, rows[fila][19])
      .input("sector", sql.VarChar, rows[fila][20])
      .input("mes", sql.VarChar, rows[fila][21])
      .input("anio", sql.VarChar, rows[fila][22])
      // .query("insert into TB_DEPORTISTA(cedula,nombre,apellido,fecha_nacimiento,edad,correo,num_telefono,etnia,id_genero) values (@cedula,@nombre,@apellido,@fecha_nacimiento,@edad,@correo,@num_telefono,@etnia,@id_genero);");
      .query(
        "insert into TBG_ALTO_RENDIMIENTO(cedula,federacion,deporte,diciplina_discapacidad,prueba,genero,categoriedad,nombres,apellidos,provincia_representacion,categoria,valor_mensual,num_meses,valor_total,fecha_nacimiento,edad,correo,numero_telefno,etnia,sector,mes,anio) values (@cedula,@federacion,@deporte,@diciplina_discapacidad,@prueba,@genero,@categoriedad,@nombres,@apellidos,@provincia_representacion,@categoria,@valor_mensual,@num_meses,@valor_total,@fecha_nacimiento,@edad,@correo,@numero_telefno,@etnia,@sector,@mes,@anio)"
      );
    if (ingreso2.rowsAffected.length == 1) {
      console.log(`Insertado N:-> ${rows[fila][0]}`);
    } else {
      console.log(`No se pudo insertar ${rows[fila][0]}`);
    }
  }
  return "Datos Cargados BDD";
};

app.get("/API/envioExcel/:id", (req, res) => {
  // console.log(__dirname + "/uploads/" + req.params.id);
  res.sendFile(path.resolve(__dirname + "/uploads/" + req.params.id));
});
app.get("/API/envioPDF/:id", (req, res) => {
  res.sendFile(path.resolve(__dirname + "/PDF/" + req.params.id));
});

app.get("/API/envioFormato", (req, res) => {
  // console.log(__dirname + "/Formato.xlsx");
  res.sendFile(path.resolve(__dirname + "/Formato.xlsx"));
});

module.exports = app;
