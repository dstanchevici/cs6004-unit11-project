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
        if ( inputValid ($scope) ) {
            console.log ("inputValid ($scope) = " + inputValid ($scope));
            sendApplicationToServer($scope);
        }
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

function inputValid($scope) {
    if ($scope.applicationform.$valid) {
        $scope.errorMessage = "Form is valid";
        return true;
    }
    else {
        $scope.errorMessage = "Ensure that all fields have been completed in correct format.";
        return false;
    }
}

function sendApplicationToServer($scope) {
    let jobPreferenceAsString = null;
        if ($scope.jobPreferenceIndex === 1) {
            jobPreferenceAsString = "desk";
        }
        if ($scope.jobPreferenceIndex === 2) {
            jobPreferenceAsString = "ice";
        }

    let applicationToServer = {
        uid: $scope.uid,
        firstName: $scope.firstName,
        lastName: $scope.lastName,
        email: $scope.email,
        age: $scope.age,
        locationPreference: $scope.locationPreference,
        jobPreference: jobPreferenceAsString,
        skatingSkill: $scope.skatingSkill,
        status: "under_review",
        servletAction: "insertApplication"
    };
    console.log ("To be sent to server: json=" + JSON.stringify(applicationToServer));
}