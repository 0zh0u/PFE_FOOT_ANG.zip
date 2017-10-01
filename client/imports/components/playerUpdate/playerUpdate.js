import angular from "angular";
import angularMeteor from "angular-meteor";

import template from "./playerUpdate.html";

const STAT_DEFAULT_VALUE = 50;

class PlayerUpdateCtrl {
    constructor($scope, $mdDialog, $timeout) {
        $scope.viewModel(this);

        this.closeDialog = function() {
            $mdDialog.hide();
        };

        this.statToAdd = "";

        this.deletePlayer = () => {
            var confirm = $mdDialog.confirm()
                .title('Êtes-vous sûr de vouloir supprimer ce joueur ?')
                .textContent("Ce joueur sera supprimé de l'équipe.")
                .ariaLabel('Confirmer la suppression')
                .ok('Je suis sûr, supprimer ce joueur')
                .cancel('Annuler');

            $mdDialog.show(confirm).then(() => Meteor.call('teams.deletePlayer', this.teamId, this.player._id));
        };

        this.updatePlayer = () => Meteor.call('teams.updatePlayer', this.teamId, angular.copy(this.player));
    }

    addStat() {
        for(var i = 0; i < this.player.Stats.length; ++i)
            if(this.player.Stats[i].name === this.statToAdd)
                return;

        this.player.Stats.push({name: this.statToAdd, value: STAT_DEFAULT_VALUE});

        this.statToAdd = "";
    }

    removeStat(statToRemove) {
        this.player.Stats = _.reject(this.player.Stats, function (el) {
            return el.name === statToRemove.name
        })
    }
}

const name = 'playerUpdate'

export default angular.module(name, [
    angularMeteor

])
    .component(name, {
        templateUrl: template,
        controller: ['$scope', '$mdDialog', '$timeout', PlayerUpdateCtrl],
        controllerAs: name,
        bindings: {
            teamId: "<",
            player: "<"
        }
    });