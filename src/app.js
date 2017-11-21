import 'bootstrap/dist/css/bootstrap.css';
import './style.css';

import 'whatwg-fetch';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import navigation from './directives/navigation.directive';
import header from './directives/header.directive';
import subheader from './directives/subheader.directive';
import messages from './directives/messages.directive';
import help from './directives/help.directive';
import confirmClick from './directives/confirmClick.directive';
import revisao from './directives/revisao.directive';
import classificacao from './directives/classificacao.directive';
import FirebaseFactory from './services/firebaseFactory.service';
import Session from './services/sessionStorage.service';
import PlanoStatus from './services/planoStatus.service';
import PlanoClassificacao from './services/planoClassificacao.service';
import ProjectName from './services/projectName.service';
import UserFactory from './factories/user.factory';
import byStatus from './filters/byStatus.filter';
import byClassificacao from './filters/byClassificacao.filter';
import login from './features/login';
import logout from './features/logout';
import resetPassword from './features/reset-password';
import plano from './features/plano';
import revisar from './features/revisar';
import correcao from './features/planos';
import lista from './features/lista';
import listaPublica from './features/listaPublica';

angular.module('app', [
  uirouter,
  navigation,
  header,
  subheader,
  messages,
  help,
  confirmClick,
  classificacao,
  FirebaseFactory,
  Session,
  PlanoStatus,
  PlanoClassificacao,
  ProjectName,
  UserFactory,
  byStatus,
  byClassificacao,
  login,
  logout,
  resetPassword,
  plano,
  correcao,
  revisar,
  revisao,
  lista,
  listaPublica
]).config(config);
