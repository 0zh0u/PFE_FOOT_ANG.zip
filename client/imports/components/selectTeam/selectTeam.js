import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {Teams} from "../../../../api/Teams";

import template from "./selectTeam.html";

class SelectTeamCtrl {
    constructor($scope) {
        $scope.viewModel(this);

        this.subscribe('teams');

        this.helpers({
            teams() {
                return Teams.find();
            }
        });
    }
}

const name = 'selectTeam'

export default angular.module(name, [
    angularMeteor,
    uiRouter
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope', SelectTeamCtrl]
    }).config(function ($stateProvider) {
        'ngInject';

        $stateProvider
            .state('selectTeam', {
                url: '/teams',
                template: '<select-team></select-team>'
            });
    });
