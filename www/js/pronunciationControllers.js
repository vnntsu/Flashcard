var app = angular.module('ionicApp.pronunciationControllers',['ionicApp.services']);

app.controller('pronunCtrl', function($scope, $state){
	$scope.getCard = function(type){
		$state.go('tabs.pronuncard',{type: type});
	};

});

app.controller('PronunCardCtrl', function($scope, $ionicSideMenuDelegate, DatabaseService, $stateParams, $state, $ionicLoading, $cordovaMedia){
	
    var get = function(type){
        var query = "select * from pronunciation where type="+type;
        DatabaseService.get(query).then(function(result){
            $scope.pronuns=result;
            $scope.pronun = $scope.pronuns[current];
        });
    };

    if($stateParams.type){
        $scope.pronuns = [];
        var current=0;
        get($stateParams.type);
	}


    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    };

	$scope.playSound = function(src){
        var media = new Media(src, null, null, mediaStatusCallback);
        media.play();
    };
    $scope.playWord = function(src){
        var media = new Media(src, null, null, mediaStatusCallback);
        media.play();
    };

    $scope.nextCard = function(){
        current++;
        console.log("next : " + current);
        if(current>$scope.pronuns.length-1){
            current=0;
            $scope.pronun = $scope.pronuns[current];
        }else{
            $scope.pronun = $scope.pronuns[current];
        }
    };

    $scope.previousCard = function(){
        current--;
        console.log("previous : " + current);
        if(current<0){
            current=$scope.pronuns.length-1;
            $scope.pronun = $scope.pronuns[current];
        }else{
            $scope.pronun = $scope.pronuns[current];
        }
    };

    $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
    };
});