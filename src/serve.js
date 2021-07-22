const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.use(require('./routes/routes_MYSQL'));
app.use(require("./routes/routes_SQL_S"));
app.use(require("./routes/routes_FileUpload"));

app.listen((process.env.PORT = process.env.PORT || 3000), () => {
  console.log(`Escuchando en el puerto ${process.env.PORT}`);
});
