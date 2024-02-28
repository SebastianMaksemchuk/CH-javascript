// Usuarios
const usuarios = [];
class Usuario {
  constructor(id, correo, nombreDeUsuario, password, nivel, nombre, apellido, imagen, direccion) {
    this.id = id;
    this.correo = correo;
    this.nombreDeUsuario = nombreDeUsuario
    this.nombre = nombre;
    this.apellido = apellido
    this.password = password;
    this.nivel = nivel;
    this.imagen = imagen;
    this.direccion = direccion;
  };
  cambiarCorreo(nuevo) {
    this.correo = nuevo;
  };
  cambiarNombreDeUsuario(nuevo) {
    this.nombreDeUsuario = nuevo;
  };
  cambiarPassword(nuevo) {
    this.password = nuevo;
  };
  cambiarNivel(nuevo) {
    this.nivel = nuevo;
  };
  cambiarNombre(nuevo) {
    this.nombre = nuevo;
  };
  cambiarApellido(nuevo) {
    this.apellido = nuevo;
  };
  cambiarImagen(nuevo) {
    this.imagen = nuevo;
  };
  cambiarDireccion(nuevo) {
    this.direccion = nuevo;
  };
}
function agregarUsuario(correo, nombreDeUsuario, password, nivel, nombre, apellido, imagen, direccion) {
  let nuevoID = usuarios.length;
  const usuario = new Usuario(nuevoID, correo, nombreDeUsuario, password, nivel, nombre, apellido, imagen, direccion);
  usuarios.push(usuario);
}

// Creamos algunos usuarios para probar
agregarUsuario(null, '', null, 0, 'Invitado', null, null, null);
agregarUsuario('sebastian@netio.com.ar', 'sebastian', '1234', 9, 'Sebastian', 'Maksemchuk', null, null);
agregarUsuario('alan@netio.com.ar', 'alan', '4K7', 9, 'Alan', 'M', null, null);
agregarUsuario('mauro@netio.com.ar', 'mauro', 'mncase', 9, 'Mauro', 'C', null, null);
agregarUsuario('martin@netio.com.ar', 'martin', 'atk77', 3, 'Martin', 'O', null, null);
agregarUsuario('leo@netio.com.ar', 'leo', 'zami', 2, 'Leonardo', 'Z', null, null);
agregarUsuario('cliente@netio.com.ar', 'cliente', 'cliente', 1, 'Cliente', 'X', null, null);

// esta variable usuario es donde se guarda el usuario actual. Se inicializa en el usuario invitado.
let usuario = usuarios[0];

// Niveles de usuario: se le da un nombre a cada nivel (todavía no sé si usar directamente el número o el nombre)
const niveles = {
  'invitado': 0,
  'cliente': 1,
  'produccion': 2,
  'comercial': 3,
  'master': 9
};

// Permisos: se define para cada accion, qué niveles de usuario pueden realizarla
const permisos = [];
class Permiso {
  constructor(funcion, niveles) {
    this.funcion = funcion;
    this.niveles = niveles;
  };
  nuevoPermiso(funcion, niveles) {
    permisos.push(new Permiso(funcion, niveles))
  };
};
function agregarPermisosParaAccion(funcion, niveles) {
  const permiso = new Permiso();
  permiso.nuevoPermiso(funcion, niveles);
};

// se crea la lista de acciones que requieren permisos
agregarPermisosParaAccion('verUsuarios', [9]);
agregarPermisosParaAccion('crearUsuario', [9]);
agregarPermisosParaAccion('editarUsuarioActual', [1, 2, 3, 9]);
agregarPermisosParaAccion('editarUsuariosTodos', [9]);
agregarPermisosParaAccion('verProductos', [0, 1, 2, 3, 9]);
agregarPermisosParaAccion('ingresarAlPrograma', [1, 2, 3, 9]);
agregarPermisosParaAccion('crearProducto', [2, 3, 9]);
agregarPermisosParaAccion('editarProducto', [2, 3, 9]);
agregarPermisosParaAccion('verPrecios', [1, 2, 3, 9]);
agregarPermisosParaAccion('cambiarPrecios', [3, 9]);
agregarPermisosParaAccion('verStock', [2, 3, 9]);
agregarPermisosParaAccion('agregarStock', [2, 9]);
agregarPermisosParaAccion('removerStock', [2, 3, 9]);

// esta función se utiliza para verificar si el usuario tiene permiso para realizar determinada acción, según su nivel
function verificarPermiso(accion, alerta) {
  /*  accion: función a verificar
  alert: bool si se desea alert de usuario no autorizado o no*/
  let autorizado = false;
  const funcion = permisos.find(el => el.funcion == accion);
  if (!funcion) {
    alert('Error inesperado: la función ' + accion + ' no existe.');
  } else
    if (funcion.niveles.includes(usuario.nivel)) {
      autorizado = true;
    } else
      if (alerta) {
        alert('No se encuentra autorizado para realizar esta acción.');
      };
  return autorizado;
};

