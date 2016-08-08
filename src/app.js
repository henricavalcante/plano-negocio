import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import navigation from './directives/navigation.directive';
import FirebaseFactory from './services/firebaseFactory.service';
import login from './features/login';
import plano from './features/plano';

angular.module('app', [uirouter, navigation, FirebaseFactory, login, plano])
    .config(config);
