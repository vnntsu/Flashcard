var db = null,
vocabularies = [],
currentVocab = 0,
clickedSubTopic = 0;

var app = angular.module('ionicApp', ['ionic', 'ngCordova']);

app.run(function($ionicPlatform, $cordovaSQLite){
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    window.plugins.sqlDB.copy("flashcard.db");
    db = $cordovaSQLite.openDB("flashcard.db");
  });
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');

  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    .state('tabs.learn', {
      url: "/learn",
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/learn.html",
          controller: 'LearnTabCtrl'
        }
      }
    })

    // pronunciation
    .state('tabs.pronunciation', {
      url: '/pronunciation',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/pronunciation/pronunciation.html"
        }
      }
    })
    .state('tabs.pronuncard', {
      url: '/pronuncard',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/pronunciation/pronuncard.html",
          controller: 'PronunCardCtrl'
        }
      }
    })

    //vocabulary
    .state('tabs.vocabulary', {
      url: '/vocabulary',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/vocabulary/vocabulary.html",
        }
      }
    })
    .state('tabs.topic', {
      url: '/topic',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/vocabulary/topic.html",
          controller: 'TopicCtrl'
        }
      }
    })
    .state('tabs.subtopic', {
      url: '/subtopic?idtopic',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/vocabulary/subtopic.html",
          controller: 'SubTopicCtrl'
        }
      }
    })
    .state('tabs.vocabfrontcard', {
      url: '/vocabfrontcard?idsubtopic',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/vocabulary/vocabfrontcard.html",
          controller: 'VocabCardCtrl'
        }
      }
    })
    .state('tabs.vocabbackcard', {
      url: '/vocabbackcard',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/vocabulary/vocabbackcard.html",
          controller: 'VocabCardCtrl'
        }
      }
    })


    .state('tabs.custom', {
      url: "/custom",
      views: {
        'custom-tab': {
          templateUrl: "templates/custom/custom.html"
        }
      }
    })

    .state('tabs.navstack', {
      url: "/navstack",
      views: {
        'about-tab': {
          templateUrl: "templates/nav-stack.html"
        }
      }
    })

    .state('tabs.dict', {
      url: "/dict",
      views: {
        'dict-tab': {
          templateUrl: "templates/dict/dict.html"
        }
      }
    })

    .state('tabs.profile', {
      url: "/profile",
      views: {
        'profile-tab': {
          templateUrl: "templates/profile/profile.html",
          controller: 'ProfileTabCtrl'
        }
      }
    });

   $urlRouterProvider.otherwise("/tab/learn");

});

app.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
});

app.controller('LearnTabCtrl', function($scope) {
}); 

app.controller('ProfileTabCtrl', function($scope, $ionicSideMenuDelegate, $cordovaSQLite){
  $scope.selectName = function() {
    var query = "select firstname, lastname from profile";
    $cordovaSQLite.execute(db, query).then(function(result){
      $scope.firstname = result.rows.item(0).firstname;
      $scope.lastname = result.rows.item(0).lastname;
    });
  };
  $scope.setAvatar = function(){
    var query = "select avatar from profile";
    $cordovaSQLite.execute(db,query).then(function(result){
      $scope.imageURL = result.rows.item(0).avatar;
      console.log("SELECT IMAGE: " + $scope.imageURL);
    });
  };
  $scope.loadLevel = function(){
    var query = "select profile.idlevel, level.exppoint, profile.currentexp, nameoflevel.name from level, profile, nameoflevel where level.idlevel = profile.idlevel and level.idnameoflevel = nameoflevel.idnameoflevel";
    $cordovaSQLite.execute(db,query).then(function(result){
      $scope.level = result.rows.item(0).idlevel;
      $scope.expPoint = result.rows.item(0).exppoint;
      $scope.currentExp = result.rows.item(0).currentexp;
      $scope.nameOfLevel = result.rows.item(0).name;
      console.log($scope.level + " - " + $scope.currentExp + " - " + $scope.nameOfLevel);
    });
  };

  $scope.loadWordPerDay = function(){
    var query = "select wordperday from profile";
    $cordovaSQLite.execute(db,query).then(function(result){
      $scope.wordPerDay = result.rows.item(0).wordperday;
      console.log("WORD PER DAY: " + $scope.wordPerDay);
    });
  };

  $scope.init = function() {
    $scope.setAvatar();
    $scope.selectName();
    $scope.loadLevel();
    $scope.loadWordPerDay();
  };

  $scope.init();
});