// Creacion del inventario
let inventario = [];
// Inventario temporal: se trabaja sobre una copia del inventario para evitar problemas, luego se guarda al inventario real y se copia al registro
let inventarioTemp = [];

class Producto {
  constructor(id, modelo, precio, stock, imagen) {
    this.id = id;
    this.modelo = modelo;
    this.precio = precio
    this.stock = stock;
    this.imagen = imagen;
  };
  cambiarPrecio(nuevo) {
    this.precio = nuevo;
  };
  agregarStock(cambio) {
    this.stock += cambio
  };
  removerStock(cambio) {
    this.stock -= cambio
  };
};
function agregarProducto(modelo, precio, stock, imagen) {
  let nuevoID = inventarioTemp.length + 1;
  nuevoID = nuevoID.toString();
  while (nuevoID.length < 3) {
    nuevoID = '0' + nuevoID;
  };
  const producto = new Producto(nuevoID, modelo, precio, stock, imagen);
  inventarioTemp.push(producto);
};

// Historial de modificaciones al inventario
let fechaHoraActual = new Date();
const inventarioHistorico = [];

// funcion para guardar el inventario temporal en el definitivo. Además crea un registro en el historial de modificaciones del inventario.
function guardarInventario() {
  fechaHoraActual = new Date();
  inventario = inventarioTemp.map(el => ({ ...el }));
  inventarioHistorico.push({ fecha: fechaHoraActual, usuario: usuario.nombreDeUsuario, inventario });
};

// Creamos algunos productos para probar y los guardamos como estado incial del inventario
agregarProducto("NT-Link", 140, 100, null);
agregarProducto("NT-COM", 160, 50, null);
agregarProducto("NT-WiFi", 60, 75, null);
guardarInventario();

// esta variable se usa en los promts y alerts. Se va modificando durante la ejecución.
let mensaje = '';
//estas variables se usan para guardar los return de seleccion de los menús de opciones y otras cosas
let seleccion = undefined;
let idProducto = undefined;

//función para agregar en mensaje el inventarioTemp completo. Lo que se muestra depende del nivel del usuario
function inventarioToMensaje() {
  inventarioTemp.forEach(el => {
    mensaje += '\n' + el.id + ' - ' + el.modelo + '.'
    if (verificarPermiso('verPrecios')) {
      mensaje += ' ' + el.precio + ' USD.'
    };
    if (verificarPermiso('verStock')) {
      mensaje += ' (Stock: ' + el.stock + ')'
    };
  });
};

// login
function logIn() {
  do {
    let correoONombre = prompt('¡Bienvenido!\nIngrese su correo o nombre de usuario. (Deje en blanco para ingresar como invitado.)');
    let usuarioEncontrado = usuarios.find(el => el.correo == correoONombre || el.nombreDeUsuario == correoONombre)
    if (!usuarioEncontrado) {
      usuario = undefined
      alert('No se encontro un usuario registrado con ese dato.')
    } else {
      usuario = usuarioEncontrado
      if (usuario.nivel > 0) {
        let password = prompt('Hola ' + usuario.nombre + '.\nPor favor ingrese su contraseña de acceso:')
        for (let i = 2; i > 0; i--) {
          if (password != usuario.password) {
            password = prompt('Contraseña incorrecta.\nIngrese su contraseña de acceso:');
          };
        };
        while (password != usuario.password) {
          password = prompt('Contraseña incorrecta.\nIngrese la contraseña de acceso:\n(la contraseña es ' + usuario.password + ')');
        };
      };
    };
  } while (usuario == undefined);
};

// utils para los menus
const mensajeOpcionInvalida = 'Seleccione una de las opciones disponibles.'

// menu principal
function mostrarMenuPrincipal() {
  mensaje = 'Menú principal';
  mensaje += '\n1. Productos';
  mensaje += '\n2. Usuarios';
  mensaje += '\n0. Finalizar';
  let seleccion = parseInt(prompt(mensaje));
  if (!seleccion || seleccion > 3) {
    if (seleccion != 0) {
      alert(mensajeOpcionInvalida)
    };
  };
  return seleccion
};

// menu productos
function mostrarMenuProductos() {
  mensaje = 'Productos:\n';
  if (verificarPermiso('editarProducto')) {
    mensaje += 'Ingrese el codigo del producto que desea editar.\n'
  };
  inventarioToMensaje();
  if (verificarPermiso('crearProducto')) {
    mensaje += '\n999 - Registrar un nuevo producto'
  }
  mensaje += '\n\n000 - Volver al menú principal.'
  let seleccion = parseInt(prompt(mensaje));
  if (!seleccion || seleccion > inventarioTemp.length && seleccion != 999) {
    if (seleccion != 0) {
      alert(mensajeOpcionInvalida);
    };
  } else if (seleccion != 999) {
    menu = 'editar producto';
  };
  return seleccion
};


