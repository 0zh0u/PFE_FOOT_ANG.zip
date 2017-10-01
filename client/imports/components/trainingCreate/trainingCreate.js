import angular from "angular";
import angularMeteor from "angular-meteor";
// import hammer from 'hammerjs';


import template from "./trainingCreate.html";

const INITIAL_TRAINING = {
    _id: 'tocreate',
    name: '',
    type: '',
    difficulty: 'Facile',
    Exercises: []
};

const INITIAL_EXERCISE = {
    name: '',
    nb_series:1,
    repetition:1
};

class TrainingCreateCtrl {
    constructor($scope,$mdDialog) {

        $scope.viewModel(this);

        this.training = INITIAL_TRAINING;

        this.exerciseToAdd = INITIAL_EXERCISE;

        this.closeDialog = function() {
            $mdDialog.hide();
        };
    }

    createTraining() {
        this.training._id = "training" + new Date().getTime();

        Meteor.call('teams.createTraining', this.teamId, angular.copy(this.training));

        this.training = INITIAL_TRAINING;
        this.closeDialog();
    }

    addExercise() {
        //for(var i = 0; i < this.trainingUpd.Exercises.length; ++i)
        //if(this.trainingUpd.Exercises[i].name === this.exerciseToAdd.name)
        //  return;

        this.training.Exercises.push({name: this.exerciseToAdd.name, nb_series: this.exerciseToAdd.nb_series, repetition: this.exerciseToAdd.repetition});

        this.exerciseToAdd = INITIAL_EXERCISE;
    }
}

const name = 'trainingCreate'

export default angular.module(name, [
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope','$mdDialog', TrainingCreateCtrl],
        bindings: {
            teamId: "<"
        }
    });