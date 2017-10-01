import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import ngMessages from 'angular-messages';
import ngMaterial from 'angular-material';
import ngDatatable from 'angular-material-data-table';
import timePicker from 'ng-material-datetimepicker';
import charts from 'angular-chart.js/dist/angular-chart';
import 'ngjs-color-picker/dist/ngjs-color-picker.js';
import 'ng-material-datetimepicker/css/material-datetimepicker.css';
import 'angular-material-data-table/dist/md-data-table.min.css';
import 'angular-material/angular-material.css';
import 'chart.js/dist/Chart.min.js';
import 'angular-chart.js/dist/angular-chart.min.js';
import 'chart.piecelabel.js/src/Chart.PieceLabel.js';
import 'angular-material/angular-material.css';
import 'angular-timeline/dist/angular-timeline.js';
import 'angular-timeline/dist/angular-timeline.css';
import 'angular-timer/dist/angular-timer.js';
import 'chart.js/dist/Chart.min.js';
import 'angular-chart.js/dist/angular-chart.min.js';
import {name as SelectTeam} from "../selectTeam/selectTeam";
import {name as DashboardCtrl} from "../dashboard/dashboard";
import {name as PlayersCtrl} from "../players/players";
import {name as playerView} from "../playerView/playerView";
import {name as teamCreate} from "../teamCreate/teamCreate";
import {name as EventFollowCtrl} from "../eventFollow/eventFollow";
import {name as teamView} from "../teamView/teamView";
import {name as trainings} from "../trainings/trainings";
import {name as SelectPlayersCtrl} from "../selectPlayers/selectPlayers";

import {name as sessions} from "../sessions/sessions";
import {name as StatsCtrl} from "../stats/stats";
import {Teams} from "../../../../api/Teams";

//import {Teams} from "../../../../api/Teams";


import template from "./trem.html";

class Trem {

}

const name = 'trem'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    ngMessages,
    ngMaterial,
    ngDatatable,
    timePicker,
    'angular-timeline',
    'timer',
    'chart.js',
    'ngjsColorPicker',
    SelectTeam,
    DashboardCtrl,
    PlayersCtrl,
    playerView,
    teamView,
    trainings,
    sessions,
    teamCreate,
    EventFollowCtrl,
    StatsCtrl,
    SelectPlayersCtrl
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: Trem
    }).config(function ($locationProvider, $urlRouterProvider) {
        'ngInject';

        $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise('/teams');
    }).filter('startFrom', function() {
        return function(input, start) {
            if(!input)
                return;

            start = +start; //parse to int
            return input.slice(start);
        }
    }).filter('hourSecond', function() {
        return function(seconds) {
          if(!seconds) return "00:00";

          var min = parseInt(seconds / 60);
          var sec = seconds % 60;

          return (min < 10 ? "0" : "") + min +":"+ (sec < 10 ? "0" : "") + sec;
        };
    });
