import angular from 'angular';
import Firebase from 'firebase';

const API_KEY = "AIzaSyA8-T3HWTOISE5pQzG1x9OoYXQpa7A6-Vs";
const AUTH_DOMAIN = "meuplanodenegocios-3a542.firebaseapp.com";
const DATABASE_URL = "https://meuplanodenegocios-3a542.firebaseio.com";
const STORAGE_BUCKET = "meuplanodenegocios-3a542.appspot.com";

class FirebaseFactory {

  constructor() {

    var config = {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      databaseURL: DATABASE_URL,
      storageBucket: STORAGE_BUCKET
    };
    this.firebase = firebase.initializeApp(config);
  }

  set(path, data) {
    this.firebase.database().ref(path).set(data);
  }

  get(path) {
    return this.firebase.database().ref(path);
  }

  update(path, data) {
    this.firebase.database().ref(path).update(data);
  }

  getAuth() {
    return this.firebase.auth().currentUser;
  }

  authFacebook() {

    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');

    return firebase.auth().signInWithPopup(provider);
  }

  authTwitter() {
    var provider = new firebase.auth.TwitterAuthProvider();

    return firebase.auth().signInWithPopup(provider);
  }
}

export default angular.module('services.FirebaseFactory', [])
  .service('FirebaseFactory', FirebaseFactory)
  .name;
