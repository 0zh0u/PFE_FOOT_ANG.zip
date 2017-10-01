import angular from "angular";
import angularMeteor from "angular-meteor";
import {Teams} from "../../../../api/Teams";

import template from "./sessionPlay.html";

class SessionPlayCtrl {

    constructor($scope, $mdDialog, $timeout) {

        var ctrl = this;
        ctrl.index = 0;
        ctrl.tabIndex = 0;
        ctrl.previousTime = 0;
        $scope.operation = "initial";

        $scope.viewModel(ctrl);

        ctrl.closeDialog = function() {
            $mdDialog.hide();
        };

        $timeout(() => {
            ctrl.event = angular.copy(ctrl.session);
        });

        $scope.startOrStop = function (){
            switch($scope.operation) {
                case "initial":
                    $scope.operation = "running";
                    $scope.$broadcast('timer-start');
                    break;
                case "running":
                    $scope.operation = "stoppedAndNext";
                    $scope.$broadcast('timer-stop'); //Declenche l'evenement TIMER-STOPPED
                    $scope.$broadcast('timer-resume');
                    if(ctrl.index >= ctrl.session.Trainings.length) {
                        $scope.operation = "stop";
                        $scope.$broadcast('timer-stop');
                    }
                    break;
                case "stoppedAndNext":
                    $scope.operation = "stopped";
                    ctrl.tabIndex = ctrl.index;
                    break;
                case "stopped":
                    $scope.operation = "running";
                    $scope.$broadcast('timer-stop'); //Declenche l'evenement TIMER-STOPPED
                    $scope.$broadcast('timer-resume');
                    ctrl.tabIndex = ctrl.index;
                    break;
                case "stop":
                    $scope.operation = "ended";
                    ctrl.session.status = "Terminé";
                    break;
                default:
                    break;
            }
        };

        $scope.reset = function(){
            ctrl.tabIndex = 0;
            ctrl.index = 0;
            ctrl.previousTime = 0;
            $scope.operation = "initial";
            ctrl.session.status = "Nouveau";
            for (i = 0; i < ctrl.session.Trainings.length; i++) {
                ctrl.session.Trainings[i].time = 0;
            }
            $scope.$broadcast('timer-start'); //Reset du timer
            $scope.$broadcast('timer-clear');
        };

        $scope.cancel = function(){
            $scope.reset();
            ctrl.closeDialog();
        }

        $scope.$on('timer-stopped', function (event, args){
            if($scope.operation === "running") {
                if (ctrl.index - 1 >= 0) {
                    ctrl.session.Trainings[ctrl.index - 1].breakTime = args.millis - ctrl.previousTime;
                    ctrl.previousTime = args.millis;
                }
            }
            else {
                if (ctrl.index < ctrl.session.Trainings.length) {
                    ctrl.session.Trainings[ctrl.index].time = args.millis - ctrl.previousTime;
                    ctrl.previousTime = args.millis;
                    ctrl.index += 1;
                }
            }
        });

        $scope.$on('timer-tick', function (event, args){
            if($scope.operation==="running") {
                if (ctrl.index < ctrl.session.Trainings.length) {
                    ctrl.session.Trainings[ctrl.index].time = args.millis - ctrl.previousTime;
                }
            }
        });
    }
}

const name = 'sessionPlay'

export default angular.module(name,[
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controllerAs : name,
        controller: ['$scope', '$mdDialog', '$timeout', SessionPlayCtrl],
        bindings: {
            team: "=",
            session: "="
        }
    });
