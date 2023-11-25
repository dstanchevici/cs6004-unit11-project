// Servlet's URL
const url = "http://localhost:40104/manageServlet";

let applicantInfoFromServer = {
    uid:null,
    firstName:null,
    lastName:null,
    age:null,
    email:null,
    locationPreference:null,
    jobPreference:null,
    skatingSkill:null,
    applicationDate:null,
    status:null,
    locationAssignment:null,
    jobAssignment:null,
    reviewDate:null
}

// Get all vacancies with a method that has already been created in ManageServlet,
// but use only vacanciesFromServer[i].location in this page.
// A bit inefficient, but there is less code b/c I don't need to create a customized method
// (such as getLocations()) in ManageServlet.
let vacanciesFromServer = []


const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('customTheme')
	.primaryPalette('deep-purple')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    $scope.applicantInfo = {};
    getAndDisplayApplicantInfo($scope);

    $scope.locations = []; // Array of objects (location, index)
    getAndDisplayLocations($scope);

    $scope.statusIndex = -1;
    $scope.locationIndex = -1;
    $scope.jobIndex = -1;
    $scope.deleteApplication = false;
    $scope.submitDecision = function () {
        printInfo($scope);
    };
});

function getAndDisplayApplicantInfo($scope) {
    let dataToServer = {};
    dataToServer.servletAction = "getApplicantInfo";
    dataToServer.uid = sessionStorage.getItem("uid");

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
        console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        applicantInfoFromServer = dataAsJsonObj;
        $scope.applicantInfo = applicantInfoFromServer;
    }

}

function getAndDisplayLocations($scope) {
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
        console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        vacanciesFromServer = dataAsJsonObj;
        //$scope.locations = []; // Array of objects (location, index)
        for (let i=0; i<vacanciesFromServer.length; i++) {
            let locationObject = {location:vacanciesFromServer[i].location, index:i+1};
            $scope.locations.push(locationObject);
        }
    }

}

function printInfo ($scope) {
    console.log ("In printInfo(): applicantInfoFromServer " + applicantInfoFromServer.firstName);
    console.log ("In printInfo(): $scope.applicantInfo.status " + $scope.applicantInfo.status);
    console.log("UID " + $scope.applicantInfo.uid + " has statusIndex " + $scope.statusIndex);
    console.log("UID " + $scope.applicantInfo.uid + " has locationIndex " + $scope.locationIndex);
    console.log("UID " + $scope.applicantInfo.uid + " has jobIndex " + $scope.jobIndex);
    console.log("UID " + $scope.applicantInfo.uid + " applic. marked for deletion " + $scope.deleteApplication);

}


