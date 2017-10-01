import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {name as Navig} from "../navig/navig";
import {name as TrainingCreateCtrl} from "../trainingCreate/trainingCreate";
import {name as TrainingUpdateCtrl} from "../trainingUpdate/trainingUpdate";
import {Teams} from "../../../../api/Teams";

import template from "./trainings.html";

class TrainingsCtrl {
    constructor($scope,$stateParams,$mdDialog, $timeout) {

        //$reactive($scope).attach($scope);

        $scope.helpers({
            team() {
                return Teams.findOne({_id: $stateParams.teamId});
            }
        });

        $scope.teamId = $stateParams.teamId;

        $scope.selected = [];

        $scope.queryParams = {
            order: 'name',
            limit: 5,
            page: 1
        };

        $scope.promise = $timeout(function () {
            // loading
        }, 2000);

        $scope.showDialog = function(ev, id) {
            $mdDialog.show({
                contentElement: '#'+ id +'-Pop',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        };

        $scope.bulkDeleteTrainings = function() {
            var content = "Ces exercices seront supprimés de l'équipe : ";
            var trainings = "";
            for(var i = 0; i < $scope.selected.length; ++i)
                trainings += ", " + $scope.selected[i].name;

            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr de vouloir supprimer ces exercices ?')
                .textContent(content + trainings.substring(2))
                .ariaLabel('Confirmer la suppression')
                .ok('Je suis sûr, supprimer ces exercices')
                .cancel('Annuler');

            var trainingsId = [];

            $scope.selected.map(e => trainingsId.push(e._id));

            $mdDialog.show(confirm).then(() => {
                Meteor.call('teams.deleteTrainings', $scope.teamId, trainingsId);
                $scope.selected = [];
            });
        };
    }
}

const name = 'trainings'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    TrainingCreateCtrl,
    TrainingUpdateCtrl,
    Navig

])
    .component(name, {
        templateUrl: template,
        controllerAs : name,
        controller : ["$scope","$stateParams",'$mdDialog', '$timeout',TrainingsCtrl],
        bindings: {
            training: "="
        }
    })
    .config(function ($stateProvider) {
            'ngInject';
            $stateProvider.state('trainings', {
                url: '/:teamId/trainings',
                template: '<trainings flex layout="column"></trainings>'
            });
        }
    );
