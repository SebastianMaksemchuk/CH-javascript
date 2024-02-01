let usuario = "";
do {
  usuario = prompt("¡Bienvenido! \n Por favor ingrese su nombre:");
} while (usuario == null || usuario == "");


// Acceso con password
let password = prompt("Hola " + usuario + ".\nIngrese la contraseña de acceso:");
for (let i = 2; i > 0; i--) {
  if (password != 1234) {
    password = prompt("Contraseña incorrecta.\nIngrese la contraseña de acceso:");
  };
};
while (password != 1234) {
  password = prompt("Contraseña incorrecta.\nIngrese la contraseña de acceso:\n(la contraseña es 1234)");
};

// set stocks iniciales
let stock001 = 100;
let stock002 = 50;
let stock003 = 75;

// artículo seleccionado a modificar stock
let articulo = "";

// operación a realizar: agregar o quitar stock
let operacion = "";
let sumar = 0;
let restar = 0;

let repetir = ""

do {
  // seleecion de articulo
  articulo = prompt("Ingrese el código del artículo cuyo stock desea modificar.\n\n 001 - NT-Link (Stock: " + stock001 + ")\n 002 - NT-COM (Stock: " + stock002 + ")\n 003 - NT-WiFi (Stock: " + stock003 + ")");
  if (articulo == null) {
    break;
  }
  if (articulo != "001" && articulo != "002" && articulo != "003") {
    alert("Código inválido");
    continue;
  };
  // seleccion de opoeracion
  while (operacion != "+" && operacion != "-" && operacion != "null") {
    operacion = prompt("¿Qué operación desea realizar?\n ¿Agregar stock (+) o remover stock (-)?");
    if (operacion == null) {
      break;
    };
    if (operacion != "+" && operacion != "-" && operacion != "null") {
      alert("Operación inválida");
      continue;
    };
  };
  if (operacion == "+") {
    sumar = prompt("¿Cuántos artículos desea agregar al stock?\n(INGRESAR UNICAMENTE NUMEROS!!!)");
    sumar = parseInt(sumar);
    if (articulo == "001") {
      stock001 = stock001 + sumar;
      alert("Se agregaron " + sumar + " NT-Link al stock.\nStock actual: " + stock001);
      sumar = "";
    };
    if (articulo == "002") {
      stock002 = stock002 + sumar;
      alert("Se agregaron " + sumar + " NT-COM al stock.\nStock actual: " + stock002);
      sumar = "";
    };
    if (articulo == "003") {
      stock003 = stock003 + sumar;
      alert("Se agregaron " + sumar + " NT-WiFi al stock.\nStock actual: " + stock003);
      sumar = "";
    };
    operacion = ""
  };
  while (operacion == "-") {
    restar = prompt("¿Cuántos artículos desea remover del stock?\n(INGRESAR UNICAMENTE NUMEROS!!!)");
    restar = parseInt(restar);
    if (articulo == "001") {
      if (restar > stock001) {
        alert("Stock insuficiente");
        continue;
      };
      stock001 = stock001 - restar;
      alert("Se removieron " + restar + " NT-Link del stock.\nStock actual: " + stock001);
      restar = 0;
    };
    if (articulo == "002") {
      if (restar > stock002) {
        alert("Stock insuficiente");
        continue;
      };
      stock002 = stock002 - restar;
      alert("Se removieron " + restar + " NT-COM del stock.\nStock actual: " + stock002);
      restar = 0;
    };
    if (articulo == "003") {
      if (restar > stock003) {
        alert("Stock insuficiente");
        continue;
      };
      stock003 = stock003 - restar;
      alert("Se removieron " + restar + " NT-WiFi del stock.\nStock actual: " + stock003);
      restar = 0;
    };
    operacion = ""
  };
  if (operacion != null) {
    repetir = prompt("¿Desea realizar otra operación? (Y/n)");
  };
} while (articulo != "001" && articulo != "002" && articulo != "003" && repetir != "n" && repetir != "N" && repetir != "null" || operacion == null);

alert("Stock final:\n 001 - NT-Link: " + stock001 + "\n 002 - NT-COM: " + stock002 + "\n 003 - NT-WiFi: " + stock003)
console.log("Stock final:\n 001 - NT-Link: " + stock001 + "\n 002 - NT-COM: " + stock002 + "\n 003 - NT-WiFi: " + stock003)


