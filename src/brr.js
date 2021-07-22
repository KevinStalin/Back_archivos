numero = "O925906323";
// n1=O925906323

if (numero[0] == "O") {
  console.log("Tiene 'O'");
  nuevo = numero.replace(/[&\/\\#,+()$~%O.'":*``?<>{}]/g, "");
  console.log("RR->", nuevo);
  resultado = numero.padStart(10, 0);
  console.log("R_>", resultado);
  nR = Number(resultado);
  console.log("NR", nR);
  console.log("TNR", typeof resultado);
  // bb=Number(resultado)
  // console.log(bb)
  console.log(typeof resultado);
}
if (numero[0] == "`") {
  console.log("Biñeta");
}

cedula = Number();
// console.log(typeof(string));
// console.log(string);
console.log(typeof cedula);
console.log(cedula);

numero2 = "O7533120";

v = numero2.split("O");
console.log(v);

num = `0${v[1]}`;
console.log(num);
cedula2 = Number(`0${v[1]}`);
console.log(typeof cedula2);
console.log(cedula2);

// ******************/
// let getRespuestaCarga = async (rows) => {

app.post("/BDD", async (req, res) => {
  let sampleFile;
  let uploadPath;
  let fecha = new Date();
  let fecha_ingreso =
    fecha.getDate() +
    "/" +
    fecha.getMonth() +
    "/" +
    fecha.getFullYear() +
    " " +
    fecha.getHours() +
    ":" +
    fecha.getMinutes() +
    ":" +
    fecha.getSeconds();
  let usuario = req.body.user;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      message: "Nungun archivo cargadooo",
    });
  }
  // console.log('req.files >>>', req.files); // eslint-disable-line
  sampleFile = req.files.files;
  uploadPath = __dirname + "/uploads/";
  // console.log(sampleFile);
  console.log(sampleFile.length);
  if (sampleFile.length >= 2) {
    for (e of sampleFile) {
      let nombreArchivo = e.name;
      let nombreArr = nombreArchivo.split(".");
      let extencion = nombreArr[nombreArr.length - 1];
      if (extencion == "xlsx" || extencion == "pdf") {
        if (existeArchivo(uploadPath + nombreArchivo)) {
          return res.status(400).json({
            ok: false,
            message: `Archivo ${nombreArchivo} ya existe`,
          });
        }
        e.mv(uploadPath + nombreArchivo, (err) => {
          if (err) {
            console.log(
              `Error al mover archivo ${nombreArchivo} : ${err.message}`
            );
          }
        });
        /**
         * Buscar una solucion al querer guardar los dos archivos
         * que estan siendo recorridos en este for
         * asu vez ver como seguir ingresando si un usuario manda mas de 2 archivos
         * como guardar
         */

        const pool = await getConnectionSql();
        const ingreso1 = await pool
          .request()
          .input("fecha", sql.VarChar, fecha_ingreso)
          .input("usuario", sql.VarChar, usuario)
          .input("xlsx", sql.VarChar, file1)
          .input("pdf", sql.VarChar, file2)
          .query(
            "insert into TB_REGISTRO(fecha,usuario,XSLX,PDF) values (@fecha,@usuario,@xlsx,@pdf);"
          );
        if (ingreso1.rowsAffected.length == 1) {
          console.log(`Insertado:${Fecha}-${usuario},${file1},${file2}`);
        } else {
          console.log(
            `No se pudo insertar: ${Fecha}-${usuario},${file1},${file2}`
          );
        }
        //Error asta aqui
      } else {
        res.status(400).json({
          ok: false,
          message: `Archvo ${e.name} rechazado Solo con extencion xlsx y pdf`,
        });
      }
    }
  } else {
  }

  res.send("OK");
});
