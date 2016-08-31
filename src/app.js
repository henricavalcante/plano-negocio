import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import navigation from './directives/navigation.directive';
import FirebaseFactory from './services/firebaseFactory.service';
import Session from './services/sessionStorage.service';
import login from './features/login';
import logout from './features/logout';
import plano from './features/plano';

angular.module('app', [
  uirouter,
  navigation,
  FirebaseFactory,
  Session,
  login,
  logout,
  plano
]).config(config);