//menu editar producto
function mostrarMenuEditarProducto() {
  mensaje = 'Editar producto:\n';
  mensaje += '\n' + inventarioTemp[idProducto].id + ' - ' + inventarioTemp[idProducto].modelo + '.';
  if (verificarPermiso('verPrecios')) {
    mensaje += ' ' + inventarioTemp[idProducto].precio + ' USD' + '.';
  };
  if (verificarPermiso('verStock')) {
    mensaje += ' Stock actual: ' + inventarioTemp[idProducto].stock + '.';
  };
  if (verificarPermiso('cambiarPrecios')) {
    mensaje += '\n$ modificar precio';
  };
  if (verificarPermiso('agregarStock')) {
    mensaje += '\n+ añadir stock';
  };
  if (verificarPermiso('removerStock')) {
    mensaje += '\n- remover stock';
  };
  mensaje += '\n\n000 - Cancelar.';
  let seleccion = prompt(mensaje);
  if (parseInt(seleccion) == 0) {
    seleccion = parseInt(seleccion);
  } else {
    let seleccionValida = seleccion == '$' || seleccion == '+' || seleccion == '-';
    if (!seleccionValida) {
      alert(mensajeOpcionInvalida);
    };
  };
  return seleccion;
};


//Inicio

//Empezamos con un inicio de sesión:
logIn();

// ejecución v2:
let menu = 'principal';
if (verificarPermiso('ingresarAlPrograma')) {
  // variable que define en que menu estamos
  do {
    while (menu == 'principal') {
      seleccion = mostrarMenuPrincipal();
      switch (seleccion) {
        case 0:
          menu = 'salir';
          break;
        case 1:
          menu = 'productos';
          break;
        case 2:
          alert('Esta opción se encuentra temporalmente deshabilitada.')
          break;
        default:
          break;
      }
    };

    while (menu == 'productos') {
      seleccion = mostrarMenuProductos();
      switch (seleccion) {
        case 0:
        case null:
          let guardar = prompt('¿Desea guardar los cambios realizados? (Y/n)');
          guardar = guardar != null && guardar != 'n' && guardar != 'N';
          if (guardar) {
            guardarInventario();
          } else {
            inventarioTemp = inventario.map(el => ({ ...el }));
          };
          menu = 'principal';
          break;
        case 999:
          if (verificarPermiso('crearProducto', true)) {
            let nuevoProducto = prompt('Ingrese el nombre del nuevo producto:');
            agregarProducto(nuevoProducto, 0, 0, null);
          };
          break;
        default:
          idProducto = seleccion - 1;
          break;
      };

      while (menu == 'editar producto') {
        seleccion = mostrarMenuEditarProducto();
        switch (seleccion) {
          case 0:
            menu = 'productos';
            break;
          case '$':
            let nuevoPrecio = prompt('Ingrese el nuevo precio para el producto\n\n' + inventarioTemp[idProducto].id + ' - ' + inventarioTemp[idProducto].modelo + '.');
            nuevoPrecio = parseFloat(nuevoPrecio);
            if (!isNaN(nuevoPrecio)) {
              inventarioTemp[idProducto].cambiarPrecio(nuevoPrecio);
            } else {
              alert('No igresó un valor válido');
            };
            menu = 'productos';
            break;
          case '+':
            let mas = prompt('¿Cuánto desea agregar al stock?\n\n' + inventarioTemp[idProducto].id + ' - ' + inventarioTemp[idProducto].modelo + '. Stock actual: ' + inventarioTemp[idProducto].stock + '.');
            mas = parseFloat(mas);
            if (!isNaN(mas)) {
              inventarioTemp[idProducto].agregarStock(mas);
            } else {
              alert('No igresó un valor válido');
            };
            menu = 'productos';
            break;
          case '-':
            let menos = prompt('¿Cuánto desea agregar al stock?\n\n' + inventarioTemp[idProducto].id + ' - ' + inventarioTemp[idProducto].modelo + '. Stock actual: ' + inventarioTemp[idProducto].stock + '.');
            menos = parseFloat(menos);
            if (!isNaN(menos) && menos <= inventarioTemp[idProducto].stock) {
              inventarioTemp[idProducto].removerStock(menos);
            } else {
              alert('No igresó un valor válido');
            };
            menu = 'productos';
            break;
          default:
            break;
        };
      };
    };
  } while (menu != 'salir');
};

if (verificarPermiso('verProductos')) {
  mensaje = 'Productos disponibles:';
  inventarioToMensaje();
  alert(mensaje);
  console.log(mensaje);
};

console.table(inventarioHistorico)