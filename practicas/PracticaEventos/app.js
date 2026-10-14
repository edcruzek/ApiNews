const { EventEmitter } = require('node:events');
function demostrarEventos(nombre) {
  const emisor = new EventEmitter();
  const pasos = ['1. Se crea un emisor de eventos.', '2. Se registra un listener para saludo.'];
  emisor.on('saludo', (persona) => pasos.push(`4. El listener recibe el evento y saluda a ${persona}.`));
  pasos.push('3. Se emite el evento saludo.'); emisor.emit('saludo', nombre);
  pasos.push('5. Continúa la ejecución de la aplicación.');
  return pasos;
}
if (require.main === module) console.log(demostrarEventos('Estudiante'));
module.exports = demostrarEventos;
