# CH-javascript

## Descripción básica de funcionamiento

Es una miniapp para manejar un inventario de productos.

Primero hay que ingresar con un usuario (ver usuarios dentro del código). Se puede ingresar con el nombre de usuario o con el correo. Cada usuario tiene asignado un nivel o jerarquía de usuario, que define que funciones de la app puede utilizar.
Para hacer pruebas se puede usar el usuario "sebastian", que es un usuario maestro y puede realizar todas las funciones disponibles hasta el momento.

Una vez se ingresa con un usuario y contraseña (que no sea invitado), se llega al menú principal, y se puede ingresar al menú productos o finalizar. (La opción usuarios no hace nada por ahora).

Ingresando al menú de productos se puede ver la información de cada producto para seleccionar el que se quiera editar, o también está la opción de añadir un producto nuevo a la lista (si el usuario tiene el permiso de hacerlo).
Ingresar a un producto en particular permite (según permisos de usuario) cambiarle el precio, agregar o reducir el stock disponible. Una vez realizada la acción vuelve al menú de productos.

Todo lo que se haga en el menú productos es temporal. Al volver al menú principar da la opción de guardar los cambios.
(Esto se maneja haciendo los cambios en un inventario temporal. Si se guardan los cambios se guarda el inventario temporal en el definitivo. Si no se guardan los cambios, se restaura el inventario inicial sobre el temporal).

Además al momento de guardar los cambios se genera un registro en el inventario histórico. Cada registro incuye el nuevo inventario modificado, la fecha del cambio y el usuario que realizó los cambios. Esto permite comparar las versiones del inventario.