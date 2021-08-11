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

let numerocedula='925906323';
console.log(numerocedula);
console.log(numerocedula.length);

if(numerocedula.length<10){
  numerocedula='0'+numerocedula;
}

console.log(numerocedula);