const operations = require('./operations');
if (require.main === module) console.log({ suma: operations.sumar(12, 8), resta: operations.restar(12, 8), producto: operations.multiplicar(12, 8), cociente: operations.dividir(12, 8) });
module.exports = operations;
