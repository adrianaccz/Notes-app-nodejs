const mongoose = require('mongoose');

// requerimos modulo para encriptacion
const bcrypt = require('bcryptjs');

// guardamos los datos en un objeto Schema
const { Schema } = mongoose;

// Schema es como una clase
// definimos que propiedades van a tener en este caso las notas que es lo que queremos guardar en BD
const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    date: {type: Date, default: Date.now}
});

// metodo para encriptar contraseña, nombre-del-schema.methods.nombre-que-quieras-dar
UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);                          // gensalt es para generar los hash
    const hash = bcrypt.hash(password, salt);
    return hash;
};

// metodo para comprar contraseña q instroduce el user con la encriptada
UserSchema.methods.matchPassword = async function (password) {       // se usa function para poder acceder a las propiedades del user schema
    return await bcrypt.compare(password, this.password);      // compare metodo para comparar
};

// exportamos el modelo para poder utilizar en otras partes del proyecto el model('nombre q se le de', nombre de la constante: UserSchema)
module.exports = mongoose.model('User', UserSchema);  