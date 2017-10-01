import angular from "angular";
import angularMeteor from "angular-meteor";


import template from "./eventCreate.html";

const INITIAL_EVENT = {
    _id: 'tocreate',
    title: '',
    city: '',
    location: '',
    type: 'match',
    invitedPlayers: []
};

class EventCreateCtrl {
    constructor($scope, $mdDialog) {
        $scope.viewModel(this);

        var ctrl = this;

        this.periodColors = [ '#5484ed', '#a4bdfc', '#46d6db', '#7ae7bf', '#51b749', '#fbd75b', '#ffb878', '#ff887c', '#dbadff', '#e1e1e1' ];
        
        this.types = [
            {id: 'match', name: 'Match', color: '#dc2127'},
            {id: 'training', name: 'Entrainement', color: '#7bd148'},
            {id: 'period', name: 'Période', color: '#5484ed'}
        ];

        this.event = INITIAL_EVENT;

        this.closeDialog = function () {
            $mdDialog.hide();
        };

        this.invite = function (player) {
            var idx = ctrl.event.invitedPlayers.indexOf(player._id);
            if (idx > -1) {
                ctrl.event.invitedPlayers.splice(idx, 1);
            }
            else {
                ctrl.event.invitedPlayers.push(player._id);
            }
        };

        this.inviteAll = function () {
            if (ctrl.isAllInvited())
                ctrl.event.invitedPlayers = [];
            else if (ctrl.team)
                ctrl.event.invitedPlayers = ctrl.team.Players.slice(0).map(e => e._id);
        };

        this.isInvited = function (player) {
            return ctrl.event.invitedPlayers.includes(player._id);
        };

        this.isOneButNotAllInvited = function () {
            return ctrl.event.invitedPlayers.length > 0 && !ctrl.isAllInvited();
        };

        this.isAllInvited = function () {
            return ctrl.team && ctrl.event.invitedPlayers.length == ctrl.team.Players.length;
        };
    }

    createEvent() {
        var ctrl = this;

        var eventToCreate = angular.copy(ctrl.event);

        eventToCreate._id = 'evt' + new Date().getTime();

        eventToCreate.allDay = ctrl.event.type == 'period';

        eventToCreate.start = ctrl.event.start.getTime();
        eventToCreate.end = ctrl.event.end ? ctrl.event.end.getTime() : undefined;

        eventToCreate.type = ctrl.types.find(e => e.id == ctrl.event.type);

        if(ctrl.event.training) {
            eventToCreate.training = angular.copy(eventToCreate.training);
            delete eventToCreate.training.$$mdSelectId;
        }

        if(ctrl.event.type != 'period')
            eventToCreate.color = eventToCreate.type.color;

        for(var i = 0; i < eventToCreate.invitedPlayers.length; ++i)
            eventToCreate.invitedPlayers[i] = {player: ctrl.event.invitedPlayers[i], confirmed: 'wait'};

        Meteor.call('teams.createEvent', this.team._id, angular.copy(eventToCreate));

        this.event = INITIAL_EVENT;
        this.closeDialog();
    }
}

const name = 'eventCreate'

export default angular.module(name, [
    angularMeteor
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope', '$mdDialog', EventCreateCtrl],
        bindings: {
            team: "<"
        }
    });