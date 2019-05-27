const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

  create() {
    return this.user != null &&
      (this.user.role == 1 || this.user.role == 2);
  }

  show() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin());  }
}