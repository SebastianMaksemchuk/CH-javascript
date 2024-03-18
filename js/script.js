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
}
function agregarUsuario(correo, nombreDeUsuario, password, nivel, nombre, apellido, imagen, direccion) {
  let nuevoID = usuarios.length;
  const usuario = new Usuario(nuevoID, correo, nombreDeUsuario, password, nivel, nombre, apellido, imagen, direccion);
  usuarios.push(usuario);
}
// Creamos algunos usuarios para probar
agregarUsuario(null, null, null, 0, 'Invitado', null, null, null);
agregarUsuario('sebastian@netio.com.ar', 'sebastian', '1234', 9, 'Sebastian', 'Maksemchuk', null, null);
agregarUsuario('master@netio.com.ar', 'master', 'master', 9, 'Master', 'M', null, null);
agregarUsuario('produccion@netio.com.ar', 'produccion', 'produccion', 4, 'Produccion', 'P', null, null);
agregarUsuario('comercial@netio.com.ar', 'comercial', 'comercial', 3, 'Comercial', 'C', null, null);
agregarUsuario('administracion@netio.com.ar', 'administracion', 'administracion', 2, 'Administracion', 'A', null, null);
agregarUsuario('cliente@netio.com.ar', 'cliente', 'cliente', 1, 'Cliente', 'C', null, null);

// esta variable usuario es donde se guarda el usuario actual. 
// Si ya hay un usuario en localStorage si carga ese, sino se carga el usuario invitado
let usuario = JSON.parse(localStorage.getItem('usuario')) || usuarios[0];

// funcion auxiliar para crear elementos HTML de forma más concisa
function crearElementoHTML({ tag, id, clases, text, HTML, type, value, htmlFor, placeholder, required, defaultSelected }) {
  const elemento = document.createElement(tag);
  id && (elemento.id = id);
  clases && (elemento.className = clases);
  text && (elemento.innerText = text);
  HTML && (elemento.innerHTML = HTML);
  type && (elemento.type = type);
  value && (elemento.value = value);
  htmlFor && (elemento.htmlFor = htmlFor);
  placeholder && (elemento.placeholder = placeholder);
  required && (elemento.required = required);
  defaultSelected && (elemento.defaultSelected = defaultSelected);
  return elemento;
}

// Crear la parte derecha del header segun estado de usuario
const headerDerecha = document.getElementById('header-derecha');
// Mensaje de saludo al usuario en el header
document.querySelector('#saludo').innerText = `¡Hola ${usuario.nombre}!`;
// genera el boton de acceso o cierre de sesión
if (usuario.id == 0) {
  const botonAcceso = crearElementoHTML({ tag: 'button', text: 'Acceder', id: 'btn-acceso' });
  headerDerecha.appendChild(botonAcceso);
} else {
  const botonSalir = crearElementoHTML({ tag: 'button', text: 'Salir', id: 'btn-salir' });
  headerDerecha.appendChild(botonSalir);
};

// transformar parte derecha del header en formulario de ingreso
const botonAcceso = document.getElementById('btn-acceso');
botonAcceso?.addEventListener('click', formAccesoUsuario);
function formAccesoUsuario() {
  const formularioAcceso = crearElementoHTML({
    tag: 'form', id: 'formulario-acceso',
    HTML: `<input type="text" name="usuario" id="ingreso-usuario" placeholder="Usuario o Correo">
          <input type="password" name="password" id="ingreso-password" placeholder="Contraseña">
          <button type="submit" id="btn-ingresar">Ingresar</button>`});
  headerDerecha.innerHTML = '';
  headerDerecha.appendChild(formularioAcceso);

  // envio del formulario de ingreso de usuario
  formularioAcceso.addEventListener('submit', function (e) {
    e.preventDefault();
    const ingresoUsuario = document.getElementById('ingreso-usuario')
    const ingresoPassword = document.getElementById('ingreso-password')

    // busca el usuario en el array de usuarios, avisa si no existe
    let usuarioEncontrado = usuarios.find(el => el.correo == ingresoUsuario.value || el.nombreDeUsuario == ingresoUsuario.value);
    if (!usuarioEncontrado) {
      Toastify({
        text: "Usuario no encontrado \n click aquí para ayuda.",
        duration: 3000,
        newWindow: true,
        close: false,
        position: "center",
        stopOnFocus: true,
        onClick: ayuda
      }).showToast();
    } else {
      //verifica contraseña
      if (usuarioEncontrado.password != ingresoPassword.value) {
        Toastify({
          text: "Contraseña incorrecta",
          duration: 3000,
          newWindow: true,
          close: false,
          position: "center",
          stopOnFocus: true,
          onClick: ayuda
        }).showToast();
      } else {
        // acceso válido, guarda usuario en LS y recarga la página
        usuario = usuarioEncontrado;
        localStorage.setItem('usuario', JSON.stringify(usuario));
        location.reload();
      };
    };
  });
};

