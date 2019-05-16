const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');


module.exports = {
  signUp(req, res, next){
    res.render("users/sign_up");
  },

  create(req, res, next){

    let newUser = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/sign_up");
      } else {
        //send email
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
          to: user.email,
          from: 'brianguta2000@yahoo.com',
          subject: "You've created an account on Blocipiedia",
          text: 'Thanks for joining!',
          html: '<strong>Hope to see you around often!</strong>',
        };
        sgMail.send(msg);
        //sign in
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully signed in!");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next){
    res.render("users/sign_in");
  },

  signIn(req, res, next){

    passport.authenticate('local', function(err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("sign_in");
      }
      req.logIn(user, function(err) {
        if (err) {
          return next(err);
        }
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      });
    }) (req, res, next);

    // passport.authenticate("local")(req, res, () => {
    //   if(!req.user){
    //     req.flash("notice", "Sign in failed. Please try again.");
    //     res.redirect("users/sign_in");
    //   } else {
    //     req.flash("notice", "You've successfully signed in!");
    //     res.redirect("/");
    //   }
    // })
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  }
}