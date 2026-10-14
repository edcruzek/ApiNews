const express = require('express'); const app = express();
app.use(express.json()); app.use('/usuarios', require('./routes/UserRoute'));
if (require.main === module) app.listen(3104, () => console.log('Usuarios en http://localhost:3104/usuarios'));
module.exports = app;
