import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import navigation from './directives/navigation.directive';
import header from './directives/header.directive';
import help from './directives/help.directive';
import FirebaseFactory from './services/firebaseFactory.service';
import Session from './services/sessionStorage.service';
import login from './features/login';
import logout from './features/logout';
import resetPassword from './features/reset-password';
import plano from './features/plano';

angular.module('app', [
  uirouter,
  navigation,
  header,
  help,
  FirebaseFactory,
  Session,
  login,
  logout,
  resetPassword,
  plano
]).config(config);
