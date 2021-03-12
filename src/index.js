const express = require('express');
const path = require('path'); 
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');

//Inicializaciones
const app = express();
require('./database');                                       // Inicializamos la base de datos
require('./config/passport');                                // requerimos passport

//Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));            // definir rutas de las carpetas 
app.engine('.hbs', exphbs({                                 // funcion que tiene dentro objeto de configuracion, plantilla layout
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layout'),     // ruta de layout
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'                                       // que extension tienen los archivos
}));
app.set('view engine', '.hbs');

//Middeblares  --> funciones que se ejecutan antes de llegar a las rutas
app.use(express.urlencoded({extended: false}));            // para tomar informacion de los formularios
app.use(methodOverride('_method'));                       // para aceptar metodos put, delete, post, get.....
app.use(session({                                         // conf para las sesiones
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());                             
app.use(passport.session());
app.use(flash());                                         // mensajes a multiples vistas

//Variables globales
app.use((req, res, next) => {                             // mensaje para que se vea en todas las vistas, NEXT es para q el navegador no se quede cargando y continue con el siguiente codigo
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');   
    res.locals.error = req.flash('error');                 // mensajes de error de passport
    res.locals.user = req.user || null;                     // enviar saludo de bienvenida
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));

//Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

//Server listen
app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});