const User = require("./models").User;
const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;

module.exports = {
  getAllWikis(callback){
    return Wiki.all({
      include: [
        {model: Collaborator, as: "collaborators", include: [
          {model: User}
        ]}, {model: User}
      ]
    })
    .then((wikis) => {
      callback(null, wikis);
    })
    .catch((err) => {
      callback(err);
    })
  },

  addWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getWiki(id, callback) {
    return Wiki.findById(id, {
      include: [
        {model: Collaborator, as: "collaborators", include: [
          {model: User}
        ]}, {model: User}
      ]
    })
    .then((wiki) => {
      callback(null, wiki);
    })
    .catch((err) => {
      callback(err);
    })
  },

  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id)
    .then((wiki) => {

      wiki.destroy()
      .then((res) => {

        callback(null, wiki);
      });
    })
    .catch((err) => {
      callback(err);
    })
  },

  updateWiki(req, updatedWiki, callback){
    return Wiki.findById(req.params.id)
    .then((wiki) => {
      if(!wiki){
        return callback("Wiki not found");
      }

      wiki.update(updatedWiki, {
        fields: Object.keys(updatedWiki)
      })
      .then(() => {
        callback(null, wiki);
      })
      .catch((err) => {
        callback(err);
      });
    });
  }
}

