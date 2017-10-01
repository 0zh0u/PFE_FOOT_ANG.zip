import angular from "angular";
import angularMeteor from "angular-meteor";
import {Teams} from "../../../../api/Teams";

import template from "./navig.html";

class Navig {
    constructor($scope,$mdMedia) {
        $scope.viewModel(this);

        this.subscribe('teams');

        this.helpers({
            $mdMedia() {
                return $mdMedia;
            },
            teams() {
                return Teams.find(
                    // {
                    //     _id: { $ne: this.getReactively('currentTeam._id') }
                    // }
                );
            }
        });
    }
}

const name = 'navig'

export default angular.module(name, [
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controller: ['$scope', '$mdMedia', Navig],
        controllerAs: name,
        bindings: {
            currentTeam: '=',
            menuOpened: '='
        }
    });
