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
};

// Get all vacancies with a method that has already been created in ManageServlet,
let vacanciesFromServer = [];

/*let decisionDataToServer = {
    uid: null,
    newStatus: null,
    newLocation: null,
    newJob: null,
    servletAction: null
}*/

const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('customTheme')
	.primaryPalette('deep-purple')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {
    $scope.statusIndex = -1;
    $scope.locationIndex = -1;
    $scope.jobIndex = -1;
    $scope.decisionErrorMessage = "";

    $scope.applicantInfo = {};
    getAndDisplayApplicantInfo($scope);

    $scope.locations = []; // Array of objects (location, index)
    getAndDisplayLocations($scope);

    $scope.submitDecision = function () {
        if (checkInput($scope)) {
            sendDataToServerAndReturnToReview($scope);
        }
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
        //console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        applicantInfoFromServer = dataAsJsonObj;
        $scope.applicantInfo = applicantInfoFromServer;

        if (applicantInfoFromServer.status === "under_review") {
            $scope.statusIndex = 1;
        }
        else if (applicantInfoFromServer.status === "approved") {
            $scope.statusIndex = 2;
        }
        else if (applicantInfoFromServer.status === "rejected") {
            $scope.statusIndex = 3;
        }


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
        //console.log ("req.response: " + req.response);
        const dataAsJsonObj = JSON.parse(req.response);
        vacanciesFromServer = dataAsJsonObj;
        //$scope.locations = []; // Array of objects (location, deskvacancies, icevacancies, index)
        for (let i=0; i<vacanciesFromServer.length; i++) {
            let locationObject = {
                location:vacanciesFromServer[i].location,
                deskvacancies:vacanciesFromServer[i].deskvacancies,
                icevacancies:vacanciesFromServer[i].icevacancies,
                index:i+1
            };
            $scope.locations.push(locationObject);
        }
    }

}

function checkInput($scope) {
    // If status choice is Approve
    if ($scope.statusIndex === 2 && $scope.locationIndex > 0 && $scope.jobIndex > 0) {
        $scope.decisionErrorMessage = "";
        return true;
    }
    else if ( $scope.statusIndex === 2 && ( $scope.locationIndex < 1 || $scope.jobIndex < 1 ) ) {
        $scope.decisionErrorMessage = "If you choose Approve, you must assign location and job type.";
        return false;
    }
    // If status choice is Under Review or Reject
    else if ( ( $scope.statusIndex === 1 || $scope.statusIndex === 3 ) && ( $scope.locationIndex > 0 || $scope.jobIndex >0 ) ) {
        $scope.decisionErrorMessage = "If you choose Under Review or Reject, do not assign location or job type.";
        $scope.locationIndex = -1;
        $scope.jobIndex = -1;
        return false;
    }
    else {
        return true;
    }
}

function sendDataToServerAndReturnToReview ($scope) {
    /*console.log ("in printInfo $scope.locations[0].location = " + $scope.locations[0].index);
    console.log ("In printInfo(): applicantInfoFromServer " + applicantInfoFromServer.firstName);
    console.log ("In printInfo(): $scope.applicantInfo.status " + $scope.applicantInfo.status);
    console.log("UID " + $scope.applicantInfo.uid + " has statusIndex " + $scope.statusIndex);
    console.log("UID " + $scope.applicantInfo.uid + " has locationIndex " + $scope.locationIndex);
    console.log("UID " + $scope.applicantInfo.uid + " has jobIndex " + $scope.jobIndex);*/

    let assignedStatus = "";
    if ($scope.statusIndex === 1) {
        assignedStatus = "under_review";
    }
    if ($scope.statusIndex === 2) {
        assignedStatus = "approved";
    }
    if ($scope.statusIndex === 3) {
        assignedStatus = "rejected";
    }

    let assignedLocation = null;
    for (let i=0; i<$scope.locations.length; i++) {
        if ($scope.locationIndex === $scope.locations[i].index) {
            assignedLocation = $scope.locations[i].location;
        }
    }

    let assignedJob = null;
    if ($scope.jobIndex === 1) {
        assignedJob = "desk";
    }
    if ($scope.jobIndex === 2) {
        assignedJob = "ice";
    }

    let decisionDataToServer = {
        uid: $scope.applicantInfo.uid,

        currentStatus: $scope.applicantInfo.status,
        newStatus: assignedStatus,

        currentAssignedLocation: $scope.applicantInfo.locationAssignment,
        newLocation: assignedLocation,

        currentAssignedJob: $scope.applicantInfo.jobAssignment,
        newJob: assignedJob,

        servletAction: "updateVacanciesAndApplication"
    };

    console.log(decisionDataToServer);

    console.log ("Entered decisionDataToServer");
    console.log ("decisionDataToServer.servletAction: " + decisionDataToServer.servletAction);
    console.log ("To be sent to server: json=" + JSON.stringify(decisionDataToServer));
    let req = new XMLHttpRequest();
    req.open("POST", url);
    req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    req.send(JSON.stringify(decisionDataToServer));
    console.log ("Sent to server: json=" + JSON.stringify(decisionDataToServer));

    req.onload = () => {
        console.log ("Returned after sending updated application to server");
        window.location.href = "http://localhost:40104/reviewapplications.html";
    }

}




