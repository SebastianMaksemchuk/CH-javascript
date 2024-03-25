# CH-javascript

## Descripción básica de funcionamiento

Es una app para manejar un inventario de productos.

Cada producto tiene un nombre, una imagen, un precio y un stock. Cada producto se representa con una card.

Por defecto se ingresa con un usuario Invitado, pero para poder interactuar con la app hay que ingresar con usuario y contraseña.
Dependiendo qué usuario esté utilizando la app se va a poder hacer diferentes cosas.
Invitado: solo puede ver que productos existen (nombre e imágen).
Cliente: puede además ver el precio de los prodcutos.
Administracion: puede además ver el stock actual de los productos.
Comercial: puede editar los productos. Puede cambiar la imagen, el precio y el stock.
Produccion: Puede agregar productos nuevos al inventario. También puede editar los productos, pero solo el stock.
Master: puede hacer todo, incluyendo cambiar el nombre a los productos que ya existen, siendo el único que puede hacerlo.
Esta información también se muestra en la página. Cuando se ingresa un usuario o contraseña incorrecta aparece un toastify sobre el que se puede hacer click para ver un sweetalert2 de ayuda.

En la esquina inferior derecha se muestra la fecha usando la libreria luxon y hay un selector que permite cambiar el idioma en el que se muestra la misma. También hay un botón que permite resetear los storage para volver al estado inicial de la aplicación, solicitando confirmacion con sweetalert2.