var app = angular.module('ionicApp.controllers', ['ngCordova','ionicApp.services']);

app.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
});

app.controller('LearnTabCtrl', function($scope, $cordovaProgress, $interval){
    // $scope.progressval = 0;
    // $scope.stopinterval = null;
  
    // $scope.updateProgressbar = function(){
    //     startprogress();
    // }

    // function startprogress(){
    //     $scope.progressval = 0;
    //     if ($scope.stopinterval){
    //         $interval.cancel($scope.stopinterval);
    //     }
    //     $scope.stopinterval = $interval(function() {
    //         $scope.progressval = $scope.progressval + 1;
    //         if( $scope.progressval >= 100 ) {
    //             $interval.cancel($scope.stopinterval);
    //             return;
    //         }
    //     }, 100);
    // }

    // startprogress();
    // $cordovaProgress.showSimple(true);  // requires .hide()

// $cordovaProgress.showSimpleWithLabel(true, "Loading") // .hide()

// $cordovaProgress.showSimpleWithLabelDetail(true, "Loading", "detail")
//     // requires .hide()

// $cordovaProgress.hide()


// $cordovaProgress.showDeterminate(false, 100000)

// $cordovaProgress.showDeterminateWithLabel(true, 50000, "Loading")

// $cordovaProgress.showAnnular(true, 50000)

// $cordovaProgress.showAnnularWithLabel(false, 100000, "Loading")

// $cordovaProgress.showBar(true, 50000)

// $cordovaProgress.showBarWithLabel(false, 100000, "Loading")


// $cordovaProgress.showSuccess(true, "Success!") // requires .hide()

// $cordovaProgress.showText(false, 100000, "Loading")
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

app.controller('PronunCardCtrl', function($scope, $cordovaSQLite){
    
});