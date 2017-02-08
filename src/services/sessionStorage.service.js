import angular from 'angular';

class Session {
  constructor() {
    this.suported = 'localStorage' in window;
  }

  set(key, value) {
    if (this.suported) {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  get(key) {
    if (this.suported) {
      return JSON.parse(localStorage.getItem(key));
    }
  }

  upsertCurrentUser(newUser) {
    var currentUser = this.get('currentUser') || {};
    this.set('currentUser', angular.extend(currentUser, newUser));
  }

  getCurrentUser() {
    return get('currentUser');
  }

  getProject() {
    return get('project');
  }

  clear() {
    localStorage.clear();
  }

}

export default angular.module('services.Session', [])
  .service('Session', Session)
  .name;
