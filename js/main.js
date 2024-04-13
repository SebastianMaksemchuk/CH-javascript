// arrays
let usuarios = [];
let permisos = [];
let inventario = [];
let imagenesProductos = [];

// clases
class Producto {
  constructor(id, nombre, precio, stock, imagen) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio
    this.stock = stock;
    this.imagen = imagen;
  };
  cambiarNombre(nuevo) { this.nombre = nuevo };
  cambiarPrecio(nuevo) { this.precio = nuevo };
  cambiarStock(nuevo) { this.stock = nuevo };
  cambiarImagen(nuevo) { this.imagen = nuevo };
};

// objetos
let usuario = {};

// funciones de carga de bases de datos
const getUsuarios = async () => {
  const response = await fetch('./db/users.json');
  const data = await response.json();
  usuarios = data;
};
const getPermisos = async () => {
  const response = await fetch('./db/authorizations.json');
  const data = await response.json();
  permisos = data;
};
const getInventarioInicial = async () => {
  const response = await fetch('./db/inventory_init.json');
  const data = await response.json();
  inventario = data;
};
const getImagenesProductos = async () => {
  const response = await fetch('./db/product_img.json');
  const data = await response.json();
  imagenesProductos = data;
};
// esta funcion es para cuando necesito cargar mas de una DB con igual prioridad
async function getCombinado(...get) {
  for (let i = 0; i < get.length; i++) {
    await get[i]();
  };
};

// llamados a elementos del html, los let son dinámicos
const headerDerecha = document.getElementById('header-derecha'),
  inventarioHTML = document.getElementById('inventario'),
  botonReset = document.getElementById('btn-reset');
let saludo, botonAcceso, botonSalir, cardNuevo, botonNuevo, ingresoUsuario, ingresoPassword;

