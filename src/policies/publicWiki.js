const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

  edit() {
    return this.new();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin());
  }
}