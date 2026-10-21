# DOMINÓ RD — MVP multijugador para iPhone

## Incluye
- PWA instalable con diseño adaptado a iPhone.
- Salas online con código y hasta 2 o 4 jugadores.
- Reparto doble-seis, turnos, jugadas legales, pasar, tranca, puntuación a meta elegida e historial.
- Modo de dos jugadores con pozo y acción Robar.
- Servidor Node.js + Socket.IO. El servidor mantiene las manos privadas y valida turnos.
- Manifest e iconos para Añadir a pantalla de inicio.

## Importante: prototipo funcional, no versión comercial terminada
Las reglas regionales varían entre grupos. En este MVP, "regla de los 30" se interpreta como no sumar una mano si el premio calculado es menor de 30 puntos; confirma si tu grupo usa otra interpretación. "Cuadrar" se registra como acción cuando los extremos coinciden y el jugador tiene ese número; aún no aplica todas las convenciones locales. Antes de torneos o juego por dinero, hay que validar las reglas.

## Publicación recomendada: Render
GitHub Pages solo aloja archivos estáticos y no ejecuta Socket.IO/Node.js. Para multijugador real necesitas un servidor.

1. Sube la carpeta completa a un repositorio de GitHub.
2. En Render crea un **Web Service** desde ese repositorio.
3. Build command: `npm install`. Start command: `npm start`.
4. Render asignará una URL HTTPS, por ejemplo `https://tu-app.onrender.com`.
5. Abre esa URL en Safari en cada iPhone. Compartir → Añadir a pantalla de inicio.
6. Comparte el código de sala con los demás jugadores.

## Ejecutar en ordenador
Requiere Node.js 18 o superior:
```bash
npm install
npm start
```
Abre `http://localhost:3000`. Para probar entre teléfonos distintos, el servidor debe estar desplegado y accesible por HTTPS.

## Limitaciones
- Las salas viven en memoria del servidor y se pierden si este reinicia.
- No hay cuentas ni recuperación automática tras desconexión.
- La regla de 30 está interpretada como umbral mínimo del premio de la mano.
- El modo de dos jugadores tiene pozo, pero las reglas exactas de robo deben validarse.
- "Cuadrar" es preliminar, no una regla universal.
- Para una versión robusta se recomienda persistencia, reconexión, prevención de trampas y pruebas con jugadores dominicanos.
