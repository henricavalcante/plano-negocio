import angular from 'angular';

class Session {

  constructor() {
    this.suported = 'sessionStorage' in window;
  }

  set (user) {
    if (this.suported) {
      sessionStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  get () {
    if (this.suported) {
      return JSON.parse(sessionStorage.getItem('currentUser'));
    }
  }

  clear () {
    sessionStorage.clear();
  }

}

export default angular.module('services.Session', [])
  .service('Session', Session)
  .name;
