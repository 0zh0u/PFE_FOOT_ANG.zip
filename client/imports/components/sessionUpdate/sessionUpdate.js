import angular from "angular";
import angularMeteor from "angular-meteor";
import {Teams} from "../../../../api/Teams";

import template from "./sessionUpdate.html";

class SessionUpdateCtrl {

    constructor($scope, $mdDialog, $timeout) {

        $scope.viewModel(this);

        var ctrl = this;

        ctrl.closeDialog = function() {
            $mdDialog.hide();
        };

        $timeout(() => {
            ctrl.sessionUpd = angular.copy(ctrl.session);
        });

        ctrl.deleteSession = () => {
            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr de vouloir supprimer cette séance ?')
                .textContent("Cette séance sera supprimée de l'équipe.")
                .ariaLabel('Confirmer la suppression')
                .ok('Je suis sûr, supprimer cette séance')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(() => Meteor.call('teams.deleteSession', ctrl.team._id, ctrl.session._id));
        };

        ctrl.updateSession = () => Meteor.call('teams.updateSession', ctrl.team._id, angular.copy(ctrl.sessionUpd));
    }

    removeTraining(trainingToRemove) {
        this.sessionUpd.Trainings = _.reject(this.sessionUpd.Trainings, function(el) { return el._id === trainingToRemove._id });
    }

    addTraining(trainingToAdd) {
        this.sessionUpd.Trainings.push({_id: trainingToAdd._id + "_" + this.sessionUpd.Trainings.length, ext_id: trainingToAdd._id, name: trainingToAdd.name + " - " + trainingToAdd.difficulty, time:0, breakTime:0, Exercises:trainingToAdd.Exercises});

    }
}

const name = 'sessionUpdate'

export default angular.module(name,[
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controllerAs : name,
        controller: ['$scope', '$mdDialog', '$timeout', SessionUpdateCtrl],
        bindings: {
            team: "=",
            session: "="
        }
    });
