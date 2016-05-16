var app = angular.module('ionicApp.controllers', ['ngCordova','ionicApp.services']);

app.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.showMenu = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.showRightMenu = function () {
        $ionicSideMenuDelegate.toggleRight();
    };
});

app.controller('LearnTabCtrl', function($scope, QuestionSrve, $state, $filter, $rootScope){
    // $scope.date = new Date();
    // var today1 = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    // Date.parse(today1,'yyyy-MM-dd');
    $scope.checkTest = function(){
        QuestionSrve.isTest().then(function(result){
            if(result==3){
                $state.go('tabs.test');
            }else if(result==2){
                alert("Now, we don't have any word to do the test!");
            }else{
                alert("You had finished 3 tests today!");
            }
        });
    };
    
}); 

app.controller('ProfileTabCtrl', function($scope, DatabaseService){
    var query = "select * from profile, level where profile.idlevel=level.idlevel";
    DatabaseService.get(query).then(function(result){
        $scope.profile = result[0];
        console.log("profile.nameoflevel: " + $scope.profile.nameoflevel);
        query = "select * from achievement where isachieve=1";
        DatabaseService.get(query).then(function(result){
            $scope.imageAchieve = result[0].image;
            console.log("profile.image: " + $scope.imageAchieve);
            query = "select count(idvocab) as wordsLearned from topicofword where remembered=1";
            DatabaseService.get(query).then(function(result){
                $scope.wordsLearned = result[0].wordsLearned;
                query = "select count(idvocab) as wordsLearned from daily where remembered=1";
                DatabaseService.get(query).then(function(result){
                    $scope.wordsLearned += result[0].wordsLearned;
                });
            });
        });
    });
    $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    $scope.series = ['Series A', 'Series B'];
    $scope.data = [
        [65, 59, 80, 81, 56, 55, 40],
        [28, 48, 40, 19, 86, 27, 90]
    ];
    query = "select idvocab, text, rememberday from topicofword where remembered=1";
    DatabaseService.get(query).then(function(result){
        for (var i = 0; i < result.length; i++) {
            console.log(result[i].rememberday);
        }
    });
});