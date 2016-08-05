import 'bootstrap/dist/css/bootstrap.css';

import angular from 'angular';
import uirouter from 'angular-ui-router';
import config from './app.config';
import plano from './features/plano';

angular.module('app', [uirouter, plano])
    .config(config);
