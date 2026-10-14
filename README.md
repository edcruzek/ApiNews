# Curso completo de Express y ApiNews

Laboratorio web para demostrar las actividades del curso sin usar una terminal durante la presentación. Cada botón llama a Express y las operaciones de ApiNews utilizan una base MySQL real.

## Demostración

Una vez iniciado por el desarrollador, abre **http://localhost:3100**. Usa el menú para recorrer módulos, eventos, funciones, rutas, usuarios en memoria, arquitectura, catálogos, validaciones, JWT y noticias.

La actividad de pares usa los primeros diez pares positivos, del 2 al 20. El registro visible de solicitudes pertenece a cada sesión de navegador. Las noticias solo se vuelven públicas después de aprobación del administrador.

## Preparación local para el desarrollador

1. Instala Node.js 22 o posterior y MySQL 8.
2. Crea una base vacía llamada `api_news_curso`.
3. Copia `.env.example` a `.env` y configura la conexión y una clave JWT larga aleatoria. No subas `.env`.
4. Define `DEMO_ADMIN_PASSWORD` para crear la cuenta ficticia `admin@curso.local` al sembrar los datos.
5. Ejecuta `npm install` y `npm start`. El inicio crea tablas ausentes sin borrar datos y carga datos de muestra si `SEED_DEMO=true`.

La demostración local preparada usa una cuenta ficticia con clave `CursoExpress2026!`. Es exclusivamente la clave de prueba de ApiNews, nunca la contraseña de MySQL. En producción configura una clave propia en el servicio y desactiva la ayuda de inicio de sesión local automáticamente con `NODE_ENV=production`.

## Carpetas

- `public/`: interfaz web del laboratorio.
- `practicas/`: seis proyectos iniciales, con módulos exportables y archivos de arranque independiente.
- `routes/`: endpoints de ApiNews y prácticas integradas.
- `controllers/`: operaciones CRUD, relaciones y autenticación.
- `models/`: modelos Sequelize y relaciones MySQL.
- `validators/`: validaciones por recurso.
- `middlewares/`: registro, autenticación JWT y autorización.
- `scripts/`: siembra y generación de documentación.
- `docs/`: Swagger, Postman, guía de despliegue y matriz del curso.
- `tests/`: pruebas de integración que usan una base MySQL temporal independiente.
- `app.js`: servidor y composición de los módulos.
- `config.db.js`, `config.js`: conexión y configuración con variables de entorno.

## Documentación y pruebas

Abre `/docs` para Swagger. Importa `docs/ApiNews.postman_collection.json` en Postman; modifica `baseUrl`, la contraseña de demostración del login y el ID que quieras probar. El login guarda el token automáticamente en la colección.

`npm test` crea y elimina únicamente una base temporal con nombre `api_news_curso_test_<PID>`; requiere que el usuario de MySQL tenga permiso para crear bases. No borra la base de la demostración. La batería prueba validaciones, autorización, integridad referencial y aprobación de noticias.

## Publicación

El archivo `render.yaml` prepara un servicio Node. La conexión MySQL de producción debe configurarse con credenciales de una base alojada y accesible desde Render. Consulta `docs/DESPLIEGUE.md`. La misma aplicación sirve la página y la API, así que se presenta con un único enlace.

Fuente: [Curso de APIs en Express.js](https://verbose-vole-299.notion.site/Curso-de-Aprendizaje-APIs-en-Express-js-Material-039dc4a6e2ff4a8688cee28388e95a27).
