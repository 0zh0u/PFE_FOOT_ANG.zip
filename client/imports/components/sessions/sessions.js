import angular from "angular";
import angularMeteor from "angular-meteor";
import uiRouter from "angular-ui-router";
import {name as Navig} from "../navig/navig";
import {name as SessionCreateCtrl} from "../sessionCreate/sessionCreate";
import {name as SessionsUpdateCtrl} from "../sessionUpdate/sessionUpdate";
import {name as SessionsPlayCtrl} from "../sessionPlay/sessionPlay";
import {Teams} from "../../../../api/Teams";

import template from "./sessions.html";

class SessionsCtrl {
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
            order: 'date',
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

        $scope.showDialogPlay = function(ev, id) {
            $mdDialog.show({
                contentElement: '#'+ id +'-Play',
                parent: angular.element(document.body),
                clickOutsideToClose: false
            });
        };

        $scope.bulkDeleteSessions = function() {
            var content = "Ces séances seront supprimées de l'équipe : ";
            var sessions = "";
            for(var i = 0; i < $scope.selected.length; ++i)
                sessions += ", " + $scope.selected[i].date +" "+ $scope.selected[i].city +" " + $scope.selected[i].location;

            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr de vouloir supprimer ces séances ?')
                .textContent(content + sessions.substring(2))
                .ariaLabel('Confirmer la suppression')
                .ok('Je suis sûr, supprimer ces séances')
                .cancel('Annuler');

            var sessionsId = [];

            $scope.selected.map(e => sessionsId.push(e._id));

            $mdDialog.show(confirm).then(() => {
                Meteor.call('teams.deleteSessions', $scope.teamId, sessionsId);
                $scope.selected = [];
            });
        };
    }
}

const name = 'sessions'

export default angular.module(name, [
    angularMeteor,
    uiRouter,
    Navig,
    SessionCreateCtrl,
    SessionsUpdateCtrl,
    SessionsPlayCtrl,
])
    .component(name, {
        templateUrl: template,
        controllerAs : name,
        controller : ["$scope","$stateParams",'$mdDialog', '$timeout',SessionsCtrl],
        bindings: {
            session: "="
        }
    })
    .config(function ($stateProvider) {
            'ngInject';
            $stateProvider.state('sessions', {
                url: '/:teamId/sessions',
                template: '<sessions flex layout="column"></sessions>'
            });
        }
    );