function ayuda() {
  Swal.fire({
    title: "Ayuda",
    html: `Para probar la aplicación puede ingresar con estos usuarios (la contraseña es igual que el nombre de usuario):<br>cliente: puede ver los precios.<br>administracion: puede tambien ver los stock.<br>comercial: puede editar los productos, cambiar precio, stock, etc.<br>produccion: puede editar los productos, pero solo el stock, y puede crear productos nuevos.<br>master: puede realizar todas las funciones.`,
    icon: "question",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK"
  });
};

// Cerrar sesion
const botonSalir = document.getElementById('btn-salir');
botonSalir?.addEventListener('click', cerrarSesion);
function cerrarSesion() {
  localStorage.setItem('usuario', JSON.stringify(usuarios[0]));
  location.reload();
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
agregarPermisosParaAccion('verProductos', [0, 1, 2, 3, 4, 9]);
agregarPermisosParaAccion('verPrecios', [1, 2, 3, 4, 9]);
agregarPermisosParaAccion('verStock', [2, 3, 4, 9]);
agregarPermisosParaAccion('crearProducto', [4, 9]);
agregarPermisosParaAccion('editarProducto', [3, 4, 9]);
agregarPermisosParaAccion('cambiarNombre', [9]);
agregarPermisosParaAccion('cambiarImagen', [3, 9]);
agregarPermisosParaAccion('cambiarPrecios', [3, 9]);
agregarPermisosParaAccion('cambiarStock', [3, 4, 9]);

// esta función se utiliza para verificar si el usuario tiene permiso para realizar determinada acción, según su nivel
function verificarPermiso(accion) {
  // accion: función a verificar
  let autorizado = false;
  const funcion = permisos.find(el => el.funcion == accion);
  if (!funcion) {
    alert('Error inesperado: la función ' + accion + ' no existe.');
  } else {
    funcion.niveles.includes(usuario.nivel) && (autorizado = true);
  };
  return autorizado;
};

//Productos
class Producto {
  constructor(id, nombre, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio
    this.stock = stock;
    this.imagen = imagen;
  };
  cambiarNombre(nuevo) {
    this.nombre = nuevo;
  };
  cambiarPrecio(nuevo) {
    this.precio = nuevo;
  };
  cambiarStock(nuevo) {
    this.stock = nuevo;
  };
  cambiarImagen(nuevo) {
    this.imagen = nuevo;
  };
};
function agregarProducto(nombre, precio, stock, imagen) {
  let nuevoID = inventario.length + 1;
  nuevoID = nuevoID.toString();
  while (nuevoID.length < 3) {
    nuevoID = '0' + nuevoID;
  };
  const producto = new Producto(nuevoID, nombre, precio, stock, imagen);
  inventario.push(producto);
};

//lista de imagenes de productos en carpeta de imagenes
const imagenesProductos = [
  { nombre: 'Sin imagen', imagen: 'sin-imagen.svg' },
  { nombre: 'Accesorio', imagen: 'productos-accesorios.webp' },
  { nombre: 'NT-Com 2 4G', imagen: 'productos-ntcom2-4g.webp' },
  { nombre: 'NT-Com 3 4G', imagen: 'productos-ntcom3-4g.webp' },
  { nombre: 'NT-Link 4G/5G', imagen: 'productos-ntlink-4g-5g.webp' },
  { nombre: 'NT-Link 4G', imagen: 'productos-ntlink-4g.webp' },
  { nombre: 'NT-RRL', imagen: 'productos-receptora.webp' },
  { nombre: 'NT-Link WiFi', imagen: 'productos-wifi.webp' },
];

// Carga del inventario desde LS si existe, si no existe se crea vacio
function cargarInventarioDesdeLS() {
  const inventarioLS = JSON.parse(localStorage.getItem('inventario')) || [];
  // Transformar los objetos en instancias de Producto para poder aplicar los metodos
  inventario = inventarioLS.map(({ id, nombre, precio, stock, imagen }) => {
    return new Producto(id, nombre, precio, stock, imagen);
  });
}
let inventario = [];
cargarInventarioDesdeLS();

// funcion para guardar el inventario en LS
function guardarInventarioLS() {
  localStorage.setItem('inventario', JSON.stringify(inventario));
};

// Si el inventario está vacío creamos unos productos de base
if (inventario.length === 0) {
  agregarProducto("NT-Link 4G", 140, 2000, `./assets/images/product/${imagenesProductos[5].imagen}`);
  agregarProducto("NT-COM2 4G", 160, 1000, `./assets/images/product/${imagenesProductos[2].imagen}`);
  agregarProducto("NT-Link WiFi", 60, 1500, `./assets/images/product/${imagenesProductos[7].imagen}`);
  guardarInventarioLS();
};

// funcion para mostrar el inventario en HTML
function mostrarInventario() {
  let inventarioHTML = document.getElementById('inventario');
  // crear una card para cada producto en el inventario
  inventario.forEach(({ id, nombre, precio, stock, imagen }) => {
    const card = crearElementoHTML({
      tag: 'div', id: `producto-${id}`, clases: 'card text-center producto',
      HTML: ` <img class="card-img-top producto-imagen" src=${imagen} alt="">
              <h4 class="card-title producto-nombre">${nombre}</h4>`
    });
    if (verificarPermiso('verPrecios')) {
      const mostrarPrecio = crearElementoHTML({ tag: 'p', clases: 'producto-precio', text: `U$D ${precio}` });
      card.append(mostrarPrecio);
    };
    if (verificarPermiso('verStock')) {
      const mostrarStock = crearElementoHTML({ tag: 'p', clases: 'producto-stock', text: `Stock: ${stock}` });
      card.append(mostrarStock)
    };
    if (verificarPermiso('editarProducto')) {
      const botonEditar = crearElementoHTML({
        tag: 'button', text: 'Editar',
        clases: "btn btn-sm position-absolute top-0 end-0 m-2", value: parseInt(id - 1)
      });
      card.append(botonEditar);
      botonEditar.addEventListener('click', () => formEditarProducto(id))
    };
    inventarioHTML.append(card);
  });
  if (verificarPermiso('crearProducto')) {
    const newCard = crearElementoHTML({
      tag: 'div', id: 'nuevo-producto', clases: 'card text-center producto',
      HTML: `<button class="btn btn-block w-100 h-100 m-0">Añadir un nuevo producto</button>`
    });
    inventarioHTML.append(newCard);
  };
};
verificarPermiso('verProductos') && mostrarInventario()

// Creacion de un nuevo producto
const botonNuevo = document.querySelector('#nuevo-producto button');
botonNuevo?.addEventListener('click', formNuevoProduct);
function formNuevoProduct() {
  const cardNuevo = document.getElementById('nuevo-producto');
  cardNuevo.innerHTML = '';
  const cardNuevoBody = crearElementoHTML({
    tag: 'div', clases: 'card-body',
    HTML: `<h5 class="card-title">Agregar Producto</h5>`
  });
  cardNuevo.append(cardNuevoBody);
  const formNuevo = crearElementoHTML({ tag: 'form', id: 'form-nuevo' });
  const labelNombre = crearElementoHTML({ tag: 'label', clases: 'form-label', text: 'Nombre:', htmlFor: 'nombre-producto' });
  formNuevo.append(labelNombre);
  const inputNombre = crearElementoHTML({ tag: 'input', type: 'text', id: 'nombre-producto', clases: 'form-control', placeholder: 'Nombre del nuevo producto', required: true });
  formNuevo.append(inputNombre);
  const labelImagen = crearElementoHTML({ tag: 'label', htmlFor: 'imagen-select', clases: 'form-label', text: 'Imagen:' });
  formNuevo.append(labelImagen);
  const selectImagen = crearElementoHTML({ tag: 'select', id: 'imagen-select', clases: 'form-select' });
  imagenesProductos.forEach((element) => {
    const opcion = crearElementoHTML({ tag: 'option', value: element.imagen, text: element.nombre });
    selectImagen.append(opcion);
  });
  formNuevo.append(selectImagen);
  const labelPrecio = crearElementoHTML({ tag: 'label', htmlFor: 'precio-producto', clases: 'form-label', text: 'Precio en U$D:' });
  formNuevo.append(labelPrecio);
  const inputPrecio = crearElementoHTML({ tag: 'input', id: 'precio-producto', clases: 'form-control', placeholder: 'Precio', required: true });
  if (!verificarPermiso('cambiarPrecios')) {
    inputPrecio.value = 999999;
    inputPrecio.disabled = true;
  };
  formNuevo.append(inputPrecio);
  const labelStock = crearElementoHTML({ tag: 'label', htmlFor: 'stock-producto', clases: 'form-label', text: 'Stock inicial:' })
  formNuevo.append(labelStock);
  const inputStock = crearElementoHTML({ tag: 'input', type: 'number', id: 'stock-producto', clases: 'form-control', placeholder: 'Stock', required: true });
  if (!verificarPermiso('cambiarStock')) {
    inputPrecio.value = 0;
    inputPrecio.disabled = true;
  };
  formNuevo.append(inputStock);
  const botonesNuevo = crearElementoHTML({ tag: 'div', clases: 'card-botones mt-3' });
  const botonCancelarNuevo = crearElementoHTML({ tag: 'button', type: 'reset', clases: 'btn btn-secondary', text: 'Cancelar' });
  botonCancelarNuevo.onclick = () => location.reload();
  botonesNuevo.append(botonCancelarNuevo);
  const botonGuardarNuevo = crearElementoHTML({ tag: 'button', type: 'submit', clases: 'btn btn-secondary', HTML: 'Guardar' });
  botonesNuevo.append(botonGuardarNuevo);
  formNuevo.append(botonesNuevo)
  cardNuevoBody.append(formNuevo);
  formNuevo.addEventListener('submit', (e) => {
    e.preventDefault();
    crearProductoNuevo();
    location.reload();
  });
};
function crearProductoNuevo() {
  const nombre = document.getElementById('nombre-producto').value,
    precio = document.getElementById('precio-producto').value,
    stock = document.getElementById('stock-producto').value,
    imagen = `./assets/images/product/${document.getElementById('imagen-select').value}`;
  agregarProducto(nombre, precio, stock, imagen);
  guardarInventarioLS();
};

// Edicion de productos
function formEditarProducto(id) {
  const productoEditar = inventario[parseInt(id) - 1];
  const { nombre, imagen, precio, stock } = productoEditar;
  const cardEditar = document.getElementById(`producto-${id}`);
  cardEditar.innerHTML = '';
  const cardEditarBody = crearElementoHTML({ tag: 'div', clases: 'card-body', HTML: '<h5 class="card-title">Editar Producto</h5>' });
  cardEditar.append(cardEditarBody);
  const formEditar = crearElementoHTML({ tag: 'form', id: `form-editar-${id}` });
  const labelNombre = crearElementoHTML({ tag: 'label', htmlFor: `nombre-producto-${id}`, clases: 'form-label', text: 'Nombre:' });
  formEditar.append(labelNombre);
  const inputNombre = crearElementoHTML({ tag: 'input', type: 'text', id: `nombre-producto-${id}`, clases: 'form-control', value: nombre, required: true });
  !verificarPermiso('cambiarNombre') && (inputNombre.disabled = true);
  formEditar.append(inputNombre);
  const labelImagen = crearElementoHTML({ tag: 'label', htmlFor: `imagen-select-${id}`, clases: 'form-label', text: 'Imagen:' });
  formEditar.append(labelImagen);
  const selectImagen = crearElementoHTML({ tag: 'select', id: `imagen-select-${id}`, clases: 'form-select' });
  imagenesProductos.forEach((element) => {
    const opcion = crearElementoHTML({ tag: 'option', value: element.imagen, text: element.nombre });
    imagen == `./assets/images/product/${opcion.value}` && (opcion.defaultSelected = true);
    selectImagen.append(opcion);
  });
  !verificarPermiso('cambiarImagen') && (selectImagen.disabled = true)
  formEditar.append(selectImagen);
  const labelPrecio = crearElementoHTML({ tag: 'label', htmlFor: `precio-producto-${id}`, clases: 'form-label', text: 'Precio en U$D:' });
  formEditar.append(labelPrecio);
  const inputPrecio = crearElementoHTML({ tag: 'input', type: 'number', id: `precio-producto-${id}`, clases: 'form-control', value: precio, required: true });
  !verificarPermiso('cambiarPrecios') && (inputPrecio.disabled = true);
  formEditar.append(inputPrecio);
  const labelStock = crearElementoHTML({ tag: 'label', htmlFor: `stock-producto-${id}`, clases: 'form-label', text: 'Stock:' });
  formEditar.append(labelStock);
  const inputStock = crearElementoHTML({ tag: 'input', type: 'number', id: `stock-producto-${id}`, clases: 'form-control', value: stock, required: true });
  !verificarPermiso('cambiarStock') && (inputStock.disabled = true);
  formEditar.append(inputStock);
  const botonesEditar = crearElementoHTML({ tag: 'div', clases: 'card-botones mt-3' });
  const botonCancelarEditar = crearElementoHTML({ tag: 'button', type: 'reset', clases: 'btn btn-secondary', text: 'Cancelar' });
  botonCancelarEditar.onclick = () => location.reload();
  botonesEditar.append(botonCancelarEditar);
  const botonGuardarEditar = crearElementoHTML({ tag: 'button', type: 'submit', clases: 'btn btn-secondary', HTML: 'Guardar' });
  botonesEditar.append(botonGuardarEditar);
  formEditar.append(botonesEditar)
  cardEditarBody.append(formEditar);
  formEditar.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarEdicion(id);
    location.reload();
  });
};
function guardarEdicion(id) {
  const producto = inventario[parseInt(id) - 1],
    nuevoNombre = document.getElementById(`nombre-producto-${id}`).value,
    nuevoPrecio = document.getElementById(`precio-producto-${id}`).value,
    nuevoStock = document.getElementById(`stock-producto-${id}`).value,
    nuevaImagen = `./assets/images/product/${document.getElementById(`imagen-select-${id}`).value}`;
  producto.cambiarNombre(nuevoNombre);
  producto.cambiarPrecio(nuevoPrecio);
  producto.cambiarStock(nuevoStock);
  producto.cambiarImagen(nuevaImagen);
  guardarInventarioLS();
};

