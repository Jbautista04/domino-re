# LOOP AUTÓNOMO DE DESARROLLO — DOMINÓ RD 3D ONLINE

## Propósito
Usa este archivo como instrucción de trabajo para un agente de programación que tenga acceso al repositorio, terminal, archivos y pruebas. El loop debe mejorar el proyecto por iteraciones verificables, no limitarse a describir cambios.

## Regla principal
En cada iteración: **inspeccionar → elegir una tarea pequeña → implementar → ejecutar pruebas → corregir → registrar el resultado → continuar**. No declarar una función completa sin comprobarla.

## Arranque de cada iteración
1. Lee `README.md`, `LOOP_DOMINO_RD.md`, `TASKS_LOOP.json`, `package.json` y la estructura actual.
2. Comprueba `git status` y no sobrescribas cambios del usuario.
3. Ejecuta las pruebas existentes y registra el estado inicial.
4. Selecciona la primera tarea pendiente de `TASKS_LOOP.json` cuyas dependencias estén satisfechas.
5. Implementa solo el alcance de esa tarea y conserva las funciones existentes.
6. Añade o actualiza pruebas que demuestren el comportamiento.
7. Ejecuta `npm test` si existe; ejecuta `npm run build` si existe; ejecuta `npm start` y comprueba `/health` cuando el entorno permita hacerlo.
8. Si falla una prueba, corrige el fallo antes de marcar la tarea como terminada. No elimines pruebas para hacer pasar el build.
9. Actualiza `TASKS_LOOP.json`, `CHANGELOG_LOOP.md` y la documentación correspondiente.
10. Repite con la siguiente tarea pendiente.

## Prioridades
1. Corregir errores que impidan arrancar o entrar a una sala.
2. Motor de dominó probado y reglas coherentes.
3. Mesa 3D real con Three.js y controles táctiles.
4. Partida completa contra bots.
5. Multijugador seguro y sincronizado.
6. Persistencia y autenticación.
7. Chat, ranking, perfil, tienda y personalización.
8. Rendimiento móvil, accesibilidad y despliegue.

## Condiciones para avanzar
- Nunca rompas un comportamiento existente sin documentar por qué y añadir una prueba que justifique el cambio.
- El servidor es la autoridad para repartir las fichas, validar las jugadas, controlar turnos y calcular resultados.
- Las manos de otros jugadores no deben enviarse al cliente.
- No inventes credenciales, endpoints externos, estadísticas ni resultados de pruebas.
- Si una función necesita claves, servicios externos o una decisión de reglas regionales, implementa lo que sea posible sin secretos y registra claramente el bloqueo.
- No marques como completado un requisito que solo tiene diseño visual.
- Mantén la aplicación ejecutable después de cada iteración.
- No hagas deploy ni publiques cambios remotos sin autorización explícita del propietario.

## Definición de terminado
El loop termina solo cuando todas las tareas obligatorias de `TASKS_LOOP.json` están `done`, todas las pruebas relevantes pasan y se informa con precisión de cualquier limitación externa. Si no puede completar una tarea por falta de credenciales, herramienta o información, déjala `blocked` y explica qué se necesita.

## Formato de reporte por iteración
Añade una entrada a `CHANGELOG_LOOP.md` con:
- Fecha/hora.
- Tarea realizada.
- Archivos modificados.
- Pruebas ejecutadas y resultado real.
- Bloqueos o limitaciones.
- Próxima tarea.

## Instrucción para el agente
No respondas con una propuesta solamente. Trabaja en los archivos reales. Continúa iterando sin pedir confirmación para decisiones técnicas reversibles y de bajo riesgo. Pregunta únicamente cuando sea imprescindible una decisión de producto, una credencial o una regla local ambigua. Al finalizar cada sesión, entrega un resumen breve, lista de pruebas reales y próximos bloqueos.
