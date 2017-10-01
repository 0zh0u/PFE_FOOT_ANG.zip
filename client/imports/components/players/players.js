import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {name as PlayerUpdateCtrl} from "../playerUpdate/playerUpdate";
import {name as PlayerCreateCtrl} from "../playerCreate/playerCreate";
import {Teams} from "../../../../api/Teams";
import {name as Navig} from "../navig/navig";

import template from "./players.html";

class PlayersCtrl {
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
            order: 'firstName',
            limit: 20,
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

        $scope.bulkDeletePlayers = function() {
            var content = "Ces joueur seront supprimés de l'équipe : ";
            var players = "";
            for(var i = 0; i < $scope.selected.length; ++i)
                players += ", " + $scope.selected[i].firstname +" "+ $scope.selected[i].lastname;

            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr de vouloir supprimer ces joueurs ?')
                .textContent(content + players.substring(2))
                .ariaLabel('Confirmer la suppression')
                .ok('Je suis sûr, supprimer ces joueurs')
                .cancel('Annuler');

            var playersId = [];

            $scope.selected.map(e => playersId.push(e._id));

            $mdDialog.show(confirm).then(() => {
                Meteor.call('teams.deletePlayers', $scope.teamId, playersId);
                $scope.selected = [];
            });
        };

        // $scope.getPlayers = function() {
        //     $scope.players = Meteor.call('teams.players.aggregate', $scope.teamId, $scope.queryParams);
        // };


        // $scope.getPlayers();
    }
}

const name = 'players'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    PlayerUpdateCtrl,
    PlayerCreateCtrl,
    Navig
])
    .component(name, {
        templateUrl: template,
        controller : ["$scope","$stateParams",'$mdDialog', '$timeout',PlayersCtrl],
        controllerAs: name,
        bindings: {
            player: "="
        }
    }).config(function ($stateProvider) {
        'ngInject';

        $stateProvider
            .state('players', {
                url: '/:teamId/players',
                template: '<players flex layout="column"></players>'
            });
    });