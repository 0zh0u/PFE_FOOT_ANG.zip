import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import "fullcalendar";
import "fullcalendar/dist/locale/fr.js";
import "fullcalendar/dist/fullcalendar.min.css";
import {name as Navig} from "../navig/navig";
import {name as PlayerRow} from "../playerRow/playerRow";

import {Teams} from "../../../../api/Teams";


import template from "./eventFollow.html";

var eventTypes = [
    {
        title: 'Automatique',
        types: [
            {
                id: 'matchStart',
                badgeClass: 'info',
                badgeIconClass: 'fa-play',
                side: 'left',
                title: 'Début du match',
                automatic: true
            },
            {
                id: 'halfTime',
                badgeClass: 'info',
                badgeIconClass: 'fa-pause',
                side: 'left',
                title: 'Mi-temps',
                automatic: true
            },
            {
                id: 'matchResume',
                badgeClass: 'info',
                badgeIconClass: 'fa-play',
                side: 'left',
                title: 'Reprise du match',
                automatic: true
            },
            {
                id: 'matchEnd',
                badgeClass: 'info',
                badgeIconClass: 'fa-stop',
                side: 'left',
                title: 'Fin du match',
                automatic: true
            }
        ]
    },
    {
        title: 'Commentaires',
        types: [
            {
                id: 'comment',
                badgeClass: 'info',
                badgeIconClass: 'fa-info',
                side: 'right',
                title: "Commentaire"
            },
            {
                id: 'commentHigh',
                badgeClass: 'danger',
                badgeIconClass: 'fa-info',
                side: 'right',
                title: "Commentaire important"
            }
        ]
    },
    {
        title: 'Sorties',
        types: [
            {
                id: 'oppTouche',
                badgeClass: 'success',
                badgeIconClass: 'fa-sign-out',
                side: 'right',
                title: "Sortie en touche par l'équipe adverse"
            },
            {
                id: 'ownTouche',
                badgeClass: 'danger',
                badgeIconClass: 'fa-sign-out',
                side: 'right',
                title: "Sortie en touche par notre équipe",
                hasAttachedPlayer: true
            },
            {
                id: 'oppCorner',
                badgeClass: 'success',
                badgeIconClass: 'fa-external-link',
                side: 'right',
                title: "Sortie en corner par l'équipe adverse"
            },
            {
                id: 'ownCorner',
                badgeClass: 'danger',
                badgeIconClass: 'fa-external-link',
                side: 'right',
                title: "Sortie en corner par notre équipe",
                hasAttachedPlayer: true
            }
        ]
    },
    {
        title: 'Tirs',
        types: [
            {
                id: 'oppGoal',
                badgeClass: 'danger',
                badgeIconClass: 'fa-futbol-o',
                side: 'right',
                title: "But de l'équipe adverse"
            },
            {
                id: 'ownGoal',
                badgeClass: 'success',
                badgeIconClass: 'fa-futbol-o',
                side: 'right',
                title: "But de notre équipe",
                hasAttachedPlayer: true
            },
            {
                id: 'oppPenalty',
                badgeClass: 'danger',
                badgeIconClass: 'fa-plus-circle',
                side: 'right',
                title: "Pénaltie adverse"
            },
            {
                id: 'ownPenalty',
                badgeClass: 'success',
                badgeIconClass: 'fa-plus-circle',
                side: 'right',
                title: "Pénaltie de notre équipe",
                hasAttachedPlayer: true
            }
        ]
    },
    {
        title: 'Transferts',
        types: [
            {
                id: 'oppTransfert',
                badgeClass: 'info',
                badgeIconClass: 'fa-exchange',
                side: 'right',
                title: "Transfert de l'équipe adverse"
            },
            {
                id: 'ownTransfert',
                badgeClass: 'info',
                badgeIconClass: 'fa-exchange',
                side: 'right',
                title: "Transfert de notre équipe",
                hasAttachedPlayer: true,
                hasAttachedPlayer2: true
            }
        ]
    },
    {
        title: 'Fautes',
        types: [
            {
                id: 'oppFoul',
                badgeClass: 'warning',
                badgeIconClass: 'fa-exclamation-triangle',
                side: 'right',
                title: "Carton jaune de l'équipe adverse"
            },
            {
                id: 'oppBan',
                badgeClass: 'danger',
                badgeIconClass: 'fa-ban',
                side: 'right',
                title: "Carton rouge de l'équipe adverse"
            },
            {
                id: 'ownFoul',
                badgeClass: 'warning',
                badgeIconClass: 'fa-exclamation-triangle',
                side: 'right',
                title: "Carton jaune notre équipe",
                hasAttachedPlayer: true
            },
            {
                id: 'ownBan',
                badgeClass: 'danger',
                badgeIconClass: 'fa-ban',
                side: 'right',
                title: "Carton rouge notre équipe",
                hasAttachedPlayer: true
            }
        ]
    }
];