// funciones relacionadas al html
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
};
//funciones que cambian el contenido del header
function iniciarHeader() {
  headerDerecha.innerHTML = '';
  // saludo al usuario
  saludo = crearElementoHTML({ tag: 'span', id: 'saludo' });
  saludo.innerText = `¡Hola ${usuario.nombre}!`;
  headerDerecha.append(saludo);
  // genera el boton de acceso o cierre de sesión
  if (usuario.id == 0) {
    const btnAcceso = crearElementoHTML({ tag: 'button', text: 'Acceder', id: 'btn-acceso' });
    headerDerecha.appendChild(btnAcceso);
    botonAcceso = document.getElementById('btn-acceso');
    botonAcceso.addEventListener('click', formAccesoUsuario);
  } else {
    const btnSalir = crearElementoHTML({ tag: 'button', text: 'Salir', id: 'btn-salir' });
    headerDerecha.appendChild(btnSalir);
    botonSalir = document.getElementById('btn-salir');
    botonSalir.addEventListener('click', logOut);
  };
};
function formAccesoUsuario() {
  // muestra el formulario de log in
  const formularioAcceso = crearElementoHTML({
    tag: 'form', id: 'formulario-acceso',
    HTML: `<input type="text" name="usuario" id="ingreso-usuario" placeholder="Usuario/Correo">
          <input type="password" name="password" id="ingreso-password" placeholder="Contraseña">
          <button type="submit" id="btn-ingresar">Ingresar</button>`
  });
  headerDerecha.innerHTML = '';
  headerDerecha.appendChild(formularioAcceso);
  formularioAcceso.addEventListener('submit', function (e) {
    e.preventDefault();
    logIn();
  });
};
// funciones sobre el inventario
function mostrarInventario() {
  inventarioHTML.innerHTML = 'cargando...';
  // simulacion de tiempo de carga
  setTimeout(() => {
    inventarioHTML.innerHTML = '';
    // crear una card para cada producto en el inventario con contenido variable segun nivel/permisos de usuario
    inventario.forEach(({ id, nombre, precio, stock, imagen }) => {
      const card = crearElementoHTML({
        tag: 'div', id: `producto-${id}`, clases: 'card text-center producto',
        HTML: `<img class="card-img-top producto-imagen" src=${imagen} alt="">
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
          tag: 'button', text: 'Editar', clases: "btn btn-sm position-absolute top-0 end-0 m-2", value: parseInt(id - 1)
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
      botonNuevo = document.querySelector('#nuevo-producto button');
      botonNuevo.addEventListener('click', formNuevoProduct);
    };
  }, 1000);
};
function formEditarProducto(id) {
  // transforma la card de producto en formulario de edición de producto
  const productoEditar = inventario[parseInt(id) - 1];
  const { nombre, imagen, precio, stock } = productoEditar;
  const cardEditar = document.getElementById(`producto-${id}`);
  cardEditar.innerHTML = '';
  const cardEditarBody = crearElementoHTML({
    tag: 'div', clases: 'card-body',
    HTML: '<h5 class="card-title">Editar Producto</h5>'
  });
  cardEditar.append(cardEditarBody);
  const formEditar = crearElementoHTML({ tag: 'form', id: `form-editar-${id}` });
  const labelNombre = crearElementoHTML({ tag: 'label', htmlFor: `nombre-producto-${id}`, clases: 'form-label', text: 'Nombre:' });
  formEditar.append(labelNombre);
  const inputNombre = crearElementoHTML({
    tag: 'input', type: 'text', id: `nombre-producto-${id}`, clases: 'form-control', value: nombre, required: true
  });
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
  const labelPrecio = crearElementoHTML({
    tag: 'label', htmlFor: `precio-producto-${id}`, clases: 'form-label', text: 'Precio en U$D:'
  });
  formEditar.append(labelPrecio);
  const inputPrecio = crearElementoHTML({
    tag: 'input', type: 'number', id: `precio-producto-${id}`, clases: 'form-control', value: precio, required: true
  });
  !verificarPermiso('cambiarPrecios') && (inputPrecio.disabled = true);
  formEditar.append(inputPrecio);
  const labelStock = crearElementoHTML({ tag: 'label', htmlFor: `stock-producto-${id}`, clases: 'form-label', text: 'Stock:' });
  formEditar.append(labelStock);
  const inputStock = crearElementoHTML({
    tag: 'input', type: 'number', id: `stock-producto-${id}`, clases: 'form-control', value: stock, required: true
  });
  !verificarPermiso('cambiarStock') && (inputStock.disabled = true);
  formEditar.append(inputStock);
  const botonesEditar = crearElementoHTML({ tag: 'div', clases: 'card-botones mt-3' });
  const botonCancelarEditar = crearElementoHTML({ tag: 'button', type: 'reset', clases: 'btn btn-secondary', text: 'Cancelar' });
  botonesEditar.append(botonCancelarEditar);
  botonCancelarEditar.onclick = () => actualizarCardProducto(id);
  const botonGuardarEditar = crearElementoHTML({ tag: 'button', type: 'submit', clases: 'btn btn-secondary', HTML: 'Guardar' });
  botonesEditar.append(botonGuardarEditar);
  formEditar.append(botonesEditar)
  cardEditarBody.append(formEditar);
  formEditar.addEventListener('submit', (e) => {
    e.preventDefault();
    guardarEdicion(id);
    actualizarCardProducto(id);
  });
  const botonX = crearElementoHTML({
    tag: 'button', text: 'X', clases: "btn btn-sm position-absolute top-0 end-0 m-2", value: parseInt(id - 1)
  });
  cardEditarBody.append(botonX);
  botonX.addEventListener('click', () => actualizarCardProducto(id));
};
function actualizarCardProducto(id) {
  // vuelve a mostrar la card de producto al finalizar o cancelar la edicion
  const producto = inventario[parseInt(id) - 1];
  const { nombre, imagen, precio, stock } = producto;
  const card = document.getElementById(`producto-${id}`);
  card.innerHTML = 'cargando...';
    // simulacion de tiempo de carga
  setTimeout(() => {
    card.innerHTML = `<img class="card-img-top producto-imagen" src=${imagen} alt="">
                      <h4 class="card-title producto-nombre">${nombre}</h4>`;
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
  }, 500)
};
function formNuevoProduct() {
  // muestra el formulario para crear un producto nuevo
  cardNuevo = document.getElementById('nuevo-producto');
  cardNuevo.innerHTML = '';
  const cardNuevoBody = crearElementoHTML({
    tag: 'div', clases: 'card-body',
    HTML: `<h5 class="card-title">Agregar Producto</h5>`
  });
  cardNuevo.append(cardNuevoBody);
  const formNuevo = crearElementoHTML({ tag: 'form', id: 'form-nuevo' });
  const labelNombre = crearElementoHTML({ tag: 'label', clases: 'form-label', text: 'Nombre:', htmlFor: 'nombre-producto' });
  formNuevo.append(labelNombre);
  const inputNombre = crearElementoHTML({
    tag: 'input', type: 'text', id: 'nombre-producto', clases: 'form-control', placeholder: 'Nombre del nuevo producto', required: true
  });
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
  const inputPrecio = crearElementoHTML({
    tag: 'input', type: 'number', id: 'precio-producto', clases: 'form-control', placeholder: 'Precio', required: true
  });
  if (!verificarPermiso('cambiarPrecios')) {
    inputPrecio.value = 999999;
    inputPrecio.disabled = true;
  };
  formNuevo.append(inputPrecio);
  const labelStock = crearElementoHTML({ tag: 'label', htmlFor: 'stock-producto', clases: 'form-label', text: 'Stock inicial:' })
  formNuevo.append(labelStock);
  const inputStock = crearElementoHTML({
    tag: 'input', type: 'number', id: 'stock-producto', clases: 'form-control', placeholder: 'Stock', required: true
  });
  if (!verificarPermiso('cambiarStock')) {
    inputStock.value = 0;
    inputStock.disabled = true;
  };
  formNuevo.append(inputStock);
  const botonesNuevo = crearElementoHTML({ tag: 'div', clases: 'card-botones mt-3' });
  const botonCancelarNuevo = crearElementoHTML({ tag: 'button', type: 'reset', clases: 'btn btn-secondary', text: 'Cancelar' });
  botonCancelarNuevo.onclick = () => cancelarCardNuevo();
  botonesNuevo.append(botonCancelarNuevo);
  const botonGuardarNuevo = crearElementoHTML({ tag: 'button', type: 'submit', clases: 'btn btn-secondary', HTML: 'Guardar' });
  botonesNuevo.append(botonGuardarNuevo);
  formNuevo.append(botonesNuevo)
  cardNuevoBody.append(formNuevo);
  formNuevo.addEventListener('submit', (e) => {
    e.preventDefault();
    crearProductoNuevo();
    mostrarInventario();
  });
};
function cancelarCardNuevo() {
  cardNuevo.innerHTML = `<button class="btn btn-block w-100 h-100 m-0">Añadir un nuevo producto</button>`;
  botonNuevo = document.querySelector('#nuevo-producto button');
  botonNuevo.addEventListener('click', formNuevoProduct);
}

// funciones varias
function logIn() {
  ingresoUsuario = document.getElementById('ingreso-usuario');
  ingresoPassword = document.getElementById('ingreso-password');
  // busca el usuario en el array de usuarios, avisa si no existe con un toast
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
      // permite el acceso y lo guarda el usuario en LS 
      usuario = usuarioEncontrado;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      iniciarHeader();
      mostrarInventario();
    };
  };
};
function logOut() {
  // borra el usuario de LS y vuelve al usuario invitado
  localStorage.removeItem('usuario');
  usuario = usuarios[0];
  iniciarHeader();
  mostrarInventario();
};
function ayuda() {
  //  funcion para mostrar mensaje de ayuda al clickear los toast
  Swal.fire({
    title: "Ayuda",
    html: `Para probar la aplicación puede ingresar con estos usuarios (la contraseña es igual que el nombre de usuario):<br>
          cliente: puede ver los precios.<br>
          administracion: puede tambien ver los stock.<br>
          comercial: puede editar los productos, cambiar precio, stock, etc.<br>
          produccion: puede editar los productos, pero solo el stock, y puede crear productos nuevos.<br>
          master: puede realizar todas las funciones.`,
    icon: "question",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "OK"
  });
};
function verificarPermiso(accion) {
  // esta función se utiliza para verificar si el usuario tiene permiso para realizar determinada acción, según su nivel
  let autorizado = false;
  const funcion = permisos.find(el => el.funcion == accion);
  if (!funcion) {
    alert('Error inesperado: la función ' + accion + ' no existe.');
  } else {
    funcion.niveles.includes(usuario.nivel) && (autorizado = true);
  };
  return autorizado;
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
function crearProductoNuevo() {
  const nombre = document.getElementById('nombre-producto').value,
    precio = document.getElementById('precio-producto').value,
    stock = document.getElementById('stock-producto').value,
    imagen = `./assets/images/product/${document.getElementById('imagen-select').value}`;
  agregarProducto(nombre, precio, stock, imagen);
  guardarInventario();
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
  guardarInventario();
};
function cargarInventario() {
  // Carga del inventario desde LS si existe, si no existe se deja vacio
  const inventarioLS = JSON.parse(localStorage.getItem('inventario')) || [];
  // Transformar los objetos en instancias de Producto para poder aplicar los metodos
  inventario = inventarioLS.map(({ id, nombre, precio, stock, imagen }) => {
    return new Producto(id, nombre, precio, stock, imagen);
  });
};
function guardarInventario() {
  // funcion para guardar el inventario en LS
  localStorage.setItem('inventario', JSON.stringify(inventario));
};

// Inicialización
// carga de DB usuarios
getUsuarios().then(() => {
  // carga del inventario desde LS, si no existe se carga un inventario inicial desde DB y se guarda en LS
  cargarInventario();
  if (inventario.length === 0) {
    getInventarioInicial().then(() => {
      guardarInventario();
      location.reload();
    });
  };
  // Si ya hay un usuario en localStorage si carga ese, si no se carga el usuario invitado.
  usuario = JSON.parse(localStorage.getItem('usuario')) || usuarios[0];
  iniciarHeader();
  // carga de DBs necesarias para poder mostrar el inventario
  getCombinado(getImagenesProductos, getPermisos).then(() => {
    verificarPermiso('verProductos') && mostrarInventario();
    // Fin inicialización
  });
});

// Reset de aplicación, limpieza de LS y SS
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
        footer: 'Se han borrado los datos guardados en Local Storage y Session Storage',
        grow: 'fullscreen'
      }).then(() => {
        location.reload();
      });
    };
  });
});