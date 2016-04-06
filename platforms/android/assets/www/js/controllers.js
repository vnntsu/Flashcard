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

app.controller('ProfileTabCtrl', function($scope, DatabaseService, ionicMaterialMotion){
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

app.controller('TopicCtrl', function($scope, $state, DatabaseService, $timeout){
    var query = "select * from topic";
    $scope.topics = null;
    DatabaseService.get(query).then(function(result){
        $scope.topics = result;
    });
    $scope.showSubTopic = function(id){
        $state.go('tabs.subtopic',{idtopic: id});
    }
});

app.controller('SubTopicCtrl', function($scope, DatabaseService, $stateParams, $state){
    if ($stateParams.idtopic) {
        $scope.idTopicParam = $stateParams.idtopic;
        console.log("Get idtopic successful: " + $scope.idTopicParam);
    }else{
        console.log("Can not get data!")
    };
    var query = "select * from subtopic where idtopic="+$scope.idTopicParam;
    DatabaseService.get(query).then(function(result){
        $scope.subtopics = result;
    });
   
    $scope.showCard = function(id){
        console.log("IDSUBTOPIC before transfer: " + id);
        $state.go('tabs.vocabfrontcard',{idsubtopic: id});
    }
});
app.controller('VocabCardCtrl',function($scope, DatabaseService, $ionicLoading,$cordovaMedia, $state, $stateParams){
    $scope.playCard = function(vocab){
        console.log(vocab.text + " current vocab: " + $scope.currentVocab);
        $scope.text = vocab.text;
        $scope.pronounce = vocab.pronounce;
        $scope.sound = vocab.sound;
        $scope.image = vocab.image;
        $scope.example = vocab.example;
        $scope.meaning = vocab.meaning;
        $scope.vnmean = vocab.vnmean;
        $scope.topicName = vocab.name;
        $scope.topicVNname = vocab.vnname;
        $scope.isRemember = vocab.isremember;
        $scope.rememberDay = vocab.rememberday;
        $scope.isCustom = vocab.isCustom;
    };

    if($stateParams.idsubtopic){
        $scope.idSubtopicParam = $stateParams.idsubtopic;
        console.log("Get idsubtopic: " + $scope.idSubtopicParam);
        $scope.currentVocab = 0;
    };
    var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic="+ $scope.idSubtopicParam +") as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
    DatabaseService.get(query).then(function(result){
        $scope.vocabularies = result;
        $scope.playCard($scope.vocabularies[$scope.currentVocab]);
        $scope.show = 1;
        $scope.hide = 1;
    });


    $scope.nextCard = function(){
        $scope.show = 1;
        $scope.hide = 1;
        $scope.currentVocab++;
        if($scope.currentVocab<=$scope.vocabularies.length - 1){
            $scope.playCard($scope.vocabularies[$scope.currentVocab]);
        }else{
            $scope.currentVocab = 0;
            $scope.playCard($scope.vocabularies[$scope.currentVocab]);
        }
    };

    $scope.previousCard = function(){
        $scope.show = 1;
        $scope.hide = 1;
        $scope.currentVocab--;
    if($scope.currentVocab<0){
        $scope.currentVocab = $scope.vocabularies.length - 1;
        $scope.playCard($scope.vocabularies[$scope.currentVocab]);
    }else{
        $scope.playCard($scope.vocabularies[$scope.currentVocab]);
    }
    };


    $scope.turnPage = function(id){
        if(id==1){
            $scope.show = 0;
            $scope.hide = 0;
        }else{
            $scope.hide = 1;
            $scope.show = 1;
        };
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
});
