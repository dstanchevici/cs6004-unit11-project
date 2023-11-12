let app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.controller("myController", function($scope) {

    // NOTE: everything that's used in Angular expressions needs
    // to be defined as a variable/function in $scope.

    // Object for user info (which the {{}} expressions use as {{user.name}} etc)
    $scope.user = {
	    name: "NULL",
	    email: "NULL"
    };



    // Dates
    $scope.departureDate = new Date ();
    $scope.returnDate = new Date ();

    // Switches
    $scope.pickup = false;
    $scope.dropoff = false;

    // Radio buttons
    $scope.vacationTypeData = [
        { label: 'Beach', value: 1},
        { label: 'Adventure', value: 2},
        { label: 'Historical', value: 3},
        { label: 'Foodie', value: 4}
    ];
    $scope.vacationType = 1;

    // Checkboxes
    $scope.checklistItems = ["flight","hotel","meals","local tours"];
    $scope.selectedItems = [];
    $scope.isChecked = function (item) {
	    return $scope.selectedItems.indexOf(item) > -1;
    };
    $scope.toggle = function (item) {
        var index = $scope.selectedItems.indexOf(item);
        if (index > -1) {
            $scope.selectedItems.splice(index, 1);   // Remove element at index, howmany=1
        }
        else {
            $scope.selectedItems.push(item);
        }
    };
    $scope.checklist = function() {
        let listStr = "";
        for (let i=0; i<$scope.selectedItems.length; i++) {
            listStr += " " + $scope.selectedItems[i];
        }
        return listStr;
    };

    // Finally, the submit button.
    $scope.submit = function($scope) {
	    sendDataToServer ($scope);
    };
}); // End controller

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
	.primaryPalette('blue')
	.accentPalette('orange')
    .warnPalette('red');
});

function sendDataToServer($scope) {
    // Put everything into a JSON string and send to the server.
}

