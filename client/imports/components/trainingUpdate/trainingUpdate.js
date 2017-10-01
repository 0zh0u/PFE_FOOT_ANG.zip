import angular from "angular";
import angularMeteor from "angular-meteor";

import template from "./trainingUpdate.html";

const INITIAL_EXERCISE = {
    name: '',
    nb_series:1,
    repetition:1
};

class TrainingUpdateCtrl {
    constructor($scope, $mdDialog, $timeout) {
        $scope.viewModel(this);

        this.exerciseToAdd = INITIAL_EXERCISE;

        this.closeDialog = function() {
            $mdDialog.hide();
        };

        $timeout(() => {
            this.trainingUpd = angular.copy(this.training);
        });

        this.deleteTraining = () => {
            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr de vouloir supprimer cet exercice ?')
                .textContent("Cet exercice sera supprimé de l'équipe.")
                .ariaLabel('Confirmer la suppression')
                .ok('Je suis sûr, supprimer cet exercice')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(() => Meteor.call('teams.deleteTraining', this.teamId, this.training._id));
        };

        this.updateTraining = () => Meteor.call('teams.updateTraining', this.teamId, angular.copy(this.trainingUpd));

    }

    addExercise() {
        //for(var i = 0; i < this.trainingUpd.Exercises.length; ++i)
            //if(this.trainingUpd.Exercises[i].name === this.exerciseToAdd.name)
              //  return;

        this.trainingUpd.Exercises.push({name: this.exerciseToAdd.name, nb_series: this.exerciseToAdd.nb_series, repetition: this.exerciseToAdd.repetition});

        this.exerciseToAdd = INITIAL_EXERCISE;
    }
}

const name = 'trainingUpdate'

export default angular.module(name,[
    angularMeteor
    ])
    .component(name, {
        templateUrl: template,
        controllerAs : name,
        controller: ['$scope', '$mdDialog', '$timeout', TrainingUpdateCtrl],
        bindings: {
            teamId: "<",
            training: "<"
        }
    });
