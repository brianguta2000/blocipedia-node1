const ApplicationPolicy = require("./application");

module.exports = class CollaboratorsPolicy extends ApplicationPolicy {

  create() {
    return this.user != null && this.record &&
      (this._isOwner() || this._isAdmin() || this._isCollaborator());
  }

  show() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin() || this._isCollaborator())
  }

  update() {
    return this.show();
  }

  destroy() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin())
  }
}