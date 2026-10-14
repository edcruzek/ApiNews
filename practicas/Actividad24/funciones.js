function estados() { return ['Yucatán', 'Campeche', 'Quintana Roo', 'Jalisco', 'Ciudad de México']; }
function pares() { const resultado = []; for (let i = 1; i <= 10; i++) resultado.push(i * 2); return resultado; }
function iguales(a, b) { return a === b; }
module.exports = { estados, pares, iguales };
