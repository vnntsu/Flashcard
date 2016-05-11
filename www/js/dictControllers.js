var app = angular.module('ionicApp.dictControllers',['ionicApp.services', 'jett.ionic.filter.bar']);

app.controller('DictCtrl', function($scope, $timeout, $ionicFilterBar, DatabaseService) {

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
	    
        var query = "select idvocab, text from vocabulary where text="+filterText+;
        DatabaseService.get(query).then(function(result){
        	$scope.wordItems=result;
        	for (var i = 0; i < $scope.wordItems.length; i++) {
        		$scope.texts.push($scope.wordItems[i].text);
        	}
        });

    }

    $scope.showFilterBar = function () {
		filterBarInstance = $ionicFilterBar.show({
        	items: [],
        	update: function (filteredItems, filterText) {
				$scope.items = filteredItems;
				if (filterText) {
		            console.log(filterText);
		            // refreshItems();
		            queryWord(filterText);
				}
        	}
		});
    };

    $scope.refreshItems = function () {
		if (filterBarInstance) {
			filterBarInstance();
			filterBarInstance = null;
		}

		$timeout(function () {
			getItems();
			$scope.$broadcast('scroll.refreshComplete');
		}, 1000);
    };
});
