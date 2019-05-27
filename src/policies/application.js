module.exports = class ApplicationPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == 2;
  }

  _isCollaborator() {
    var isCollaborator = false;
    // console.log(this.record.collaborators);
    if(this.record){
      for(let i = 0; i < this.record.collaborators.length; i++){
        if (this.record.collaborators[i].User.id === this.user.id){
          isCollaborator = true;
          break;
        }
      }
    }
    return this.record && isCollaborator;
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new() && this.record;
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}