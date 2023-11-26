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
    $scope.firstName = null;
    $scope.lastName = null;
    $scope.email = null;
    $scope.age = null;
    $scope.locationPreference = null;
    $scope.jobPreferenceIndex = null;
    $scope.skatingSkill = null;

    $scope.locations = []; // Array of locations as strings
    getLocationsFromServer($scope);

    $scope.submit = function() {
        checkData ($scope);
    };
});

function getLocationsFromServer($scope) {
    let dataToServer = {};
    dataToServer.servletAction = "getVacancies";

    console.log ("dataToServer.servletAction: " + dataToServer.servletAction);
    console.log ("To be sent to server: json=" + JSON.stringify(dataToServer));

    let req = new XMLHttpRequest();
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(dataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(dataToServer));

    req.onload = () => {
        //console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        const vacanciesFromServer = dataAsJsonObj;
        //$scope.locations = []; // Array of objects (location, deskvacancies, icevacancies, index)
        for (let i=0; i<vacanciesFromServer.length; i++) {
            $scope.locations.push(vacanciesFromServer[i].location);
        }
    }

}

function checkData($scope) {
    console.log ("Input:");
    console.log($scope.firstName);
    console.log($scope.lastName);
    console.log($scope.email);
    console.log($scope.age);
    console.log($scope.locationPreference);
    console.log($scope.jobPreferenceIndex);
    console.log($scope.skatingSkill);
}
