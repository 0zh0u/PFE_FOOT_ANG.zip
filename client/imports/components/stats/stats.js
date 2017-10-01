import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {name as Navig} from "../navig/navig";
import {Teams} from "../../../../api/Teams";

import template from "./stats.html";

class StatsCtrl {
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

        this.playersData = [
            [], // Buts
            [], // CR
            [], // CJ
            [], // MJ
            []  // EP
        ];

        ctrl.findPlayer = id => ctrl.team.Players.filter(e => e._id == id)[0];

        ctrl.filterPlayers = [];
        ctrl.filteredLabels = [];
        ctrl.filteredData = [];
        ctrl.playersToFetch = [];

        $scope.$watch('stats.team', function() {
            if(ctrl.team) {
                ctrl.playersLabels = ctrl.team.Players.map(e => e.firstname);

                ctrl.playersToFetch = ctrl.team.Players.map(e => e.firstname +' '+ e.lastname);

                // Data vide
                for(var i = 0; i < ctrl.playersToFetch.length; ++i)
                    for(var j = 0; j < 5; ++j)
                        ctrl.playersData[j].push(0);

                for(var ev = 0; ev < ctrl.team.Events.length; ++ev) {
                    var currEvent = ctrl.team.Events[ev];

                    if(currEvent.matchEvents)
                        for(var mEv = 0; mEv < currEvent.matchEvents.length; ++mEv) {
                            var currMev = currEvent.matchEvents[mEv];

                            var playerIndex = ctrl.playersToFetch.indexOf(currMev.attachedPlayer);
                            var dataIndex = -1;

                            if(currMev.id == 'ownGoal')
                                dataIndex = 0;
                            else if(currMev.id == 'ownBan')
                                dataIndex = 1;
                            else if(currMev.id == 'ownFoul')
                                dataIndex = 2;

                            if(dataIndex != -1)
                                ctrl.playersData[dataIndex][playerIndex] += 1;
                        }

                    // MJ + EP
                    if(currEvent.invitedPlayers)
                        for(var inv = 0; inv < currEvent.invitedPlayers.length; ++inv) {
                            var playerName = ctrl.findPlayer(currEvent.invitedPlayers[inv].player);
                            playerName = playerName.firstname +' '+ playerName.lastname;

                            var playerIndex = ctrl.playersToFetch.indexOf(playerName);

                            var dataIndex = currEvent.type.id == 'match' ? 3 : 4;

                            ctrl.playersData[dataIndex][playerIndex] += 1;
                        }
                }
            }
        });

        $scope.$watchCollection('stats.filterPlayers', function() {
            ctrl.filteredLabels = ctrl.filterPlayers.map(id => {
                var player = ctrl.findPlayer(id);

                return player.firstname + ' ' + player.lastname;
            });

            ctrl.filteredData = [
                [],
                [],
                [],
                [],
                []
            ];

            for (var i = 0; i < ctrl.filteredLabels.length; ++i) {
                var index = ctrl.playersToFetch.indexOf(ctrl.filteredLabels[i]);

                for(var j = 0; j < 5; ++j)
                    ctrl.filteredData[j].push(ctrl.playersData[j].slice(index, index + 1)[0]);
            }
        });

        ctrl.match = {
            "data": [
                [28, 48, 40, 30, 25, 27, 30],
                [30, 55, 50, 18, 35, 30, 25]
            ],
            "options" : {
                responsive: true,
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Match 1'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                }
            },
            "datasetOverride": [
                {
                    fill: true,
                    backgroundColor: [
                        "#47f324",
                        "#f9224a",
                        "#50f3d9",
                        "#f9224a",
                        "#3d8bf3",
                        "#f9224a",
                        "#b063f3",
                        "#f9224a",
                        "#f3a22b",
                    ]
                }],
            "labels" : ["January", "February", "March", "April", "May", "June", "July"],
            "series" : ['Series A', 'Series B']
        };

        ctrl.colorsDough = ['#FFFFFF', '#DDD', '#DDD', '#DDD', '#DDD', '#DDD', '#DDD', '#DDD'];


        ctrl.training1 =    {"datasetOverride" : [
            {
                fill: true,
                backgroundColor: [
                    "#C6D8FF",
                    "#f9224a",
                    "#71A9F7",
                    "#f9224a",
                    "#6B5CA5",
                    "#f9224a",
                    "#72195A",
                    "#f9224a",
                    "#4C1036",
                ]
            }],
            "labels" : ["Exercice 1","Pause", "Exercice 2","Pause", "Exercice 3","Pause", "Exercice 4","Pause", "Exercice 5"],
            "series" : ['Entrainement 1'],
            "data" : [
                [15, 5, 15, 3, 15, 15, 10, 20,20]
            ],
            "options" : {
                responsive: true,
                legend: {
                    display:true,
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'Entrainement 1'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                pieceLabel: {
                    render: 'value',
                    fontSize: 14,
                    fontStyle: 'bold',
                    fontColor: '#fefffd',
                    fontFamily: '"Lucida Console", Monaco, monospace',
                }

            }
        }
        ;
        ctrl.training2 =    {"datasetOverride" : [
            {
                fill: true,
                backgroundColor: [
                    "#C6D8FF",
                    "#f9224a",
                    "#71A9F7",
                    "#f9224a",
                    "#6B5CA5",
                    "#f9224a",
                    "#72195A",
                    "#f9224a",
                    "#4C1036",
                ]
            }],
            "labels" : ["Exercice 1","Pause", "Exercice 2","Pause", "Exercice 3","Pause", "Exercice 4","Pause", "Exercice 5"],
            "series" : ['Entrainement 2'],
            "data" : [
                [14, 8, 20, 4, 15, 10, 10, 14,20]
            ],
            "options" : {
                responsive: true,
                legend: {
                    position: 'top',
                    labels:[
                        "toto","titi"
                    ]
                },

                title: {
                    display: true,
                    text: 'Entrainement 2'
                },
                animation: {
                    animateScale: true,
                    animateRotate: true
                },
                pieceLabel: {
                    render: 'value',
                    fontSize: 14,
                    fontStyle: 'bold',
                    fontColor: '#fefffd',
                    fontFamily: '"Lucida Console", Monaco, monospace',
                }
            }
        };

        this.playersSeries = [
            'Buts',
            'Cartons rouges',
            'Cartons jaunes',
            'Matchs joués',
            'Participation aux entraînements'
        ];

        this.teamData = [
            '54',
            '36',
            '10'
        ];

        this.teamLabels = [
            'Victoires',
            'Défaites',
            'Match nuls'
        ];
    }

}

const name = 'stats'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    Navig
])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller: ['$scope', "$timeout", "$stateParams", '$mdMedia', '$mdDialog', StatsCtrl]
    })
    .config(function ($stateProvider) {
            'ngInject';
            $stateProvider.state('stats', {
                url: '/:teamId/stats',
                template: '<stats flex layout="column"></stats>'
            });
        }
    );
