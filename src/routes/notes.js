// Config para requerir rutas
const express = require('express');
const router = express.Router();

// requerimos models, el modelo de la BD
const Note = require('../models/Note');                // con este Note despues podremos hacer note.update, note.delete, etc

//
const {isAuthenticated} = require('../helpers/auth');  // autenticar que este logeado

router.get('/notes', isAuthenticated, async(req, res) => {
    const notes = await Note.find({user: req.user.id}).sort({date: 'desc'}).lean();                        //find: encontrar nota, lean: aparezca nota, sort: arreglarla de forma descendiente
    res.render('notes/all-notes', {notes});
});

router.get('/notes/add', isAuthenticated, (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) => {           // funcion asincronica
    const {title, description} = req.body;                   // aqui solicitamos q se guarde en una const el titulo y la descripcion de lo q se tomo del body
    const errors = [];                                       // const para guardar los errores en forma de arreglo
    if(!title) {                                            // Validamoos los errores que pueda tener el formulario
        errors.push({text: 'Please Write a Title'});         // si no hay un titulo, insertamos(push) un nuevo objeto en el arreglo de tipo texto
    }
    if(!description) {
        errors.push({text: 'Please Write a Description'});
    }
    if(errors.length > 0){                                  // si errores > 0, devulveme la pagina de new-note con el tipo de error, el titulo y la descrip. q ya escribiste 
        res.render('notes/new-note', {
            errors,
            title,
            description
        });
    } else {
        const newNote = new Note({ title, description});     // guardamos en una const el titulo y descripcion de una nueva nota
        newNote.user = req.user.id;                             // guardar nota relacionando con el id del ususario
        await newNote.save();                                // await: cuando termines de salvar puedes terminar con el resto de la funcion 
        req.flash('success_msg', 'Note Added Successfully!!');   // requerimos un mensaje flash ('nombre de la variable (que esta en variables globales, index.js)', 'mensaje que contiene en la variable')
        res.redirect('/notes');
    }    
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) => { 
    const note = await Note.findById(req.params.id).lean();           // encuentra la nota por id y metela en la constante note
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {                        // editar nota seleccionada
    const {title, description} = req.body;                                      
    await Note.findByIdAndUpdate(req.params.id, {title, description}).lean();   // actualiza por id los parametros titulo y descripcion
    req.flash('success_msg', 'Note Updated Successfully!!');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {                        // eliminar nota
    await Note.findByIdAndDelete(req.params.id).lean();                                 // elimina por id 
    req.flash('success_msg', 'Note Deleted Successfully!!');
    res.redirect('/notes');
});

module.exports = router;