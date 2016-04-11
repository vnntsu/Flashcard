var app = angular.module('ionicApp.controllers', ['ionicApp.services']);

app.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
});

app.controller('LearnTabCtrl', function($scope){
}); 

app.controller('ProfileTabCtrl', function($scope, DatabaseService){
    // var query = "select * from profile";
    // DatabaseService.get(query).then(function(result){
    //     var profile = result;
    // });
    // $scope.$parent.showHeader();
    // $scope.$parent.clearFabs();
    // $scope.isExpanded = false;
    // $scope.$parent.setExpanded(false);
    // $scope.$parent.setHeaderFab(false);

    // // Set Motion
    // $timeout(function() {
    //     ionicMaterialMotion.slideUp({
    //         selector: '.slide-up'
    //     });
    // }, 300);

    // $timeout(function() {
    //     ionicMaterialMotion.fadeSlideInRight({
    //         startVelocity: 3000
    //     });
    // }, 700);

    // // Set Ink
    // ionicMaterialInk.displayEffect();
});

app.controller('PronunCardCtrl', function($scope, $cordovaSQLite){
    
});