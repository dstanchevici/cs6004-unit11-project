
// Servlet's URL
const url = "http://localhost:40104/rinkjobs";

// Object includes data from all forms of the website.
// This object is the same (update by copying/pasting) in all js files.
// Its content and strucure is replicated in Servlet.
// Update class in serlvet after every update in the js objects.
// Question: To avoid passing a large object every time,
// should there be a servlet for every form?
//
const dataToServer = {
    login: null,
    password: null,
    registerLogin: null,
    registerPassword: null,
    servletAction: null
};

let jsonDataFromServer = {
    uid: null
}

const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('orange')
    .warnPalette('red');
});

app.controller("myController", function($scope) {

    // NOTE: everything that's used in Angular expressions needs
    // to be defined as a variable/function in $scope.

    // Object for user info (which the {{}} expressions use as {{user.name}} etc)
    $scope.user = {
	    login: "",
	    password: "",
	    registerLogin: "",
	    registerPassword: "",
	    confirmPassword: ""
    };
    $scope.loginErrorMessage = "";
    $scope.registerErrorMessage = "";

    $scope.login = function() {
	    if (checkLoginInput($scope)) {
	        console.log ("Login Input Is Valid")
	        extractLoginData ($scope);
	        console.log ("login: " + dataToServer.login);
	        console.log ("pwd: " + dataToServer.password);
	        dataToServer.servletAction = "login";
	        sendDataToServer($scope);

	    }
    };

    $scope.register = function() {
        if (checkRegisterInput($scope)) {
            console.log ("Register Input Is Valid")
        }
    };
}); // End controller

//-----------------------------
// Handle Login
//-----------------------------
function checkLoginInput($scope) {
    if ($scope.loginform.$valid) {
        $scope.loginErrorMessage = "";
        console.log ("Login form login and password validated");
    }
    else {
        $scope.loginErrorMessage = "Ensure Login and Password are provided.";
        console.log ("Login form login and password NOT validated");
        return false;
    }

    if ($scope.user.password.length > 2 && $scope.user.password.length < 13) {
        $scope.loginErrorMessage = "";
        console.log ("password is the right length: " + $scope.user.password.length);
    }
    else {
        $scope.loginErrorMessage = "Ensure your password is between 3 and 12 characters and/or numbers.";
        $scope.user.password = "";
        console.log ("password is too short or too long");
        return false;
    }


    return true;
}

function extractLoginData ($scope) {
    dataToServer.login = $scope.user.login;
    dataToServer.password = $scope.user.password;
}

//-----------------------------
// Send and receive from Servlet
//-----------------------------
function sendDataToServer($scope){
        console.log ("Entered sendDataToServer");
        let req = new XMLHttpRequest();
        req.addEventListener("load", requestLoginListener);
        req.open("POST", url);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        req.send(JSON.stringify(dataToServer));
        console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}

function requestLoginListener ($scope) {
    console.log ("this.responseText: " + this.responseText);
    const jsonObject = JSON.parse (this.responseText); // What I get from servlet
    jsonDataFromServer.uid = jsonObject.uid;
    if (jsonDataFromServer.uid == null) {
        $scope.loginErrorMessage = "The login and password do not match. Try again or register.";
    }
    else {
        const userID = jsonDataFromServer.uid.toString();
        // Saves uid in browser memory so it is available on next page
        sessionStorage.setItem("UID", userID);

        console.log ("jsonDataFromServer.uid.toString(): " + jsonDataFromServer.uid.toString());
        console.log ("Ready to move to Application page");
    }
}

//-----------------------------
// Handle Register
//-----------------------------
function checkRegisterInput($scope) {
    if ($scope.registerform.$valid) {
        $scope.registerErrorMessage = "";
        console.log ("Register form validated");
    }
    else {
        $scope.registerErrorMessage = "Ensure all information is provided.";
        console.log ("Login form login and password NOT validated");

        return false;
    }

    if ($scope.user.registerPassword === $scope.user.confirmPassword) {
        $scope.registerErrorMessage = "";
        console.log ("password " + $scope.user.registerPassword + " is the same as the confirmed " + $scope.user.confirmPassword);
    }
    else {
        $scope.registerErrorMessage = "Ensure you enter the same password twice.";
        $scope.user.registerPassword = "";
        $scope.user.confirmPassword = "";
        console.log ("password is NOT confirmed");
        return false;
    }

    if ($scope.user.registerPassword.length > 2 && $scope.user.registerPassword.length < 13) {
        $scope.registerErrorMessage = "";
        console.log ("password is the right length: " + $scope.user.registerPassword.length);
    }
    else {
        $scope.registerErrorMessage = "Ensure your password is between 3 and 12 characters and/or numbers.";
        $scope.user.registerPassword = "";
        $scope.user.confirmPassword = "";
        console.log ("password is too short or too long");
        return false;
    }

    return true;
}



function register ($scope) {
    registerDataToServer.registerLogin = $scope.user.registerLogin;
    registerDataToServer.registerPassword = $scope.user.registerPassword;
    registerDataToServer.confirmPassword = $scope.user.confirmPassword;

    console.log (registerDataToServer.registerLogin);
    console.log (registerDataToServer.registerPassword);
    console.log (registerDataToServer.confirmPassword);
}

