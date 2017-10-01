import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import drag from "ng-sortable";
import {Teams} from "../../../../api/Teams";
import {name as Navig} from "../navig/navig";
import {name as playerRow} from "../playerRow/playerRow";
import {name as playerPost} from "./playerPost/playerPost";

import template from "./teamView.html";

class TeamViewCtrl {
    constructor($scope,$stateParams,$timeout) {
        'ngInject';
        $scope.viewModel(this);
        var ctrl = this;

        /*$scope.Formation =[
            {column: [{disabled: "true"},{disabled: "true"},{field: "GK",playerId:"psgJ1"},{disabled: "true"},{disabled: "true"}]},
            {column : [{field: "L_B"},{field: "LC_B",playerId:"psgJ1"},{field: "C_B"},{field: "RC_B"},{field: "R_B"}]},
            {column : [{field: "L_DM"},{field: "LC_DM",playerId:"psgJ1"},{field: "C_DM"},{field: "RC_DM"},{field: "R_DM"}]},
            {column : [{field: "L_M"},{field: "LC_M",playerId:"psgJ1"},{field: "C_M"},{field: "RC_M"},{field: "R_M"}]},
            {column : [{field: "L_AM"},{field: "LC_AM",playerId:"psgJ1"},{field: "C_AM",playerId:"psgJ1"},{field: "RC_AM"},{field: "R_AM"}]},
            {column :[{disabled: "true"},{field: "LC_F"},{field: "C_F",playerId:"psgJ1"},{field: "RC_F"},{disabled: "true"}]}
        ];*/
        this.helpers({
            team() {
                return Teams.findOne({_id: $stateParams.teamId});
            }
        });
        //$reactive(this).attach($scope);
        ctrl.totalPlayers = [];
        //ctrl.subscribe('teams');


        /*this.helpers({
            currentFormation() {
                console.log($stateParams.teamId);
                return angular.copy(Teams.findOne({_id: $stateParams.teamId}).formation);
            }
        });*/

        /*$timeout(function () {
            console.log($scope.currentFormation);
            console.log(Teams.findOne({_id: $stateParams.teamId}));
            console.log(Teams.findOne({_id: $stateParams.teamId}).formation);
            ctrl.currentFormation = angular.copy(Teams.findOne({_id: $stateParams.teamId}).formation);
        });*/
    }

}

const name = 'teamView'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    Navig,
    playerPost

])
    .component(name, {
        templateUrl: template,
        controller: ['$scope',"$stateParams","$timeout", TeamViewCtrl],
        controllerAs : name
    }).config(function ($stateProvider) {
            'ngInject';
            $stateProvider.state('teamView', {
                url: '/:teamId/team',
                template: '<team-view flex layout="column"></team-view>'
            });
        });
