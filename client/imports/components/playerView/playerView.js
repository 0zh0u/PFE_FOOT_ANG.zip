import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {Teams} from "../../../../api/Teams";
import {name as PlayerStatChart} from "../playerStatChart/playerStatChart";

import template from "./playerView.html";

class PlayerViewCtrl {
    constructor($scope, $mdDialog) {
        $scope.viewModel(this);

        this.closeDialog = function() {
            $mdDialog.hide();
        };
    }
}

const name = 'playerView'

export default angular.module(name, [
    angularMeteor,
    PlayerStatChart
])
    .component(name, {
        templateUrl: template,
        controller: ['$scope', '$mdDialog', PlayerViewCtrl],
        controllerAs : name,
        bindings: {
            player: "="
        }
    });