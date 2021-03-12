const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // Quiero la estrategia de autenticacion

// requerimos el modelo de User de BD
const User = require('../models/User');


//metodo para para definir nueva estrategia de autenticacion (METODO PARA AUTENTICAR) 
passport.use(new LocalStrategy({
    usernameField: 'email'                                        // parametros que el ususario va a mandar para autenticar
}, async(email, password, done) => {                            // funcion para validar 
    const user = await User.findOne({email: email});            // buscamos usuarios por email
    if(!user) {                                                 // si usuario no existe EN BD
        return done(null, false, {message: 'Not User Found'});  // done es un callback q se utiliza para terminar la funcion
    } else {
        const match = await user.matchPassword(password);       // ver si las password son iguales
        if(match) {
            return done(null, user);                            //(null(ya que no hay error), user(devuelve el ususario encontrado))
        } else {
            return done(null, false, {message: 'Incorrect Password'});
        }
    }
}));

// Para las sesiones (guardamos sesion por ID)
passport.serializeUser((user, done) => {                // almacenamos el id en sesion 
    done(null, user.id);
});

// Proceso inverso
passport.deserializeUser((id, done) => {                // toma un id y genera el usuario
    User.findById(id, (err, user) => {
        done(err, user);
    });
});