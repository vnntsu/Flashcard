var app = angular.module('ionicApp.customControllers', ['ionicApp.services']);

app.controller('NewCardCtrl', function($scope){
	$scope.hide = 0;	
	console.log($scope.hide);
});