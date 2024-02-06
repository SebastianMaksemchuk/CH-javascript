// saludo de bienvenida
let usuario = "";
do {
  usuario = prompt("¡Bienvenido! \n Por favor ingrese su nombre:");
} while (usuario == null || usuario == "");

// acceso con password
let password = prompt("Hola " + usuario + ".\nIngrese la contraseña de acceso:");
for (let i = 2; i > 0; i--) {
  if (password != 1234) {
    password = prompt("Contraseña incorrecta.\nIngrese la contraseña de acceso:");
  };
};
while (password != 1234) {
  password = prompt("Contraseña incorrecta.\nIngrese la contraseña de acceso:\n(la contraseña es 1234)");
};

// Set stocks iniciales
let stock001 = 100;
let stock002 = 50;
let stock003 = 75;

// funcion para cargar datos del producto seleccionado
let codigoProductoSeleccionado;
let nombreProductoSeleccionado;
let stockProductoSeleccionado;
function selecionarProducto(codigoProducto) {
  switch (codigoProducto) {
    case 1:
      codigoProductoSeleccionado = "001"
      nombreProductoSeleccionado = "NT-Link";
      stockProductoSeleccionado = stock001;
      break;
    case 2:
      codigoProductoSeleccionado = "002"
      nombreProductoSeleccionado = "NT-COM";
      stockProductoSeleccionado = stock002;
      break;
    case 3:
      codigoProductoSeleccionado = "003"
      nombreProductoSeleccionado = "NT-WiFi";
      stockProductoSeleccionado = stock003;
      break;
    // no debería haber forma del llegar al default
    default:
      alert("ERROR inesperado");
      console.log("ERROR inesperado");
      break;
  };
};

// funcion que modifica el stock del producto seleccionado
function modificarStock(codigoProducto, operacion) {
  codigoProducto = parseInt(codigoProducto);
  let cambio;
  switch (operacion) {
    case "+":
      do {
        cambio = prompt("¿Cuántos artículos desea agregar al stock?\n" + codigoProductoSeleccionado + " - " + nombreProductoSeleccionado + ". Stock actual: " + stockProductoSeleccionado);
        if (isNaN(cambio)) {
          alert("Ingrese un número.");
        };
      } while (isNaN(cambio) || cambio == null || cambio == "")
      cambio = parseInt(cambio);
      switch (codigoProducto) {
        case 1:
          stock001 = stock001 + cambio;
          stockProductoSeleccionado = stock001;
          break;
        case 2:
          stock002 = stock002 + cambio;
          stockProductoSeleccionado = stock002;
          break;
        case 3:
          stock003 = stock003 + cambio;
          stockProductoSeleccionado = stock003;
          break;
        // no debería haber forma del llegar al default
        default:
          alert("ERROR inesperado");
          console.log("ERROR inesperado");
          break;
      };
      alert("Se agregaron " + cambio + " " + nombreProductoSeleccionado + " al stock.\nStock actual: " + stockProductoSeleccionado);
      break;
    case "-":
      let stoockInsuficiente = true;
      do {
        do {
          cambio = prompt("¿Cuántos artículos desea remover del stock?\n" + codigoProductoSeleccionado + " - " + nombreProductoSeleccionado + ". Stock actual: " + stockProductoSeleccionado);
          if (isNaN(cambio)) {
            alert("Ingrese un número.");
          };
        } while (isNaN(cambio) || cambio == null || cambio == "");
        cambio = parseInt(cambio);
        stoockInsuficiente = cambio > stockProductoSeleccionado;
        if (stoockInsuficiente) {
          alert("Stock insuficiente");
        };
      } while (stoockInsuficiente);
      switch (codigoProducto) {
        case 1:
          stock001 = stock001 - cambio;
          stockProductoSeleccionado = stock001;
          break;
        case 2:
          stock002 = stock002 - cambio;
          stockProductoSeleccionado = stock002;
          break;
        case 3:
          stock003 = stock003 - cambio;
          stockProductoSeleccionado = stock003;
          break;
        // no debería haber forma del llegar al default
        default:
          alert("ERROR inesperado");
          console.log("ERROR inesperado");
          break;
      };
      alert("Se removieron " + cambio + " " + nombreProductoSeleccionado + " del stock.\nStock actual: " + stockProductoSeleccionado);
      break;
    // no debería haber forma del llegar al default
    default:
      alert("ERROR inesperado");
      console.log("ERROR inesperado");
      break;
  };
};

// inicializacion variable de fin de bucle
let repetir;

// ejecución:
do {
  // se le pide al usuario que seleccione un producto y se verifica que sea valido
  let codigoProductoInvalido = true;
  while (codigoProductoInvalido) {
    codigoProductoSeleccionado = prompt("Ingrese el código del artículo cuyo stock desea modificar.\n\n 001 - NT-Link (Stock: " + stock001 + ")\n 002 - NT-COM (Stock: " + stock002 + ")\n 003 - NT-WiFi (Stock: " + stock003 + ")");
    codigoProductoSeleccionado = parseInt(codigoProductoSeleccionado)
    codigoProductoInvalido = codigoProductoSeleccionado != 1 && codigoProductoSeleccionado != 2 && codigoProductoSeleccionado != 3;
    if (codigoProductoSeleccionado == null || codigoProductoSeleccionado == "") {
      continue;
    } else if (codigoProductoInvalido) {
      alert("Código inválido");
      continue;
    };
  };
  // se cargan los datos del producto seleccionado
  selecionarProducto(codigoProductoSeleccionado);

  // se le pide al usuario que seleccione la operacion a realizar y verifica que sea valida
  let operacionSeleccionada;
  let operacionInvalida = true;
  while (operacionInvalida) {
    operacionSeleccionada = prompt("¿Qué operación desea realizar?\n¿Agregar stock (+) o remover stock (-)?\n" + codigoProductoSeleccionado + " - " + nombreProductoSeleccionado + ". Stock actual: " + stockProductoSeleccionado);
    operacionInvalida = operacionSeleccionada != "+" && operacionSeleccionada != "-";
    if (operacionSeleccionada == null) {
      break;
    } else
      if (operacionInvalida) {
        alert("Operación inválida. \n Ingrese + o -.");
        continue;
      };
  };
  // ejecutar operacion
  if (operacionSeleccionada != null) {
    modificarStock(codigoProductoSeleccionado, operacionSeleccionada);
  };

  // se le pregunta al usuario si desea repetir o finalizar
  repetir = prompt("¿Desea realizar otra operación? (Y/n)");
  repetir = repetir != "n" && repetir != "N" && repetir != null;
} while (repetir);

// estado final del stock
alert("Stock final:\n 001 - NT-Link: " + stock001 + "\n 002 - NT-COM: " + stock002 + "\n 003 - NT-WiFi: " + stock003);
console.log("Stock final:\n 001 - NT-Link: " + stock001 + "\n 002 - NT-COM: " + stock002 + "\n 003 - NT-WiFi: " + stock003);