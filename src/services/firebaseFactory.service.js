import angular from 'angular';
import firebase from 'firebase';

const API_KEY = "AIzaSyA8-T3HWTOISE5pQzG1x9OoYXQpa7A6-Vs";
const AUTH_DOMAIN = "meuplanodenegocios-3a542.firebaseapp.com";
const DATABASE_URL = "https://meuplanodenegocios-3a542.firebaseio.com";
const STORAGE_BUCKET = "meuplanodenegocios-3a542.appspot.com";

class FirebaseFactory {

  constructor(Session, $rootScope) {
    Object.assign(this, {Session, $rootScope});
    this.config = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: DATABASE_URL,
      storageBucket: STORAGE_BUCKET
    };
    this.firebase = firebase.initializeApp(this.config);

    this.firebase.auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        Session.upsertCurrentUser(JSON.parse(JSON.stringify(currentUser)));
        console.log('auth changed');
      }
    });
  }

  set(path, data) {
    return this.firebase.database().ref(path).set(data);
  }

  get(path) {

    let auth = '';

    if (this.getAccessToken()) {
      auth = `?auth=${this.getAccessToken()}`;
    }

    return fetch(`${this.config.databaseURL}/${path}.json${auth}`);
  }

  getShallow(path) {
    return fetch(`${this.config.databaseURL}/${path}.json?shallow=true&auth=${this.getAccessToken()}`);
  }

  update(path, data) {
    return this.firebase.database().ref(path).update(data);
  }

  getAuth() {
    return this.Session.get('currentUser');
  }

  getAccessToken() {
    if (this.getAuth()) {
      return this.getAuth().stsTokenManager.accessToken;
    }
  }

  signInWithEmailAndPassword(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  createUserWithEmailAndPassword(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  authFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');

    return firebase.auth().signInWithPopup(provider).then((user) => {
      return this.firebase.auth().currentUser;
    });
  }

  authTwitter() {
    let provider = new firebase.auth.TwitterAuthProvider();

    return firebase.auth().signInWithPopup(provider).then((user) => {
      return this.firebase.auth().currentUser;
    });
  }

  resetPasswordWithEmail(email) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  signOut() {
    return firebase.auth().signOut();
  }

  getServerDate() {
    return firebase.database.ServerValue.TIMESTAMP;
  }
}

export default angular.module('services.FirebaseFactory', [])
  .service('FirebaseFactory', FirebaseFactory)
  .name;
