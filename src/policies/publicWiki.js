const ApplicationPolicy = require("./application");

module.exports = class PublicWikiPolicy extends ApplicationPolicy {

  update() {
    return this.edit();
  }

  destroy() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin());
  }
}