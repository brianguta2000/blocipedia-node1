const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const bcrypt = require("bcryptjs");
const Sequelize = require('sequelize');

module.exports = {
  createCollaborator(newCollaborator, callback){
    //if collaborator is owner, throw error
    return Wiki.findOne({where: {
      id: wikiId
    }})
    .then((wiki) => {
      if (wiki.userId === newCollaborator.userId){
        var err = {};
        err.msg = "That user owns this wiki. No need to make them a collaborator!"
        err.param = "";
        callback(err);
      } else {
        Collaborator.findOne({ where: {
          userId: newCollaborator.userId,
          wikiId: newCollaborator.wikiId,
        } })
        .then((collaborator) => {
          if(collaborator){
            var err = {};
            err.msg = "That user is already a collaborator for this wiki."
            err.param = "";
            callback(err);
          } else {
            Collaborator.create({
              userId: newCollaborator.userId,
              wikiId: newCollaborator.wikiId,
            })
            .then((user) => {
              callback(null, user);
            })
            .catch((err) => {
              callback(err);
            })
          }
        })
      }
    })
  },

  deleteCollaborator(req, callback){
    return Collaborator.findById(req.params.collaboratorId)
    .then((collaborator) => {
      collaborator.destroy()
      .then((res) => {

        callback(null, collaborator);
      });
    })
    .catch((err) => {
      callback(err);
    })
  }
}