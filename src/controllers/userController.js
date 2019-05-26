const userQueries = require("../db/queries.users.js");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const keyPublishable = process.env.PUBLISHABLE_KEY;
const keySecret = process.env.SECRET_KEY;
const stripe = require("stripe")(keySecret);


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
          from: 'ari.abramowitz1@gmail.com',
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
  },

  signOut(req, res, next){
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },

  upgradeCharge(req, res, next){
    let amount = 1500;

    stripe.customers.create({
      email: req.body.email,
      card: req.body.id
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Upgrade to Premium Account",
        currency: "usd",
        customer: customer.id
      }))
    .then(charge => res.send(charge))
    .catch(err => {
      console.log("Error:", err);
      res.status(500).send({error: "Purchase Failed"});
    });
  },

  upgradeForm(req, res, next){

    let currentUserId;

    if(req.user && req.user.dataValues.id){
      currentUserId = req.user.dataValues.id
    } else {
      currentUserId = 0;
    }
    userQueries.getUser(currentUserId, (err, user) => {
      if(err || user == null){
        req.flash("notice", "You must be signed in to do that.");
        res.redirect("/");
      } else {
        if (user.role === 0){
          res.render("users/upgrade");
        } else {
          req.flash("notice", "You already have a premium account. No need to upgrade!");
          res.redirect(`/`);
        }
      }
    })
  },

  upgradeUser(req, res, next){
    let userId = req.user.dataValues.id;

    userQueries.upgradeUser(userId, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/upgradeForm");
      } else {
        req.flash("notice", "You've been upgraded to a premium account!");
        res.redirect("/");
      }
    })
  },

  downgradeForm(req, res, next){
    let currentUserId;

    if(req.user && req.user.dataValues.id){
      currentUserId = req.user.dataValues.id
    } else {
      currentUserId = 0;
    }

    userQueries.getUser(currentUserId, (err, user) => {
      if(err || user == null){
        req.flash("notice", "You must be signed in to do that.");
        res.redirect("/");
      } else {
        if (user.role === 1){
          res.render("users/downgrade");
        } else {
          req.flash("notice", "You already have a standard account. No need to downgrade!");
          res.redirect(`/`);
        }
      }
    })
  },

  downgradeUser(req, res, next){
    let userId = req.user.dataValues.id;

    userQueries.downgradeUser(userId, (err, user) => {
      if(err){
        req.flash("error", err);
        res.redirect("/users/downgradeForm");
      } else {
        req.flash("notice", "You've been downgraded to a standard account!");
        res.redirect("/");
      }
    })
  }

}