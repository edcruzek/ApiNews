# Cobertura del curso

| Sección | Archivo o bloque realizado | Cómo demostrarlo en la web |
|---|---|---|
| 1.1 Instalación de Node | package.json y README con versión requerida | El servidor ejecuta las rutas; en salud aparece Express |
| 1.2 Arquitectura de Node | Explicación en informe y práctica EventEmitter | Módulos y eventos: secuencia de ejecución |
| 1.3 Módulos | practicas/PracticaModulos/operations.js y app.js | Calcular con el módulo |
| 1.4 Eventos | practicas/PracticaEventos/app.js | Emitir saludo |
| 2.1 Servidor | practicas/MiPrimerExpress/app.js y app.js principal | Primer servidor |
| 2.2 Rutas | GET /api/practicas/inicio y ejemplo /home | Botón Primer servidor |
| 2.3 Middleware | middlewares/logger.js, cors y express.json | Registro visible y encabezado de respuesta |
| 2.4 Funciones y errores | practicas/Actividad24 y PracticeRoute | Estados, pares, igualdad, error 503 |
| 3.1 HTTP | GET, POST, PUT, PATCH y DELETE | Usuarios, catálogos y noticias |
| 3.2 params query y body | TeoriaInformacionRutas | Tres botones de origen de información |
| Práctica usuarios | PracticaInformacionRutas | Consultar, filtrar, agregar y eliminar |
| 4.1 Endpoints | docs/openapi.json | Swagger /docs |
| 4.2 JSON | Modelos y cuerpos documentados | Inspector de solicitud y respuesta |
| 4.3 Swagger y Postman | docs/openapi.json y colección Postman | Swagger y archivo para importar |
| 5 MySQL y Sequelize | config.db.js y models | Salud y catálogos persistentes |
| 6.2 Controladores | Profile, Category, State, User y New controllers/routes | Catálogos, usuarios y noticias |
| 6.3 Relaciones | Asociaciones e include | Noticias con categoría, estado y autor; usuarios con perfil, estado y noticias |
| 7.2 Validaciones | validators por recurso y validate | Enviar datos inválidos y observar 422 |
| 8 JWT | AuthController y middleware authenticate | Registro, login, 401 sin token y 403 sin permiso |
| 9 Preparación | CORS, JSON de 2 MB, dotenv y .env.example | Bloque Configuración y despliegue |
| 10 Publicación | render.yaml y DESPLIEGUE.md | https://api-news-edcruzek.onrender.com con Express y MySQL alojado en Clever Cloud |

No se expone ni se entrega la configuración .env privada. La web añade una demostración visual a las prácticas sin sustituir Express o MySQL por respuestas simuladas.
