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
            }
            // else if(result==1){
            //     alert("You had finished 3 tests today!");
            // }
        });
    };
    
}); 

app.controller('ProfileTabCtrl', function($scope, DatabaseService, $cordovaImagePicker, $ionicActionSheet,$timeout){
    // var query = "select * from profile, level where profile.idlevel=level.idlevel";
    // DatabaseService.get(query).then(function(result){
    //     $scope.profile = result[0];
    //     console.log("profile.nameoflevel: " + $scope.profile.nameoflevel);
    //     query = "select * from achievement where isachieve=1";
    //     DatabaseService.get(query).then(function(result){
    //         $scope.imageAchieve = result[0].image;
    //         console.log("profile.image: " + $scope.imageAchieve);
    //         query = "select count(idvocab) as wordsLearned from topicofword where remembered=1";
    //         DatabaseService.get(query).then(function(result){
    //             $scope.wordsLearned = result[0].wordsLearned;
    //             query = "select count(idvocab) as wordsLearned from daily where remembered=1";
    //             DatabaseService.get(query).then(function(result){
    //                 $scope.wordsLearned += result[0].wordsLearned;
    //             });
    //         });
    //     });
    // });
    // $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
    // $scope.series = ['Series A', 'Series B'];
    // $scope.data = [
    //     [65, 59, 80, 81, 56, 55, 40],
    //     [28, 48, 40, 19, 86, 27, 90]
    // ];

    $scope.getImage = function(){
        // var options = {
        //     maximumImagesCount: 10,
        //     width: 800,
        //     height: 800,
        //     quality: 80
        // };

        // $cordovaImagePicker.getPictures(options)
        //     .then(function (results) {
        //         for (var i = 0; i < results.length; i++) {
        //             console.log('Image URI: ' + results[i]);
        //         }
        //     }, function(error) {
        //         // error getting photos
        //     });
        $scope.images = [];

    $scope.selectImages = function () {
        $cordovaImagePicker.getPictures(
            function (results) {
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);

                    $scope.images.push(results[i]);
                }

                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            },
            function (error) {
                console.log('Error: ' + error);
            }
        );
    };
    };
    
    $scope.edit = function(){
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: 'From your gallery' },
                { text: 'Take a photo' }
            ],
            // destructiveText: 'Cancel',
            titleText: 'Pick the image',
            cancelText: 'Cancel',
            cancel: function() {
            // add cancel code..
            },
            buttonClicked: function(index) {
                if(index==0){
                    // navigator.camera.getPicture(UploadPicture, function(message) {
                    //     alert('get picture failed');
                    // }, {
                    //     quality: 50,
                    //     destinationType: navigator.camera.DestinationType.FILE_URI,
                    //     sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
                    //     }
                    // );
                    $scope.getImage();
                }else if(index==1){

                };
            }
        });
    }
});