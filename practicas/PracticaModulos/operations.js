function numbers(a, b) { if (!Number.isFinite(a) || !Number.isFinite(b)) throw new Error('Usa números válidos.'); }
function sumar(a, b) { numbers(a, b); return a + b; }
function restar(a, b) { numbers(a, b); return a - b; }
function multiplicar(a, b) { numbers(a, b); return a * b; }
function dividir(a, b) { numbers(a, b); if (b === 0) throw new Error('No se puede dividir entre cero.'); return a / b; }
// Exportar permite reutilizar la misma lógica desde app.js y desde el laboratorio web.
module.exports = { sumar, restar, multiplicar, dividir };
