const { DataTypes } = require('sequelize');
const sequelize = require('../config.db');
const common = { timestamps: true, underscored: true };
const Profile = sequelize.define('Profile', { nombre: { type: DataTypes.STRING(40), allowNull: false, unique: true } }, { ...common, tableName: 'perfiles' });
const State = sequelize.define('State', { nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true } }, { ...common, tableName: 'estados' });
const Category = sequelize.define('Category', {
  nombre: { type: DataTypes.STRING(100), allowNull: false, unique: true }, descripcion: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
}, { ...common, tableName: 'categorias' });
const User = sequelize.define('User', {
  nombre: { type: DataTypes.STRING(80), allowNull: false }, apellido: { type: DataTypes.STRING(80), allowNull: false },
  correo: { type: DataTypes.STRING(190), allowNull: false, unique: true },
  password_hash: { type: DataTypes.STRING(255), allowNull: false }, activo: { type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
  perfil_id: { type: DataTypes.INTEGER, allowNull: false }, estado_id: { type: DataTypes.INTEGER, allowNull: false },
}, { ...common, tableName: 'usuarios', defaultScope: { attributes: { exclude: ['password_hash'] } }, scopes: { conPassword: { attributes: { include: ['password_hash'] } } } });
const New = sequelize.define('New', {
  titulo: { type: DataTypes.STRING(180), allowNull: false }, contenido: { type: DataTypes.TEXT('long'), allowNull: false },
  imagen: { type: DataTypes.TEXT('long'), allowNull: true },
  estatus: { type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'), defaultValue: 'pendiente', allowNull: false },
  categoria_id: { type: DataTypes.INTEGER, allowNull: false }, estado_id: { type: DataTypes.INTEGER, allowNull: false }, usuario_id: { type: DataTypes.INTEGER, allowNull: false },
}, { ...common, tableName: 'noticias' });
Profile.hasMany(User, { foreignKey: 'perfil_id', as: 'usuarios', onDelete: 'RESTRICT' });
User.belongsTo(Profile, { foreignKey: 'perfil_id', as: 'perfil' });
State.hasMany(User, { foreignKey: 'estado_id', as: 'usuarios', onDelete: 'RESTRICT' });
User.belongsTo(State, { foreignKey: 'estado_id', as: 'estado' });
User.hasMany(New, { foreignKey: 'usuario_id', as: 'noticias', onDelete: 'RESTRICT' });
New.belongsTo(User, { foreignKey: 'usuario_id', as: 'autor' });
Category.hasMany(New, { foreignKey: 'categoria_id', as: 'noticias', onDelete: 'RESTRICT' });
New.belongsTo(Category, { foreignKey: 'categoria_id', as: 'categoria' });
State.hasMany(New, { foreignKey: 'estado_id', as: 'noticias', onDelete: 'RESTRICT' });
New.belongsTo(State, { foreignKey: 'estado_id', as: 'estado' });
module.exports = { sequelize, Profile, State, Category, User, New };
