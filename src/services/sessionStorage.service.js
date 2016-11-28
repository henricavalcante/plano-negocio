import angular from 'angular';

class Session {
  constructor() {
    this.suported = 'sessionStorage' in window;
  }

  set(key, value) {
    if (this.suported) {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }

  get(key) {
    if (this.suported) {
      return JSON.parse(sessionStorage.getItem(key));
    }
  }

  upsertCurrentUser(newUser) {
    var currentUser = this.get('currentUser');
    this.set('currentUser', angular.extend(currentUser, newUser));
  }

  getCurrentUser() {
    return get('currentUser');
  }

  getProject() {
    return get('project');
  }

  clear() {
    sessionStorage.clear();
  }

}

export default angular.module('services.Session', [])
  .service('Session', Session)
  .name;
