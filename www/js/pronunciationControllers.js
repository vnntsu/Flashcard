var app = angular.module('ionicApp.pronunciationControllers',['ionicApp.services']);

app.controller('pronunCtrl', function($scope, $state){
	$scope.getCard = function(type){
		$state.go('tabs.pronuncard',{type: type});
	};

});

app.controller('PronunCardCtrl', function($scope, $cordovaSQLite, $stateParams, $state, $ionicLoading,$cordovaMedia){
	if($stateParams.type){
		console.log($stateParams.type);
	}

	$scope.playSound = function(){
		var src="/android_asset/www/resources/pronunction/vowels/abandon.mp3";
		console.log(src);
        var media = new Media(src, null, null, mediaStatusCallback);
        media.play();
    };

    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    };
});