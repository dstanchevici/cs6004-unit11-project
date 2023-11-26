const url = "http://localhost:40104/manageServlet";

const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    $scope.uid = sessionStorage.getItem("uid");
});