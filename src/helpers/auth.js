// asegurar rutas (autenticar que este logeado)

const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        req.flash('error', 'Not Authenticated');
        res.redirect('/users/signin');
    }
};

module.exports = helpers;