import angular from "angular";
import angularMeteor from "angular-meteor";
import trem from "./imports/components/trem/trem";
import {Teams} from "../api/Teams";

angular.module('pfe-foot', [
    angularMeteor,
    trem.name
]);


function onReady() {
    angular.bootstrap(document, ['pfe-foot']);
}

if (Meteor.isCordova) {
    angular.element(document).on('deviceready', onReady);
} else {
    angular.element(document).ready(onReady);
}
