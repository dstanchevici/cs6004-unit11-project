
// Servlet's URL
const url = "http://localhost:40104/loginregisterServlet";

// Object includes data from the loginregister page

const dataToServer = {
    login: null,
    password: null,
    registerLogin: null,
    registerPassword: null,
    servletAction: null
};

let jsonDataFromServer = {
    uid: null,
    role: null,
    applied: false
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
            console.log ("Register Input Is Valid");
            extractRegisterData ($scope);
            //console.log ("dataToServer.registerLogin: " + dataToServer.registerLogin);
            //console.log ("dataToServer.registerPassword: " + dataToServer.registerPassword);
            dataToServer.servletAction = "register";
            sendDataToServer($scope);
        }
    };
}); // End controller

//-----------------------------
// Check and Extract Login
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
// Check and Extract Register
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

function extractRegisterData ($scope) {
    dataToServer.registerLogin = $scope.user.registerLogin;
    dataToServer.registerPassword = $scope.user.registerPassword;
}

//-----------------------------
// Send and receive from Servlet
//-----------------------------
function sendDataToServer($scope){
        console.log ("Entered sendDataToServer");
        console.log ("dataToServer.servletAction: " + dataToServer.servletAction);
        console.log ("To be sent to server: json=" + JSON.stringify(dataToServer));
        let req = new XMLHttpRequest();

        if (dataToServer.servletAction === "login") {
            req.addEventListener("load", requestLoginListener);
        }
        else if (dataToServer.servletAction === "register") {
            req.addEventListener("load", requestRegisterListener);
        }

        req.open("POST", url);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

       /* req.onload = () => {
            // response comes as a string in json format
            // so it needs to be converted to a javascript object
           const dataAsJsonObj = JSON.parse(req.response);
           jsonDataFromServer.uid = data.uid;
           console.log("jsonDataFromServer.uid: " + jsonDataFromServer.uid);

           updateView($scope);

        };*/


        req.send(JSON.stringify(dataToServer));
        console.log ("Sent to server: json=" + JSON.stringify(dataToServer));
}

/*function updateView($scope) {
    $scope.loginErrorMessage = "UID = " + jsonDataFromServer.uid;
}*/

function requestLoginListener () {
    console.log ("this.responseText: " + this.responseText);

    const jsonObject = JSON.parse (this.responseText); // What I get from servlet
    jsonDataFromServer.uid = jsonObject.uid;
    jsonDataFromServer.role = jsonObject.role;

    if (jsonDataFromServer.uid == null) {
        // Error message: The entered login/psw do not check again the User db.
        document.getElementById("nomatch").innerHTML = "The login and password do not match. Try again or register.";
    }
    else {
        const userID = jsonDataFromServer.uid.toString();
        const role = jsonDataFromServer.role.toString();
        // Saves uid in browser memory so it is available on next page


        // Clear the error message about the login/psw not checking against the User db.
        document.getElementById("nomatch").innerHTML = "";

        if (role === "manager") {
            sessionStorage.setItem("UID", userID);
            // Go to manager page
            window.location.href = "http://localhost:40104/manageapplications.html";
            console.log ("Role = " + jsonDataFromServer.role + ". Moving to Manager page");
        }
        else {
            // If the role is Applicant, two scenarios:
            // 1. If the applicant has already applied, got to Status page
            // 2. Else, got to Application page
            console.log ("role = " + jsonDataFromServer.role);
            console.log ("applied = " + jsonDataFromServer.applied);

        }
    }
}

function requestRegisterListener() {
    console.log ("Entered requestRegisterListener()");
    let jsonObject = JSON.parse (this.responseText); // What I get from servlet
    jsonDataFromServer.uid = jsonObject.uid;


    if (jsonDataFromServer.uid == null) {
            document.getElementById("failedregister").innerHTML = "The registration failed. Try again.";
        }
    else {
        const userID = jsonDataFromServer.uid.toString();
        // Saves uid in browser memory so it is available on next page
        sessionStorage.setItem("UID", userID);
        console.log ("jsonDataFromServer.uid.toString(): " + jsonDataFromServer.uid.toString());


    }
}







