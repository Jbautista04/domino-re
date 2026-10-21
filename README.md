# DOMINÓ RD — actualización 3D para iPhone

Esta versión actualiza el MVP existente y conserva las salas multijugador por Socket.IO.

## Incluye en esta entrega
- Mesa 3D renderizada con Three.js/WebGL: superficie azul, borde dorado, iluminación y fichas con relieve y puntos.
- Vista de cuatro asientos con nombre, turno y cantidad de fichas.
- Mano del jugador con selección táctil y modal para elegir el extremo de colocación.
- Conserva las salas privadas de 2 o 4 jugadores, códigos para compartir, marcador, turnos, historial y la lógica de servidor existente.
- PWA para añadir a la pantalla de inicio de iPhone.
- Interfaz adaptable a móviles.

## Importante: alcance real
Esta entrega es una **fase inicial funcional**, no la versión comercial completa del prompt maestro. El motor 3D se carga desde el CDN de jsDelivr, por lo que el navegador necesita acceso a internet para descargar Three.js. Si WebGL está deshabilitado, se muestra un aviso. La partida multijugador conserva las limitaciones del MVP anterior: las salas están en memoria y se pierden si Render reinicia el proceso. No se han implementado todavía cuentas persistentes, ranking real, tienda con transacciones, bots, chat de voz ni reconexión robusta.

Las reglas de dominó regionales pueden variar. Antes de usar la app en torneos, deben validarse las variantes de puntuación y de cierre con los jugadores.

## Ejecutar localmente
Requiere Node.js 18 o superior.

```bash
npm install
npm start
```

Abre `http://localhost:3000`.

## Publicar en GitHub y Render
1. Descomprime el ZIP.
2. Sube **el contenido de esta carpeta a la raíz** del repositorio GitHub, no dentro de otra subcarpeta.
3. En Render, crea o actualiza un **Web Service** conectado al repositorio.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Espera a que el servicio quede `Live` y abre la URL HTTPS.
7. Para probar multijugador, abre la misma URL en dos dispositivos y comparte el código de la mesa.
8. En Safari de iPhone: Compartir → Añadir a pantalla de inicio.

GitHub Pages por sí solo no ejecuta el servidor Socket.IO. Para las salas en línea, usa Render u otro host Node.js.
