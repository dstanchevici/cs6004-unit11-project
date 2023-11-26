// Servlet's URL
// This servlet has the getApplication() method
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
};

const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    //$scope.applicantInfo = {};
    getAndDisplayApplicantInfo($scope);
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
        //console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        //console.log ("dataAsJsonObj.firstName = " + dataAsJsonObj.firstName);
        applicantInfoFromServer = dataAsJsonObj;
        //console.log ("applicantInfoFromServer.firstName " + applicantInfoFromServer.firstName);
        $scope.applicantInfo = applicantInfoFromServer;
        //console.log ("$scope.applicantInfo.firstName " + $scope.applicantInfo.firstName);
        $scope.$apply();
    }

}
