import angular from "angular";
import angularMeteor from "angular-meteor";
import {name as playerRow} from "../../playerRow/playerRow";
import template from "./playerPost.html";

import {Teams} from "../../../../../api/Teams";

class PlayerPost {
    constructor($scope,$timeout) {
        $scope.viewModel(this);
        var ctrl = this;

        $timeout(function () {
            if(ctrl.post != undefined && ctrl.post.playerId != undefined){
                ctrl.player = ctrl.findPlayer(ctrl.post.playerId);

                if(!ctrl.total.includes(ctrl.post.playerId)) {
                    ctrl.total.push(ctrl.post.playerId);
                }
            }
            else{
                ctrl.player =  undefined;
                ctrl.playerId = undefined;
            }
        },1);
        /*ctrl.getPlayerById = (playerId) => {
            console.log( ctrl.team);
            ctrl.team.Players.forEach(function(player){
                if(player._id == playerId){
                    return player;
                }
            });

        };*/
        ctrl.findPlayer = playerId => ctrl.team.Players.filter(e => e._id == playerId)[0];
        ctrl.availablePlayers = function(){
            return ctrl.team.Players.filter(e => !ctrl.total.includes(e._id));
        };

        ctrl.delete = () => {
            ctrl.total.splice(ctrl.total.indexOf(ctrl.player._id));
            ctrl.post.playerId=undefined;
            ctrl.player = undefined;
            Meteor.call('teams.updateFormation',ctrl.team._id, angular.copy(ctrl.post),ctrl.columnIndex,ctrl.postIndex);
        };

        ctrl.addPlayer = (player) =>{

            ctrl.total.push(player._id);
            ctrl.post.playerId=player._id;

            ctrl.player = ctrl.findPlayer(ctrl.post.playerId);
            Meteor.call('teams.updateFormation',ctrl.team._id, angular.copy(ctrl.post),ctrl.columnIndex,ctrl.postIndex);
        };
    }
}

const name = 'playerPost'

export default angular.module(name, [
    angularMeteor,
    playerRow

])
    .component(name, {
        templateUrl: template,
        controllerAs: name,
        controller : ["$scope","$timeout",PlayerPost],
        bindings : {
            post : "=",
            team : "=",
            columnIndex : "=",
            postIndex : "=",
            total : "="
        }
    }).filter("formatPostShort", function(){
            return function(x) {
                //console.log(x);
                var side;
                var post;

                if(!x)
                    return "NA";

                if(x === undefined){
                    return "";
                }
                if (x.includes("L") || x.includes("LC_")) {
                    side = "G";
                } else if (x.includes("R") || x.includes("RC_")) {
                    side = "D";
                } else if (x.includes("C")) {
                    side = "C";
                }

                if (x.includes("B") || x.includes("DM")) {
                    post = "D";
                } else if (x.includes("M") || x.includes("AM")) {
                    post = "M";
                } else if (x.includes("F")) {
                    post = "A";
                }
                else if (x.includes("GK")) {
                    post = "G";
                }


                return post == "G" ? post : post + "." + side;
            }
        });
