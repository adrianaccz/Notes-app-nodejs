// Config para requerir rutas
const express = require("express");
const router = express.Router();

// requerimos models, el modelo de la BD
const User = require("../models/User");

// requerimos passport
const passport = require('passport');        // requerimos metodo passport para autenticar

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

// Login
router.post("/users/signin", passport.authenticate('local', {
  successRedirect: '/notes',                                      // si el ususario esta bien va a redireccionar a notes
  failureRedirect: '/users/signin',                               // si el ususario esta mal va a redireccionar a sigin
  failureFlash: true
}));

router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const { name, email, password, confirm_password } = req.body; // requerimos del body la siguiente info: name, email, passw, corfirm_pass
  const errors = [];
  
  try {
    if (name.length <= 0) {
      errors.push({ text: "Name are required" });
    }
    if (email.length <= 0) {
      errors.push({ text: "Email are required" });
    }
    if (password != confirm_password) {
      errors.push({ text: "Passwords do not macht" }); // push en para insertar en el arreglo error el error
    }
    if (password.length < 0) {
      errors.push({ text: "Password must be al least 4 characters" });
    }
    if (errors.length > 0) {
      res.render("users/signup", {
        errors,
        name,
        email,
        password,
        confirm_password,
      });
    } else {
      const userEmail = await User.findOne({ email: email }); // verificar que no exita el correo
      if (userEmail) {
        req.flash("error", "The email is already in use");
        res.redirect("/users/signup");
        console.log('email existe')
      } else {
      console.log('email no existe')
      const newUser = new User({ name, email, password }); // con esto creamos el usuario
      newUser.password = await newUser.encryptPassword(password); // encriptamos la password con el metodo creado en el modelo
      await newUser.save(); // guardamos el nuevo usuario
      req.flash("success_msg", "You are registered");
      res.redirect("/users/signin");
    } }
  } catch(error) {
    console.log(`**********ERROR*********** ${error}`)
  }
});

router.get('/users/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

module.exports = router;
