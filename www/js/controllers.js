var app = angular.module('ionicApp.controllers', ['ngCordova','ionicApp.services']);

app.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
});

app.controller('LearnTabCtrl', function($scope, $cordovaProgress, $timeout, $filter){
    // $scope.date = new Date();
    // var today1 = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    // Date.parse(today1,'yyyy-MM-dd');
    
}); 

app.controller('ProfileTabCtrl', function($scope, DatabaseService){
    var query = "select * from profile, level where profile.idlevel=level.idlevel";
    DatabaseService.get(query).then(function(result){
        $scope.profile = result[0];
        console.log("profile.nameoflevel: " + $scope.profile.nameoflevel);
        query = "select * from achievement where isachieve=1";
        DatabaseService.get(query).then(function(result1){
            $scope.imageAchieve = result1[0].image;
            console.log("profile.image: " + $scope.imageAchieve);
            query = "select count(isremember) as wordsLearned from vocabulary where isremember=1";
            DatabaseService.get(query).then(function(result2){
                $scope.wordsLearned = result2[0].wordsLearned;
            });
        });
    });
    
});

app.controller('DictCtrl', function($scope){
});