
const app = angular.module("myApp", ['ngMaterial', 'ngMessages']);

app.controller("myController", function($scope) {

    getForms($scope);
    $scope.submitDecision = function() {
        checkInput($scope);
    };
});

function checkInput($scope) {
    console.log($scope.forms[0].uid);
    console.log($scope.forms[0].approveOrReject);

    console.log($scope.forms[1].uid);
    console.log($scope.forms[1].approveOrReject);


}

function getForms($scope) {
    $scope.forms = [];
    for (let i=1; i<3; i++) {
        let form = {uid: i, approveOrReject: 0};
        $scope.forms.push(form);
    }
}