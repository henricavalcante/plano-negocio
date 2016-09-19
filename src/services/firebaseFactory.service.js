import angular from 'angular';
import firebase from 'firebase';

const API_KEY = "AIzaSyA8-T3HWTOISE5pQzG1x9OoYXQpa7A6-Vs";
const AUTH_DOMAIN = "meuplanodenegocios-3a542.firebaseapp.com";
const DATABASE_URL = "https://meuplanodenegocios-3a542.firebaseio.com";
const STORAGE_BUCKET = "meuplanodenegocios-3a542.appspot.com";

class FirebaseFactory {

  constructor(Session) {

    Object.assign(this, {Session});

    this.config = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: DATABASE_URL,
      storageBucket: STORAGE_BUCKET
    };
    this.firebase = firebase.initializeApp(this.config);
  }

  set(path, data) {
    this.firebase.database().ref(path).set(data);
  }

  get(path) {
    return fetch(`${this.config.databaseURL}/${path}.json?auth=${this.getAccessToken()}`);
  }

  update(path, data) {
    this.firebase.database().ref(path).update(data);
  }

  getAuth() {
    return this.Session.get();
  }

  getAccessToken() {
    return this.getAuth().stsTokenManager.accessToken;
  }

  authFacebook() {

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');

    return firebase.auth().signInWithPopup(provider).then((user) => {
      this.Session.set(this.firebase.auth().currentUser);
      return this.firebase.auth().currentUser;
    });
  }

  authTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();

    return firebase.auth().signInWithPopup(provider).then((user) => {
      this.Session.set(this.firebase.auth().currentUser);
      return this.firebase.auth().currentUser;
    });;
  }
}

export default angular.module('services.FirebaseFactory', [])
  .service('FirebaseFactory', FirebaseFactory)
  .name;
