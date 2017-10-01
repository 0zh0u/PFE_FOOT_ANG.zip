import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import "fullcalendar";
import "fullcalendar/dist/locale/fr.js";
import "fullcalendar/dist/fullcalendar.min.css";
import {name as Navig} from "../navig/navig";
import {name as PlayerRow} from "../playerRow/playerRow";
import {name as EventCreateCtrl} from "../eventCreate/eventCreate";
//import {name as EventUpdateCtrl} from "../eventUpdate/eventUpdate";
import {Teams} from "../../../../api/Teams";

import template from "./dashboard.html";
import eventModal from "./eventModal.html";

class DashboardCtrl {
    constructor($scope, $timeout, $stateParams, $mdMedia, $mdDialog) {
        'ngInject';

        $scope.viewModel(this);

        //$reactive(this).attach($scope);

        this.subscribe('teams');

        var ctrl = this;

        this.team = {};

        this.helpers({
            $mdMedia() {
                return $mdMedia;
            },
            teams: function () {
                return Teams.find();
            },
            team() {
                return team = Teams.findOne({_id: $stateParams.teamId});
            }
        });

        this.showDialog = function (ev, id) {
            $mdDialog.show({
                contentElement: '#' + id + '-Pop',
                parent: angular.element(document.body),
                clickOutsideToClose: true
            });
        };

        EventDialogController = function(event, team) {
            // Conflit bizarre avec fullcalendar sinon
            var event = ctrl.team.Events.filter(e => e._id == event._id)[0];
            return function($scope, $mdDialog, $state) {
                'ngInject';

                $scope.team = team;

                $scope.event = event;

                $scope.formatDate = function(timestamp) {
                    return new Date(timestamp);
                };

                $scope.isFutureEvent = function() {
                  return !event.end;
                };

                $scope.isTodayEvent = function() {
                    return !event.end && new Date(event.start).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
                };

                $scope.followEvent = function() {
                    team.followedEvent = event._id;
                    Meteor.call("teams.followEvent", team._id, event._id);

                    $state.go('eventFollow', {teamId: team._id, eventId: event._id});
                };

                $scope.closeDialog = function() {
                    $mdDialog.hide();
                };

                $scope.deleteEvent = function() {
                    var confirm = $mdDialog.confirm()
                        .title('Êtes-vous sûr de vouloir supprimer cet événement ?')
                        .textContent("Cet événement sera supprimé et vous n'aurez plus accès à aucune de ses données.")
                        .ok('Je suis sûr, supprimer')
                        .cancel('Annuler');

                    $mdDialog.show(confirm).then(function() {
                        Meteor.call('teams.deleteEvent', ctrl.team._id, event._id);
                    }, function() {
                    });
                };

                $scope.updateParticipation = (eventId, playerIndex, participation) => {
                    var eventIndex = ctrl.team.Events.indexOf(ctrl.team.Events.find(e => e._id == eventId));

                    Meteor.call('teams.updatePlayerParticipation', ctrl.team._id, eventIndex, playerIndex, participation);
                };

                $scope.showDialog = function (ev, id) {
                    $mdDialog.show({
                        contentElement: '#' + id + '-Pop',
                        parent: angular.element(document.body),
                        clickOutsideToClose: true,
                        multiple: true
                    });
                };

                $scope.findPlayer = player => $scope.team.Players.filter(e => e._id == player)[0];

            };
        };

        $timeout(function () {
            $scope.$watch('dashboard.team', function () {
                if (ctrl.team) {
                    if(ctrl.renderedCalendar)
                        $("#calendar").fullCalendar( 'destroy' );

                    ctrl.renderedCalendar = true;
                    $("#calendar").fullCalendar({
                        // timeFormat: 'H(:mm)',
                        locale: 'fr',
                        timezone: 'local',
                        aspectRatio: '2.1',
                        events(start, end, timezone, callback) {
                            callback(ctrl.team.Events);
                        },
                        /*      eventRender(event, element) {
                         element.addClass(event.type);
                         element.find('.fc-content').html(
                         `<span class="fc-title ${ event.type }">${ event.type }</span>`
                         );
                         },*/
                        eventClick: function (calEvent, jsEvent, view) {
                            $mdDialog.show({
                                controller: EventDialogController(calEvent, ctrl.team),
                                templateUrl: eventModal,
                                parent: angular.element("dashboard"),
                                clickOutsideToClose: true,
                                fullScreen: true
                            });

                        }
                    });
                }
            });
        });
    }

}

const name = 'dashboard'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    PlayerRow,
    Navig,
    EventCreateCtrl
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope', "$timeout", "$stateParams", '$mdMedia', '$mdDialog', DashboardCtrl]
    })
    .config(function ($stateProvider) {
            'ngInject';
            $stateProvider.state('dashboard', {
                url: '/:teamId/dashboard',
                template: '<dashboard flex layout="column"></dashboard>'
            });
        }
    );
