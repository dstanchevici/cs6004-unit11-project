// Servlet's URL
const url = "http://localhost:40104/manageServlet";

let dataToServer = {
    servletAction: null
}

let jsonVacanciesDataFromServer = {
    vacancies: []
}

const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('customTheme')
	.primaryPalette('deep-purple')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    //$scope.vacancies = [];
    // Get vacancies from server and assign them to $scope.vacancies as an array of objects
    getVacanciesFromServer($scope);

});

function getVacanciesFromServer($scope) {
    dataToServer.servletAction = "getVacancies";
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
        jsonVacanciesDataFromServer.vacancies = dataAsJsonObj;
        console.log("IN req.oload: jsonVacanciesDataFromServer.vacancies[0].location: " + jsonVacanciesDataFromServer.vacancies[0].location);
        $scope.vacancies = jsonVacanciesDataFromServer.vacancies;
        $scope.$apply();

    }

    req.send(JSON.stringify(dataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}
