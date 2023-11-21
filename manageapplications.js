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
    // Get vacancies from the server (from the RINK DB) and assign them to $scope.vacancies as an array of objects
    getVacanciesFromServer($scope);

    // Get applications under review from the server (from the APPLICATION DB) and assign them to $scope.applications as an array of objects
    getApplicationsUnderReviewFromServer($scope);

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
        console.log ("reqVacancies.response: " + reqVacancies.response);
        const dataAsJsonObj = JSON.parse(reqVacancies.response);
        jsonDataFromServer.vacancies = dataAsJsonObj;
        $scope.vacancies = jsonDataFromServer.vacancies;
        $scope.$apply();
    }

    reqVacancies.send(JSON.stringify(dataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}

function getApplicationsUnderReviewFromServer($scope) {
    dataToServer.servletAction = "getApplicationsUnderReview";
    console.log ("dataToServer.servletAction: " + dataToServer.servletAction);
    console.log ("To be sent to server: json=" + JSON.stringify(dataToServer));

    let req = new XMLHttpRequest();
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    req.onload = () => {
        console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        jsonDataFromServer.applications = dataAsJsonObj;
        $scope.applications = jsonDataFromServer.applications;
        $scope.$apply();
    }

    req.send(JSON.stringify(dataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}
