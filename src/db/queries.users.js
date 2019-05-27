const User = require("./models").User;
const Wiki = require("./models").Wiki;
const bcrypt = require("bcryptjs");
const Sequelize = require('sequelize');

module.exports = {
  createUser(newUser, callback){

    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      name: newUser.name,
      email: newUser.email,
      password: hashedPassword
    })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUser(id, callback){
    return User.findById(id)
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  getUserByEmail(email, callback){
    User.findOne({ where: {email} })
    .then((user) => {
      callback(null, user);
    })
    .catch((err) => {
      callback(err);
    })
  },

  upgradeUser(id, callback){
    return User.findById(id)
    .then((user) => {
      if(!user){
        return callback("User not found");
      }

      user.update(
        {role: 1},
        {where: id}
      )
      .then(() => {
        callback(null, user);
      })
      .catch((err) => {
        callback(err);
      });
    });
  },

  downgradeUser(id, callback){
    const Op = Sequelize.Op;

    return Wiki.update({
      private: false
    }, {
      where: {
        userId: {
          [Op.eq]: id
        }
      }
    })
    .then(() => {
      User.findById(id)
      .then((user) => {
        if(!user){
          return callback("User not found");
        }

        user.update(
          {role: 0},
          {where: id}
        )
        .then(() => {
          callback(null, user);
        })
        .catch((err) => {
          callback(err);
        })
      })
      .catch((err) => {
        callback(err);
      })
    })
  }
}