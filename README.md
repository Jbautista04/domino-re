# DOMINÓ RD — versión visual para iPhone

Paquete actualizado para subir directamente a la raíz de un repositorio GitHub y desplegar como **Web Service** en Render. Incluye interfaz móvil renovada inspirada en juegos de dominó, salas privadas multijugador mediante Socket.IO, selección de mesa de 2 o 4 jugadores, marcador, fichas y PWA instalable.

## Publicar desde iPhone
1. En GitHub, abre el repositorio `domino-re` y sube/reemplaza los archivos de este ZIP en la **raíz** del repositorio. Conserva los nombres y no los metas dentro de `public/`.
2. En Render, el servicio debe ser **Web Service**, con `Root Directory` vacío.
3. `Build Command`: `npm install`.
4. `Start Command`: `npm start`.
5. Espera a que el despliegue quede `Live`.
6. Prueba `https://TU-APP.onrender.com/health`; debe mostrar JSON con `ok: true`. Luego abre la URL principal.
7. En Safari: Compartir → Añadir a pantalla de inicio.

## Incluye
- Crear mesa privada de 2 o 4 jugadores y compartir código.
- Meta de 100, 150, 200, 250, 300 o 500 puntos.
- Doble seis, turnos, pases, pozo en modo de 2 jugadores, marcador e historial.
- Variante experimental de regla de 30.
- Interfaz renovada y adaptada a iPhone.

## Límites actuales
Competitivo, ranking y tienda aparecen como funciones futuras y no están implementados. No hay cuentas, chat de voz, avatares, bots ni persistencia de salas. Las salas se pierden cuando Render reinicia el proceso. Las reglas de cuadrar y regla de 30 son preliminares. Validar las reglas antes de torneos; no usar para apuestas.

## Loop de desarrollo iterativo
Este ZIP incluye `LOOP_DOMINO_RD.md`, `TASKS_LOOP.json` y `CHANGELOG_LOOP.md`. Ábrelos en un agente de programación con acceso a los archivos y terminal para que implemente las tareas una por una, ejecute pruebas, registre resultados y continúe hasta completar o bloquear justificadamente cada tarea. El loop es un plan de trabajo para un agente; no se ejecuta solo al desplegar la aplicación.
