// Servlet's URL
const url = "http://localhost:40104/manageServlet";

let dataToServer = {
    servletAction: null
}

let jsonDataFromServer = {
    vacancies: [],
    applications: []
}

const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('customTheme')
	.primaryPalette('deep-purple')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    // Get vacancies from the server (from the RINK DB) and
    // assign them to $scope.vacancies[] as an array of objects
    getVacanciesFromServer($scope);
    // Get $scope.applications[] from the server (from the APPLICATION DB) and
    //assign them to $scope.applications[] as an array of objects
    getApplicationsFromServer($scope);
    $scope.applicationUID = -1;
    $scope.manageApplication = function(applicationUID) {
        manageApplication(applicationUID);
    }

    $scope.orderingGoal = "uid";
    $scope.setOrderingByUID = function () {
        $scope.orderingGoal = "uid";
    };
    $scope.setOrderingByLastName = function () {
        $scope.orderingGoal = "lastName";
    };
    $scope.setOrderingByApplicationDate = function () {
        $scope.orderingGoal = "applicationDate";
    };
    $scope.setOrderingByAge = function () {
        $scope.orderingGoal = "age";
    };
    $scope.setOrderingBySkatingSkill = function () {
        $scope.orderingGoal = "skatingSkill";
    };
    $scope.setOrderingByLocationPreference = function () {
        $scope.orderingGoal = "locationPreference";
    };
    $scope.setOrderingByStatus = function () {
        $scope.orderingGoal = "status";
    };
    $scope.setOrderingByReviewDate = function () {
        $scope.orderingGoal = "reviewDate";
    };
    $scope.setOrderingByLocationAssignment = function () {
        $scope.orderingGoal = "locationAssignment";
    };
});


function getVacanciesFromServer($scope) {
    dataToServer.servletAction = "getVacancies";
    console.log ("dataToServer.servletAction: " + dataToServer.servletAction);
    console.log ("To be sent to server: json=" + JSON.stringify(dataToServer));

    let reqVacancies = new XMLHttpRequest();
    reqVacancies.open("POST", url);
    reqVacancies.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    reqVacancies.open("POST", url);
    reqVacancies.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    reqVacancies.onload = () => {
        //console.log ("reqVacancies.response: " + reqVacancies.response);
        const dataAsJsonObj = JSON.parse(reqVacancies.response);
        jsonDataFromServer.vacancies = dataAsJsonObj;
        $scope.vacancies = jsonDataFromServer.vacancies;
        // sort by location (https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/)
        // also compare function (https://www.w3schools.com/js/js_array_sort.asp)
        $scope.vacancies.sort((a,b) => {
            if (a.location < b.location) {
                return -1;
            }
            if (a.location > b.location) {
                return 1;
            }
            return 0;
        });
        $scope.$apply();
    }

    reqVacancies.send(JSON.stringify(dataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}

function getApplicationsFromServer($scope) {
    dataToServer.servletAction = "getApplications";
    console.log ("dataToServer.servletAction: " + dataToServer.servletAction);
    console.log ("To be sent to server: json=" + JSON.stringify(dataToServer));

    let req = new XMLHttpRequest();
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.onload = () => {
        //console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        jsonDataFromServer.applications = dataAsJsonObj;
        $scope.applications = jsonDataFromServer.applications;
        $scope.$apply();
    }

    req.send(JSON.stringify(dataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}

function manageApplication(applicationUID) {
    console.log("Manage application for UID " + applicationUID);
    sessionStorage.setItem("uid", applicationUID);
    window.location.href = "http://localhost:40104/manageapplication.html";

    /*To retrieve sessionStorage on the target page:
        let uid = sessionStorage.getItem("uid");
    To clear sessionStorage:
        sessionStorage.clear();*/

}

