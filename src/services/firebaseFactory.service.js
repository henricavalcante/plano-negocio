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

        firebase.auth().signInWithPopup(provider).then(function(result) {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          var token = result.credential.accessToken;
          var secret = result.credential.secret;
          // The signed-in user info.
          var user = result.user;
          console.log(result.user);
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
    }
}

export default angular.module('services', [])
.service('FirebaseFactory', FirebaseFactory)
.name;
