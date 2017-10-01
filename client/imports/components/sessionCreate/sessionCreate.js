import angular from "angular";
import angularMeteor from "angular-meteor";
// import hammer from 'hammerjs';
import {Teams} from "../../../../api/Teams";


import template from "./sessionCreate.html";

const INITIAL_SESSION = {
    _id: 'tocreate',
    type:"session",
    city: '',
    location: '',
    date: new Date().getTime(),
    duration: 0,
    Trainings: [],
    status:"Nouveau",
};

class SessionCreateCtrl {
    constructor($scope,$mdDialog) {

        var ctrl = this;

        $scope.viewModel(this);

        ctrl.session = INITIAL_SESSION;

        ctrl.closeDialog = function() {
            $mdDialog.hide();
        };
    }

    createSession() {
        this.session._id = 'session' + new Date().getTime();

        Meteor.call('teams.createSession', this.team._id, angular.copy(this.session));

        this.session = INITIAL_SESSION;
        this.closeDialog();
    }

    removeTraining(trainingToRemove) {
        this.session.Trainings = _.reject(this.session.Trainings, function(el) { return el._id === trainingToRemove._id });
    }

    addTraining(trainingToAdd) {
        this.session.Trainings.push({_id: trainingToAdd._id + "_" + this.session.Trainings.length, ext_id: trainingToAdd._id , name: trainingToAdd.name + " - " + trainingToAdd.difficulty, time:0, breakTime:0, Exercises:trainingToAdd.Exercises});
    }
}

const name = 'sessionCreate'

export default angular.module(name, [
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope','$mdDialog', SessionCreateCtrl],
        bindings: {
            team: "="
        }
    });