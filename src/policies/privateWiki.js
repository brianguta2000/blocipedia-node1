const ApplicationPolicy = require("./application");

module.exports = class PrivateWikiPolicy extends ApplicationPolicy {

  create() {
    return this.user != null &&
      (this.user.role == 1 || this.user.role == 2);
  }

  show(wiki) {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin() || this._isCollaborator());
  }

  edit() {
    return this.new() && this.record &&
      (this._isOwner() || this._isAdmin() || this._isCollaborator());
  }

  update() {
    return this.edit;
  }

  destroy() {
    return (this._isOwner() || this._isAdmin());
  }
}