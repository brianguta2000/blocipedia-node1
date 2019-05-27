const wikiQueries = require("../db/queries.wikis.js");
const PublicAuthorizer = require("../policies/publicWiki.js");
const PrivateAuthorizer = require("../policies/privateWiki.js");
const GeneralAuthorizer = require("../policies/application.js");
const markdown = require( "markdown" ).markdown;


module.exports = {
  index(req, res, next){
    wikiQueries.getAllWikis((err, wikis) => {
      if (err){
        console.log(err);
        res.redirect(500, "static/index");
      } else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next){
    const authorized = new GeneralAuthorizer(req.user).new();

    if(authorized){
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  create(req, res, next){
    let wikiIsPrivate = (req.body.private === "true");

    let authorized;

    if(wikiIsPrivate){
      authorized = new PrivateAuthorizer(req.user).create();
    } else {
      authorized = new PublicAuthorizer(req.user).create();
    }

    if (authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: wikiIsPrivate,
        userId: req.user.id,
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect (500, "/wikis/new");
        } else {
          res.redirect (303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },

  show (req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/");
      } else {
        wiki.body = markdown.toHTML( wiki.body );
        res.render("wikis/show", {wiki});
      }
    });
  },

  destroy (req, res, next) {
    wikiQueries.deleteWiki(req, (err, topic) => {
      if(err) {
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/");
      } else {
        res.render("wikis/edit", {wiki});
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
}