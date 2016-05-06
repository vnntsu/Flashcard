var app = angular.module('ionicApp.pronunciationControllers',['ionicApp.services']);

app.controller('pronunCtrl', function($scope, $state){
	$scope.getCard = function(type){
		$state.go('tabs.pronuncard',{type: type});
	};

});

app.controller('PronunCardCtrl', function($scope, $cordovaSQLite, $stateParams, $state){
	if($stateParams.type){
		console.log($stateParams.type);
	}
});