var db = null;

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
    .state('tabs.vocabfrontcard', {
      url: '/vocabfrontcard',
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
    .state('tabs.subtopic', {
      url: '/subtopic?idtopic',
      views: {
        'learn-tab': {
          templateUrl: "templates/learn/vocabulary/subtopic.html",
          controller: 'SubTopicCtrl'
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

app.controller('VocabCardCtrl', function($scope, $cordovaSQLite, $ionicLoading,$cordovaMedia, $state){
  $scope.loadData = function(id){
    var query = "select text, pronounce, image, sound from vocabulary where idvocab = " + id;
    $cordovaSQLite.execute(db,query).then(function(result){
      $scope.vocabText = result.rows.item(0).text;
      $scope.vocabPronounce = result.rows.item(0).pronounce;
      $scope.vocabImageURL = result.rows.item(0).image;
      $scope.vocabSound = result.rows.item(0).sound;
      console.log($scope.vocabText + " - - - -" + $scope.vocabPronounce + " - - - " + $scope.vocabImageURL + " - - - - " + $scope.vocabSound);
    });
    query = "select example, meaning, vnmean from typeofword where idvocab = " + id;
    $cordovaSQLite.execute(db,query).then(function(result){
      $scope.example = result.rows.item(0).example;
      $scope.meaning = result.rows.item(0).meaning;
      $scope.vnmean = result.rows.item(0).vnmean;
      console.log($scope.example + " - - - -" + $scope.meaning + " - - - " + $scope.vnmean);
    });
  };

  $scope.callBack = function(id){
    if(id==1){
      $state.go('tabs.vocabbackcard');
      console.log(id);
    }else{
      $state.go('tabs.vocabfrontcard');
      console.log(id);
    }
  }

  $scope.playSound = function(src){
    console.log("LINK SOUND: " + src)
    var media = new Media(src, null, null, mediaStatusCallback);
    media.play();
  }

  var mediaStatusCallback = function(status) {
    if(status == 1) {
        $ionicLoading.show({template: 'Loading...'});
    } else {
        $ionicLoading.hide();
    }
  }

  $scope.loadData(2);
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

app.controller('SubTopicCtrl', function($scope, $cordovaSQLite, $stateParams){
  if ($stateParams.idtopic) {
    $scope.idtopic = $stateParams.idtopic;
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
    $state.go('tabs.subtopic',{id: id});
  }
});