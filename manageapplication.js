// Servlet's URL
const url = "http://localhost:40104/manageServlet";

/*let applicantInfoFromServer = {
    uid:33,
    firstName:"Roman",
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
}*/


const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('customTheme')
	.primaryPalette('deep-purple')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    getAndDisplayApplicantInfo($scope);
    $scope.statusIndex = -1;
    $scope.submitDecision = function (uid) {
        console.log ("Submit statusIndex " + $scope.statusIndex + " for " + uid);
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
        let applicantInfoFromServer = dataAsJsonObj;
        console.log ("in req.onload applicantInfoFromServer: " + applicantInfoFromServer.firstName);
        $scope.applicantInfo = applicantInfoFromServer;
    }

}