// Fecha
const pfecha = document.getElementById('fecha');
const DateTime = luxon.DateTime
const fecha = DateTime.now()
const idiomas = ['es', 'en', 'de', 'fr', 'ar', 'el', 'ja', 'zh', 'hi'];
const idiomaSelect = document.getElementById('idioma-select');
const idiomaEnSS = sessionStorage.getItem('idioma') || 'es';
idiomas.forEach((idioma) => {
  const opcion = crearElementoHTML({ tag: 'option', text: idioma, value: idioma });
  idioma == idiomaEnSS && (opcion.defaultSelected = true);
  idiomaSelect.append(opcion);
})
pfecha.innerText = fecha.setLocale(idiomaEnSS).toLocaleString(DateTime.DATE_MED)
idiomaSelect.addEventListener('change', () => {
  pfecha.innerText = fecha.setLocale(idiomaSelect.value).toLocaleString(DateTime.DATE_MED);
  sessionStorage.setItem('idioma', idiomaSelect.value)
});

// Reset de aplicación, limpieza de LS y SS
const botonReset = document.getElementById('btn-reset');
botonReset.addEventListener('click', () => {
  Swal.fire({
    title: "¿Desea resetear la aplicación?",
    text: "Se borrarán todos los cambios realizados. No se puede deshacer.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, resetear la aplicación"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      sessionStorage.clear();
      Swal.fire({
        text: "Aplicación reseteada.",
        icon: "success",
        footer: 'Se han borrado los datos guardados en Local Storage',
        grow: 'fullscreen'
      }).then(() => {
        location.reload();
      });
    };
  });
});