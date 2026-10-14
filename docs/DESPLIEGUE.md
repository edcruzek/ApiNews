# Despliegue de ApiNews

## Enlaces de esta entrega

- Laboratorio: https://api-news-edcruzek.onrender.com
- Swagger: https://api-news-edcruzek.onrender.com/docs
- Código público: https://github.com/edcruzek/ApiNews
- Informe: `informe/Informe_Express_ApiNews.pptx` y su versión PDF.

El 13 de octubre de 2026 se comprobó desde internet una respuesta HTTP 200 de `/api/salud` con MySQL, el registro de un contribuidor y el inicio de sesión. Render usa un servicio gratuito; Clever Cloud usa MySQL DEV (10 MB, cinco conexiones). La contraseña de la cuenta administradora se entrega en un archivo privado local, excluido del repositorio.

La interfaz y la API pertenecen a una sola aplicación Express. Render ejecuta `npm start` y la base MySQL se conecta desde `config.db.js`.

## Render

1. Publica el proyecto en el repositorio público ApiNews.
2. Crea un Web Service de Node usando ese repositorio y la rama main.
3. Build Command: `npm ci --omit=dev`. Start Command: `npm start`.
4. Selecciona el plan gratuito si está disponible. No aceptes un plan de pago sin decidirlo explícitamente.
5. Configura las variables de entorno: `NODE_ENV=production`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `JWT_SECRET`, `SEED_DEMO=true` y `DEMO_ADMIN_PASSWORD`.
6. Usa una clave JWT aleatoria larga y una contraseña de administrador distinta a la de la base.
7. Configura el health check `/api/salud` y despliega.

## MySQL alojado

El curso utiliza Clever Cloud para la base MySQL. Crea una base nueva para este proyecto; toma host, puerto, nombre de base, usuario y contraseña del panel del proveedor. Esos datos se introducen únicamente en el entorno de Render, nunca en GitHub ni en la presentación. Si el proveedor no ofrece un plan gratuito, la selección de un plan con costo requiere decisión del usuario.

Sequelize crea las tablas al iniciar con `sync`, sin `force` ni borrado. El script de siembra añade los perfiles y ejemplos faltantes. Si prefieres importar SQL, utiliza `docs/schema.mysql.sql` en la base destinada al curso.

## Verificación desde el navegador

- Abre el enlace público de Render y presiona Verificar servidor y base de datos.
- Abre `/docs` y comprueba que Swagger describe la API.
- Registra una cuenta ficticia, inicia sesión y crea una noticia pendiente.
- Entra como administrador con la cuenta `admin@curso.local` y la clave que configuraste, aprueba la noticia y revisa que aparezca en la consulta pública.
- Comprueba que enviar una operación protegida sin token produce 401 y con un contribuidor sin privilegios produce 403.

Si el host tarda en responder después de estar inactivo, espera a que el alojamiento reactive el servicio y vuelve a consultar. No presentes una URL como publicada hasta verificar salud y datos desde internet.
