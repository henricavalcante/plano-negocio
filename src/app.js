import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import 'whatwg-fetch';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import navigation from './directives/navigation.directive';
import header from './directives/header.directive';
import messages from './directives/messages.directive';
import help from './directives/help.directive';
import confirmClick from './directives/confirmClick.directive';
import FirebaseFactory from './services/firebaseFactory.service';
import Session from './services/sessionStorage.service';
import PlanoStatus from './services/planoStatus.service';
import login from './features/login';
import logout from './features/logout';
import resetPassword from './features/reset-password';
import plano from './features/plano';
import revisar from './features/revisar';
import correcao from './features/planos';

angular.module('app', [
  uirouter,
  navigation,
  header,
  messages,
  help,
  confirmClick,
  FirebaseFactory,
  Session,
  PlanoStatus,
  login,
  logout,
  resetPassword,
  plano,
  correcao,
  revisar
]).config(config);
