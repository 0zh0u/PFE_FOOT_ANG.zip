import angular from "angular";
import angularMeteor from "angular-meteor";


import template from "./selectPlayers.html";

class SelectPlayersCtrl {
    constructor($scope) {
        $scope.invite = function (player) {
            var idx = $scope.$ctrl.ngModel.indexOf(player._id);
            if (idx > -1) {
                $scope.$ctrl.ngModel.splice(idx, 1);
            }
            else {
                $scope.$ctrl.ngModel.push(player._id);
            }
        };

        $scope.$watch('$ctrl.ngModel', function() {
            if($scope.$ctrl.ngChange)
                $scope.$ctrl.ngChange();
        });

        $scope.inviteAll = function () {
            if ($scope.isAllInvited())
                $scope.$ctrl.ngModel = [];
            else if ($scope.$ctrl.team)
                $scope.$ctrl.ngModel = $scope.$ctrl.team.Players.slice(0).map(e => e._id);
        };

        $scope.isInvited = function (player) {
            return $scope.$ctrl.ngModel.includes(player._id);
        };

        $scope.isOneButNotAllInvited = function () {
            return $scope.$ctrl.ngModel.length > 0 && !$scope.isAllInvited();
        };

        $scope.isAllInvited = function () {
            return $scope.$ctrl.team && $scope.$ctrl.ngModel.length == $scope.$ctrl.team.Players.length;
        };
    }
}

const name = 'selectPlayers'

export default angular.module(name, [
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controllerAs: '$ctrl',
        controller: ['$scope', SelectPlayersCtrl],
        bindings: {
            ngChange: '<',
            team: '<',
            ngModel: "="
        }
    });