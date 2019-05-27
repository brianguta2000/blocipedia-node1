const wikiQueries = require("../db/queries.wikis.js");
const userQueries = require("../db/queries.users.js");
const collaboratorQueries = require("../db/queries.collaborators.js");
const CollaboratorAuthorizer = require("../policies/collaborator.js");
const markdown = require( "markdown" ).markdown;


module.exports = {
  show(req, res, next) {

    wikiId = parseInt(req.params.wikiId);
    wikiQueries.getWiki(wikiId, (err, wiki) => {
      const authorized = new CollaboratorAuthorizer(req.user, wiki).show();

      if(!wiki.private) {
        req.flash("notice", "This wiki is public. Any signed in user can edit.");
        res.redirect(`/wikis/${wiki.id}`);
      } else if(authorized){
        if(err || wiki == null) {
          res.redirect(404, "/");
        } else {
          res.render("collaborators/show", {wiki});
        }
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
      }
    });
  },

  create(req, res, next){
    wikiId = parseInt(req.params.wikiId);
    wikiQueries.getWiki(wikiId, (err, wiki) => {
      let authorized = new CollaboratorAuthorizer(req.user, wiki).create();

      if(authorized){
        userQueries.getUserByEmail(req.body.email, (err, user) => {
          if(err || user === null){
            req.flash("notice", "There is no user with that email.");
            res.redirect(`/wikis/${req.params.wikiId}/collaborators`);
          } else {

            let newCollaborator = {
              wikiId: parseInt(req.params.wikiId),
              userId: user.id
            };
            collaboratorQueries.createCollaborator(newCollaborator, (err, comment) => {
              if(err) {
                req.flash("error", err);
              }
              res.redirect(req.headers.referer);
            });
          }
        })
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect("/wikis");
      }
    })
  },

  destroy(req, res, next){
    wikiId = parseInt(req.params.wikiId);
    wikiQueries.getWiki(wikiId, (err, wiki) => {
      const authorized = new CollaboratorAuthorizer(req.user, wiki).destroy();

      if(authorized){
        collaboratorQueries.deleteCollaborator(req, (err, collaborator) => {
          if(err) {
            req.flash("error", err);
          }
          res.redirect(303, `/wikis/${req.params.wikiId}/collaborators`);
        });
      } else {
        req.flash("notice", "You are not authorized to do that.");
        res.redirect(`/wikis/${wikiId}/collaborators`);
      }
    })
  }

}