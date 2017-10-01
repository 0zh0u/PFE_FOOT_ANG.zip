import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {Teams} from "../../../../api/Teams";

import template from "./teamCreate.html";

class teamCreateCtrl {
    constructor($scope, $state) {

        $scope.viewModel(this);
        this.team = {};
        this.subscribe('teams');
        this.helpers({
            team(){
                return $scope.getReactively('$ctrl.team');
            }
            });

        this.addTeam = (newTeam) => {
            var formation = [
                {"column": [ {disabled: "true"},{disabled: "true"},{field: "GK"},{disabled: "true"},{disabled: "true"}]},
                {"column" : [{field: "L_B"},{field: "LC_B"},{field: "C_B"},{field: "RC_B"},{field: "R_B"}]},
                {"column" : [{field: "L_DM"},{field: "LC_DM"},{field: "C_DM"},{field: "RC_DM"},{field: "R_DM"}]},
                {"column" : [{field: "L_M"},{field: "LC_M"},{field: "C_M"},{field: "RC_M"},{field: "R_M"}]},
                {"column" : [{field: "L_AM"},{field: "LC_AM"},{field: "C_AM"},{field: "RC_AM"},{field: "R_AM"}]},
                {"column" :[{disabled: "true"},{field: "LC_F"},{field: "C_F"},{field: "RC_F"},{disabled: "true"}]},
                {"column" :[{disabled: "true"},{disabled: "true"},{disabled: "true"},{disabled: "true"},{disabled: "true"}]}
            ];

            Teams.insert({
                _id : newTeam._id,
                name : newTeam.name,
                Players: [],
                Events: [],
                formationName: 'Formation principale',
                formation: formation,
                Trainings: []
            });

            $state.go('dashboard', {teamId: newTeam._id});
        }
    }
}

const name = 'teamCreate'

export default angular.module(name, [
    angularMeteor,
    uiRouter
])
    .component(name, {
        templateUrl: template,
        controllerAs : name,
        controller: ['$scope', '$state', teamCreateCtrl]
    }).config(function ($stateProvider) {
    'ngInject';

    $stateProvider
        .state('createTeam', {
            url: '/create-team',
            template: '<team-create></team-create>'
        });
});

