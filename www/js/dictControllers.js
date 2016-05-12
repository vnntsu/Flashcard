var app = angular.module('ionicApp.dictControllers',['ionicApp.services', 'jett.ionic.filter.bar']);

app.controller('DictCtrl', function($scope, $timeout, $ionicFilterBar, DatabaseService, $cordovaMedia, $ionicLoading) {

    var filterBarInstance;

 //    function getItems () {
 //      var items = [];
 //      for (var x = 1; x < 2000; x++) {
 //        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
 //      }
 //      $scope.items = items;
 //    }

 //    getItems();
	// $scope.showFilterBar = function () {
 //      filterBarInstance = $ionicFilterBar.show({
 //        items: $scope.items,
 //        update: function (filteredItems, filterText) {
 //        	console.log("filteredItems.length: " + filteredItems.length);
 //          $scope.items = filteredItems;
 //        	console.log("items2.length: " + filteredItems.length);
 //          if (filterText) {
 //            console.log(filterText);
 //          }
 //        }
 //      });
 //    };
    var queryWord = function(filterText){
	    
        var query = "select * from vocabulary a, typeofword b where a.idvocab = b.idvocab and a.text='"+filterText+"' and a.iscustom=0";
        DatabaseService.get(query).then(function(result){
        	if(result){
        		$scope.noData=false;
        		$scope.isFront=true;
        		$scope.isBack=false;
        		var word=result[0];
        		showCard(word);
        	}else{
        		$scope.noData=true;
        		$scope.isFront=false;
        		$scope.isBack=false;
        	}
        });

    };

    $scope.playSound = function(src){
        console.log("LINK SOUND: " + src)
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

    $scope.turnPage = function(id){
        if(id==1){
        	console.log("back->front");
            $scope.isFront = false;
            $scope.isBack = true;
        }else{
        	console.log("front->back");
            $scope.isBack = false;
            $scope.isFront = true;
        };
    };

    var showCard = function(vocab){
        // here here
        $scope.text = vocab.text;
        $scope.pronounce = vocab.pronounce;
        $scope.sound = vocab.sound;
        $scope.image = vocab.image;
        $scope.example = vocab.example;
        $scope.meaning = vocab.meaning;
        $scope.vnmean = vocab.vnmean;
        $scope.topicName = vocab.name;
        $scope.topicVNname = vocab.vnname;
    };

    $scope.showFilterBar = function () {
		filterBarInstance = $ionicFilterBar.show({
        	items: [],
        	update: function (filteredItems, filterText) {
				$scope.items = filteredItems;
				if (filterText) {
		            console.log(filterText);
		            // refreshItems();
		            queryWord(filterText);
		            refreshItems();
				}
        	}
		});
    };

    $scope.refreshItems = function () {
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}

		// $timeout(function () {
		// 	getItems();
		// 	$scope.$broadcast('scroll.refreshComplete');
		// }, 1000);
    };
});
