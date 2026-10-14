const fs = require('node:fs');
const path = require('node:path');
const directory = path.join(__dirname, '..', 'docs'); fs.mkdirSync(directory, { recursive: true });
const schemas = {
  Categoria: { type: 'object', required: ['nombre'], properties: { nombre: { type: 'string', minLength: 2, maxLength: 100 }, descripcion: { type: 'string', maxLength: 2000 } } },
  Estado: { type: 'object', required: ['nombre'], properties: { nombre: { type: 'string', minLength: 2, maxLength: 100 } } },
  Perfil: { type: 'object', required: ['nombre'], properties: { nombre: { type: 'string', minLength: 2, maxLength: 100 } } },
  Registro: { type: 'object', required: ['nombre', 'apellido', 'correo', 'password', 'estado_id'], properties: { nombre: { type: 'string', minLength: 2 }, apellido: { type: 'string', minLength: 2 }, correo: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 8, format: 'password' }, estado_id: { type: 'integer', minimum: 1 } } },
  Login: { type: 'object', required: ['correo', 'password'], properties: { correo: { type: 'string', format: 'email' }, password: { type: 'string', format: 'password' } } },
  Noticia: { type: 'object', required: ['titulo', 'contenido', 'categoria_id', 'estado_id'], properties: { titulo: { type: 'string', minLength: 5, maxLength: 180 }, contenido: { type: 'string', minLength: 10 }, categoria_id: { type: 'integer', minimum: 1 }, estado_id: { type: 'integer', minimum: 1 }, imagen: { type: 'string', nullable: true, maxLength: 1000000 } } },
  UsuarioPractica: { type: 'object', required: ['nombre', 'edad'], properties: { nombre: { type: 'string', minLength: 2 }, edad: { type: 'integer', minimum: 0, maximum: 120 } } },
  Estatus: { type: 'object', required: ['estatus'], properties: { estatus: { type: 'string', enum: ['aprobada', 'rechazada'] } } },
};
const paths = {};
const entries = [];
function add(method, url, summary, schema, auth=false, extra=[]) {
  const parameters = [...url.matchAll(/\{([^}]+)\}/g)].map(match=>({ in:'path',name:match[1],required:true,schema:{type:['a','b'].includes(match[1])?'number':'integer',...(!['a','b'].includes(match[1])?{minimum:1}:{})} }));
  const operation = { summary, tags: [url.split('/')[2]], parameters:[...parameters,...extra], responses: Object.fromEntries([200,201,204,401,403,404,409,422,503].map(status=>[status,{description:({200:'Consulta correcta',201:'Registro creado',204:'Eliminado sin cuerpo',401:'Sin autenticación válida',403:'Sin permiso',404:'No encontrado',409:'Conflicto de datos',422:'Validación incorrecta',503:'Mantenimiento de práctica'})[status]}])) };
  if(schema)operation.requestBody={required:true,content:{'application/json':{schema:typeof schema==='string'?{$ref:'#/components/schemas/'+schema}:schema}}};
  if(auth)operation.security=[{BearerAuth:[]}];
  (paths[url] ||= {})[method.toLowerCase()]=operation; entries.push({method,url,summary,schema,auth});
}
const q=(name,type='string')=>({in:'query',name,required:false,schema:{type}});
add('GET','/api/salud','Comprobar Express y MySQL');add('GET','/api/info','Consultar entorno actual');
for(const [resource,schema] of [['categorias','Categoria'],['estados','Estado'],['perfiles','Perfil']]){
  add('GET','/api/'+resource,'Listar '+resource);add('GET','/api/'+resource+'/{id}','Consultar '+resource+' por ID');
  add('POST','/api/'+resource,'Crear '+resource+' como administrador',schema,true);
  add('PUT','/api/'+resource+'/{id}','Actualizar '+resource+' como administrador',schema,true);
  add('DELETE','/api/'+resource+'/{id}','Eliminar '+resource+' si no tiene relaciones',undefined,true);
}
add('POST','/api/auth/registro','Registrar un contribuidor','Registro');add('POST','/api/auth/login','Obtener un JWT','Login');add('GET','/api/auth/yo','Consultar cuenta autenticada',undefined,true);
add('GET','/api/usuarios','Listar usuarios con perfil estado y noticias como administrador',undefined,true);
add('GET','/api/usuarios/{id}','Consultar una cuenta propia o como administrador',undefined,true);
add('POST','/api/usuarios','Crear usuario como administrador','Registro',true);add('PUT','/api/usuarios/{id}','Actualizar usuario como administrador','Registro',true);add('DELETE','/api/usuarios/{id}','Eliminar usuario sin noticias relacionadas',undefined,true);
add('GET','/api/noticias','Listar noticias aprobadas con relaciones',undefined,false,[q('q'),q('categoria_id','integer'),q('estado_id','integer')]);
add('GET','/api/noticias/gestion','Noticias propias o todas como administrador',undefined,true);add('GET','/api/noticias/{id}','Consultar noticia aprobada con categoría estado y autor');
add('POST','/api/noticias','Proponer noticia pendiente','Noticia',true);add('PUT','/api/noticias/{id}','Editar noticia propia y volver a pendiente','Noticia',true);add('PATCH','/api/noticias/{id}/estatus','Moderar noticia como administrador','Estatus',true);add('DELETE','/api/noticias/{id}','Eliminar noticia propia o como administrador',undefined,true);
add('GET','/api/usuarios-practica','Consultar arreglo con filtros',undefined,false,[q('q'),q('edadMin','integer')]);add('POST','/api/usuarios-practica','Agregar al arreglo en memoria','UsuarioPractica');add('GET','/api/usuarios-practica/{id}','Obtener usuario del arreglo');add('DELETE','/api/usuarios-practica/{id}','Eliminar usuario del arreglo');
add('GET','/api/practicas/inicio','Primer servidor y middleware');add('GET','/api/practicas/estados','Obtener cinco estados');add('GET','/api/practicas/pares','Obtener diez pares positivos');add('GET','/api/practicas/iguales/{a}/{b}','Comparar dos números');add('GET','/api/practicas/modulos/{a}/{b}','Importar y ejecutar el módulo de operaciones');add('POST','/api/practicas/eventos','Emitir el evento saludo',{type:'object',required:['nombre'],properties:{nombre:{type:'string',minLength:2}}});add('GET','/api/practicas/error','Provocar respuesta 503');add('GET','/api/practicas/solicitudes','Registro de la sesión indicada en X-Demo-Session');
add('GET','/api/teoria/usuarios/{id}','Leer req.params');add('GET','/api/teoria/busqueda','Leer req.query',undefined,false,[q('nombre'),q('edad','integer')]);add('POST','/api/teoria/usuarios','Leer req.body',{type:'object'});
const specification={openapi:'3.0.3',info:{title:'ApiNews y laboratorio Express',version:'1.0.0',description:'Curso completo con MySQL real. Los datos son de demostración. Los métodos de escritura en catálogos exigen perfil Administrador. Noticias de contribuidores requieren aprobación.'},servers:[{url:'/'}],components:{schemas,securitySchemes:{BearerAuth:{type:'http',scheme:'bearer',bearerFormat:'JWT'}}},paths};
fs.writeFileSync(path.join(directory,'openapi.json'),JSON.stringify(specification,null,2));
const examples={Categoria:{nombre:'Educación',descripcion:'Noticias del curso'},Estado:{nombre:'Nuevo León'},Perfil:{nombre:'Lector'},Registro:{nombre:'Alumno',apellido:'Curso',correo:'alumno@example.com',password:'ClavePractica2026!',estado_id:1},Login:{correo:'admin@curso.local',password:'REEMPLAZA_CON_TU_PASSWORD_DE_DEMOSTRACION'},Noticia:{titulo:'Una noticia de prueba',contenido:'Esta noticia demuestra validaciones, relaciones y moderación.',categoria_id:1,estado_id:1},UsuarioPractica:{nombre:'Elena',edad:24},Estatus:{estatus:'aprobada'}};
const groups={};
for(const entry of entries){
  const url=entry.url.replace(/\{id\}/g,'{{id}}').replace(/\{a\}/g,'5').replace(/\{b\}/g,'5');
  const headers=[{key:'X-Demo-Session',value:'{{demoSession}}'}];if(entry.schema)headers.push({key:'Content-Type',value:'application/json'});
  const request={method:entry.method,header:headers,url:{raw:'{{baseUrl}}'+url,host:['{{baseUrl}}'],path:url.slice(1).split('/')},description:entry.summary};
  if(entry.auth)request.auth={type:'bearer',bearer:[{key:'token',value:'{{token}}',type:'string'}]};
  if(entry.schema)request.body={mode:'raw',raw:JSON.stringify(examples[entry.schema]||{nombre:'Estudiante'},null,2),options:{raw:{language:'json'}}};
  const item={name:entry.summary,request,event:[{listen:'test',script:{type:'text/javascript',exec:['pm.test("Respuesta HTTP reconocida", function () { pm.expect(pm.response.code).to.be.oneOf([200,201,204,400,401,403,404,409,413,422,429,503]); });']}}]};
  if(entry.url==='/api/auth/login')item.event[0].script.exec.push('if(pm.response.code===200){pm.collectionVariables.set("token",pm.response.json().token);}');
  (groups[entry.url.split('/')[2]] ||= []).push(item);
}
fs.writeFileSync(path.join(directory,'ApiNews.postman_collection.json'),JSON.stringify({info:{name:'Curso Express y ApiNews',schema:'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'},variable:[{key:'baseUrl',value:'http://localhost:3100'},{key:'id',value:'1'},{key:'token',value:''},{key:'demoSession',value:'postman-demostracion'}],item:Object.entries(groups).map(([name,item])=>({name,item}))},null,2));
console.log(`Documentación generada: ${entries.length} operaciones.`);