class EventFollowCtrl {
    constructor($scope, $timeout, $state, $stateParams, $mdMedia, $mdDialog) {
        'ngInject';

        $scope.viewModel(this);

        this.subscribe('teams');

        var ctrl = this;

        ctrl.newEvent = {};

        ctrl.eventTypes = eventTypes;

        ctrl.getEventTypesForForm = () => {
          return ctrl.eventTypes.filter(e => !e.automatic);
        };

        ctrl.parsePlayer = player => player.firstname +' '+ player.lastname;

        ctrl.findEventPlayers = () => {
            return ctrl.team.Players.filter(e => ctrl.event.invitedPlayers.filter(e2 => e2.player == e._id).length);
        };

        ctrl.ballPossession = 'Nous';

        ctrl.possessionLabels = ['Nous', 'Adversaires'];
        ctrl.possessionData = [0, 0];
        ctrl.possessionColors = ['#3f51b5', '#ff9b21'];

        var lastSeconds = 0;
        $scope.$on('timer-tick', function(event, args) {
            var ind = ctrl.possessionLabels.indexOf(ctrl.ballPossession);

            var newSeconds = args.seconds + args.minutes * 60;
            var delta = parseInt(newSeconds) - parseInt(lastSeconds);
            lastSeconds = newSeconds;

            ctrl.event.possessionData[ind] += delta;
            ctrl.event.timer += delta;
        });

        ctrl.isAddDisabled = () => {
          return !(ctrl.newEvent.type && (!ctrl.newEvent.type.hasAttachedPlayer || ctrl.newEvent.attachedPlayer) && (!ctrl.newEvent.type.hasAttachedPlayer2 || ctrl.newEvent.attachedPlayer2));
        };

        ctrl.startMatch = () => {
            ctrl.event.oppScore = 0;
            ctrl.event.ownScore = 0;

            ctrl.event.matchEvents = [];

            ctrl.addEvent({
                type: ctrl.eventTypes[0].types.filter(e => e.id == 'matchStart')[0],
                timer: '0:00'
            });

            ctrl.event.timer = 0;
            ctrl.event.possessionData = [0, 0];

            $scope.$broadcast('timer-start');
        };

        ctrl.halfTime = () => {
          ctrl.event.hadHalfTime = true;

            ctrl.addEvent({
                type: ctrl.eventTypes[0].types.filter(e => e.id == 'halfTime')[0],
                timer: '45:00'
            });

            $scope.$broadcast('timer-stop');
        };

        ctrl.resumeMatch = () => {
            ctrl.event.completedHalfTime = true;

            ctrl.addEvent({
                type: ctrl.eventTypes[0].types.filter(e => e.id == 'matchResume')[0],
                timer: '45:00'
            });

            $scope.$broadcast('timer-resume');
        };

        ctrl.endMatch = () => {
            ctrl.addEvent({
                type: ctrl.eventTypes[0].types.filter(e => e.id == 'matchEnd')[0],
                timer: '90:00'
            });

            ctrl.event.end = new Date().getTime();

            ctrl.team.followedEvent = undefined;

            $scope.$broadcast('timer-stop');

            Meteor.call('teams.saveLive', angular.copy(ctrl.team._id), angular.copy(ctrl.event));
        };

        ctrl.addEvent = (newEvent) => {
            var event = angular.copy(newEvent.type);
            event.timer = ctrl.event.timer;
            event.comment = newEvent.comment;

            if(event.hasAttachedPlayer)
                event.attachedPlayer = newEvent.attachedPlayer;

            if(event.hasAttachedPlayer2)
                event.attachedPlayer2 = newEvent.attachedPlayer2;

            if(event.id == 'oppGoal')
                ctrl.event.oppScore += 1;
            else if(event.id == 'ownGoal')
                ctrl.event.ownScore += 1;

            ctrl.event.matchEvents.push(event);

            ctrl.newEvent = {};
        };

        ctrl.removeEvent = index => {
            var removed = ctrl.event.matchEvents[index];
            ctrl.event.matchEvents.splice(index, 1);

            if(removed.id == 'oppGoal')
                ctrl.event.oppScore -= 1;
            else if(removed.id == 'ownGoal')
                ctrl.event.ownScore -= 1;
        };

        ctrl.unfollow = () => {
            Meteor.call('teams.unfollowEvent', ctrl.team._id);

            $state.go('dashboard', {teamId: ctrl.team._id});
        }

        Tracker.autorun(function() {
            ctrl.team = Teams.findOne({_id: $stateParams.teamId});
            ctrl.event = ctrl.team ? ctrl.team.Events.filter(e => e._id == $stateParams.eventId)[0] : undefined;
        });
    }

}

const name = 'eventFollow'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    PlayerRow,
    Navig
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope', "$timeout", "$state", "$stateParams", '$mdMedia', '$mdDialog', EventFollowCtrl]
    })
    .config(function ($stateProvider) {
            'ngInject';
            $stateProvider.state('eventFollow', {
                url: '/:teamId/live/:eventId',
                template: '<event-follow flex layout="column"></event-follow>'
            });
        }
    );
