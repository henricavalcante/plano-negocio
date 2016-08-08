import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import login from './features/login';
import plano from './features/plano';

angular.module('app', [uirouter, login, plano])
    .config(config);
