
const loginDataToServer = {
    login: null,
    password: null
};

const registerDataToServer = {
    chosenLogin: null,
    chosenPassword: null
};

let app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

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
	    chosenLogin: "",
	    chosenPassword: "",
	    confirmedPassword: ""
    };
    $scope.loginErrorMessage = "";
    $scope.registerErrorMessage = "";

    $scope.login = function() {
	    if (checkLoginInput($scope)) {
	        console.log ("Login Input Is Valid")
	    }
    };

    $scope.register = function() {
        if (checkRegisterInput($scope)) {
            console.log ("Register Input Is Valid")
        }
    };
}); // End controller

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
        console.log ("password is the right length: " + $scope.user.chosenPassword.length);
    }
    else {
        $scope.loginErrorMessage = "Ensure your password is between 3 and 12 characters and/or numbers.";
        $scope.user.password = "";
        console.log ("password is too short or too long");
        return false;
    }


    return true;
}

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

    if ($scope.user.chosenPassword === $scope.user.confirmedPassword) {
        $scope.registerErrorMessage = "";
        console.log ("password " + $scope.user.chosenPassword + " is the same as the confirmed " + $scope.user.confirmedPassword);
    }
    else {
        $scope.registerErrorMessage = "Ensure you enter the same password twice.";
        $scope.user.chosenPassword = "";
        $scope.user.confirmedPassword = "";
        console.log ("password is NOT confirmed");
        return false;
    }

    if ($scope.user.chosenPassword.length > 2 && $scope.user.chosenPassword.length < 13) {
        $scope.registerErrorMessage = "";
        console.log ("password is the right length: " + $scope.user.chosenPassword.length);
    }
    else {
        $scope.registerErrorMessage = "Ensure your password is between 3 and 12 characters and/or numbers.";
        $scope.user.chosenPassword = "";
        $scope.user.confirmedPassword = "";
        console.log ("password is too short or too long");
        return false;
    }

    return true;
}

function sendDataToServer($scope) {
    // Put everything into a JSON string and send to the server.
    // test
   /* loginDataToServer.login = $scope.user.login;
    loginDataToServer.password = $scope.user.password;

    console.log (loginDataToServer.login);
    console.log (loginDataToServer.password);*/

}

function register ($scope) {
    registerDataToServer.chosenLogin = $scope.user.chosenLogin;
    registerDataToServer.chosenPassword = $scope.user.chosenPassword;
    registerDataToServer.confirmedPassword = $scope.user.confirmedPassword;

    console.log (registerDataToServer.chosenLogin);
    console.log (registerDataToServer.chosenPassword);
    console.log (registerDataToServer.confirmedPassword);
}

