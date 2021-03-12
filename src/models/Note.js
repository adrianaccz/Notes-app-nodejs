// CREAR MODELOS

//  requerimos mongoose
const mongoose = require('mongoose');

// guardamos los datos en un objeto Schema
const { Schema } = mongoose;

// Schema es como una clase
// definimos que propiedades van a tener en este caso las notas que es lo que queremos guardar en BD
const NoteSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    date: {type: Date, default: Date.now},
    user: {type: String}
});

// exportamos el modelo para poder utilizar en otras partes del proyecto el model('nombre q se le de', nombre de la constante: NoteSchema)
module.exports = mongoose.model('Note', NoteSchema);