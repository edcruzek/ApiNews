const app = require('express')();
app.use(require('express').json()); app.use('/api', require('./routes/UserRoute'));
if (require.main === module) app.listen(3103, () => console.log('Teoría en http://localhost:3103'));
module.exports = app;