app.controller('PronunCardCtrl', function($scope, $cordovaSQLite){
  $scope.loadData = function(){
    var query = "select text, pronunced from vocabulary where idvocab = 1";
    $cordovaSQLite.execute(db,query).then(function(result){
      $scope.text = result.rows.item(0).text;
      $scope.pronunced = result.rows.item(0).pronunced;
    });
  };
  $scope.loadData();
});

app.controller('VocabCardCtrl', function($scope, $cordovaSQLite, $ionicLoading,$cordovaMedia, $state, $stateParams){

  if($stateParams.idsubtopic && !clickedSubTopic){
    clickedSubTopic = 1;
    $scope.idsubtopic = $stateParams.idsubtopic;
    console.log("Get idsubtopic: " + $scope.idsubtopic);
    currentVocab = 0;
  };

  $scope.loadData = function(id){
    var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic = ?) as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
    $cordovaSQLite.execute(db,query,[id]).then(function(result){
      if(result.rows.length>0){
        for (var i = 0; i < result.rows.length; i++) {
          vocabularies.push(result.rows.item(i));
          console.log("Vocabulary: " + result.rows.item(i).text);
        }
      }else{
        console.log("Not get data yet!");
      }
      
      console.log("Number record of vocabulary array: " + vocabularies.length);
    }, function(error){
      console.log("Error query database!");
    });
  };

  $scope.playCard = function(){
    console.log(vocabularies[currentVocab].text + " current vocab: " + currentVocab);
    $scope.text = vocabularies[currentVocab].text;
    $scope.pronounce = vocabularies[currentVocab].pronounce;
    $scope.sound = vocabularies[currentVocab].sound;
    $scope.image = vocabularies[currentVocab].iamge;
    $scope.example = vocabularies[currentVocab].example;
    $scope.meaning = vocabularies[currentVocab].meaning;
    $scope.vnmean = vocabularies[currentVocab].vnmean;
    $scope.topicName = vocabularies[currentVocab].name;
    $scope.topicVNname = vocabularies[currentVocab].vnname;
    $scope.isRemember = vocabularies[currentVocab].isremember;
    $scope.rememberDay = vocabularies[currentVocab].rememberday;
    $scope.isCustom = vocabularies[currentVocab].isCustom;
  };

  $scope.loadData($scope.idsubtopic);
  $scope.playCard(vocabularies[currentVocab]);

  $scope.nextCard = function(){
    currentVocab++;
    if(currentVocab<=vocabularies.length - 1){
      $scope.playCard();
    }else{
      currentVocab = 0;
      $scope.playCard();
    }
  };

  $scope.previousCard = function(){
    currentVocab--;
    if(currentVocab<0){
      $scope.playCard(vocabularies[currentVocab]);
    }else{
      currentVocab = vocabularies.length - 1;
      $scope.playCard();
    }
  };


  $scope.callBack = function(id){
    if(id==1){
      $state.go('tabs.vocabbackcard');
      console.log(id);
    }else{
      $state.go('tabs.vocabfrontcard');
      console.log(id);
    }
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

app.controller('TopicCtrl', function($scope, $cordovaSQLite, $state){
  $scope.loadData = function(){
    $scope.topics = [];
    var query = "select idtopic, name, describe, image from topic";
    $cordovaSQLite.execute(db,query).then(function(result){
      console.log(result.rows.length + " Data: " + result.rows.item(0).name + " end END.");
      if(result.rows.length > 0){
        for(var i=0; i<result.rows.length; i++){
          $scope.topics.push(result.rows.item(i));
        }
        for (var i = 0; i < $scope.topics.length; i++) {
          console.log($scope.topics[i].idtopic + " - - "+ $scope.topics[i].name);
        }
      }else{
        console.log("NO DATA");
      }
    }); 
  }

  $scope.loadData();

  $scope.showSubTopic = function(id){
    $state.go('tabs.subtopic',{idtopic: id});
  }
})

app.controller('SubTopicCtrl', function($scope, $cordovaSQLite, $stateParams, $state){
  clickedSubTopic = 0;
  if ($stateParams.idtopic) {
    $scope.idtopic = $stateParams.idtopic;
    console.log("Get idtopic successful");
  }else{
    console.log("Can not get data!")
  }

  $scope.loadData = function(id){
    console.log(id + "  after call method");
    $scope.subtopics = [];
    var query = "select idsubtopic, name from subtopic where idtopic=" + id;
    $cordovaSQLite.execute(db,query).then(function(result){
      for (var i = 0; i < result.rows.length; i++) {
        $scope.subtopics.push(result.rows.item(i));
      }
    });
  }

  $scope.loadData($scope.idtopic);

  $scope.showCard = function(id){
    console.log("IDSUBTOPIC before transfer: " + id);
    $state.go('tabs.vocabfrontcard',{idsubtopic: id});
  }
});