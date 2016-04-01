var db = null;

var app = angular.module('ionicApp', ['ionic', 'ngCordova']);

app.run(function($ionicPlatform, $cordovaSQLite, $rootScope){
  //The link about config and run.
  // http://stackoverflow.com/questions/28541179/global-functions-in-angularjs
  $rootScope.getVocabulary = function(){
    var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab)as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword order by idsubtopic asc";
    $cordovaSQLite.execute(db,query).then(function(result){
      if(result.rows.length>0){
        for (var i = 0; i < result.rows.length; i++) {
          $rootScope.vocabularies.push(result.rows.item(i));
          console.log("Vocabulary: " + $rootScope.vocabularies[i].text);
        }
      }else{
        console.log("Cannot get vocabulary!");
      }
    }, function(error){
      console.log("Error query database!");
    });
  };

  $rootScope.getTopic = function(){
    var query = "select idtopic, name, describe, image from topic";
    $cordovaSQLite.execute(db,query).then(function(result){
      console.log(result.rows.length + " Data: " + result.rows.item(0).name + " end END.");
      if(result.rows.length > 0){
        for(var i=0; i<result.rows.length; i++){
          $rootScope.topics.push(result.rows.item(i));
        }
        for (var i = 0; i < $rootScope.topics.length; i++) {
          console.log($rootScope.topics[i].idtopic + " - - "+ $rootScope.topics[i].name);
        }
      }else{
        console.log("NO DATA");
      }
    });
  };

  $rootScope.getSubTopic = function(){
    var query = "select * from topic left join subtopic on topic.idtopic=subtopic.idtopic order by idtopic asc";
    $cordovaSQLite.execute(db,query).then(function(result){
      for (var i = 0; i < result.rows.length; i++) {
        $rootScope.subtopics.push(result.rows.item(i));
      }
    });
  };

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
    console.log("Be ready for load data!");
    $rootScope.vocabularies = [];
    $rootScope.topics = [];
    $rootScope.subtopics = [];
    $rootScope.currentVocab = 0;
    $rootScope.clickedSubTopic = 0;
    $rootScope.getVocabulary();
    $rootScope.getTopic();
    $rootScope.getSubTopic();
    console.log("Be ready for start!");
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

app.controller('VocabCardCtrl',function($scope, $rootScope, $cordovaSQLite, $ionicLoading,$cordovaMedia, $state, $stateParams){
  console.log($rootScope.clickedSubTopic + " value of clickedSubTopic");
  if($stateParams.idsubtopic && !$rootScope.clickedSubTopic){
    $rootScope.clickedSubTopic = 1;
    $scope.idsubtopic = $stateParams.idsubtopic;
    console.log("Get idsubtopic: " + $scope.idsubtopic);
    $rootScope.currentVocab = 0;
  };

  $scope.loadData = function(id){
    var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic = ?) as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
    $cordovaSQLite.execute(db,query,[id]).then(function(result){
      if(result.rows.length>0){
        for (var i = 0; i < result.rows.length; i++) {
          $rootScope.vocabularies.push(result.rows.item(i));
          console.log("Vocabulary: " + $rootScope.vocabularies[i].text);
        }
        $scope.playCard($rootScope.vocabularies[$rootScope.currentVocab]);
      }else{
        console.log("Not get data yet!");
      }
    }, function(error){
      console.log("Error query database!");
    });
  };

  $scope.playCard = function(vocab){
    console.log(vocab.text + " current vocab: " + $rootScope.currentVocab);
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

  // if($scope.idsubtopic == $rootScope.clickedSubTopic){
  //   $scope.loadData($scope.idsubtopic);
  // }

  $scope.nextCard = function(){
    $rootScope.currentVocab++;
    if($rootScope.currentVocab<=$rootScope.vocabularies.length - 1){
      $scope.playCard($rootScope.vocabularies[$rootScope.currentVocab]);
    }else{
      $rootScope.currentVocab = 0;
      $scope.playCard($rootScope.vocabularies[$rootScope.currentVocab]);
    }
  };

  $scope.previousCard = function(){
    $rootScope.currentVocab--;
    if($rootScope.currentVocab<0){
      $rootScope.currentVocab = $rootScope.vocabularies.length - 1;
      $scope.playCard($rootScope.vocabularies[$rootScope.currentVocab]);
    }else{
      $scope.playCard($rootScope.vocabularies[$rootScope.currentVocab]);
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

app.controller('TopicCtrl', function($scope, $cordovaSQLite, $state, $rootScope){
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

  // $scope.loadData();
  $scope.topics = $rootScope.topics;

  $scope.showSubTopic = function(id){
    $state.go('tabs.subtopic',{idtopic: id});
  }
})

app.controller('SubTopicCtrl', function($scope, $rootScope, $cordovaSQLite, $stateParams, $state){
  // $rootScope.clickedSubTopic = 0;
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

  // $scope.loadData($scope.idtopic);
  for (var i = 0; i < $rootScope.topics.length; i++) {
    if($rootScope.topics[i].idtopic == $scope.idtopic){
      $scope.subtopics = $rootScope.topics[i];
    }
  }

  $scope.showCard = function(id){
    console.log("IDSUBTOPIC before transfer: " + id);
    $state.go('tabs.vocabfrontcard',{idsubtopic: id});
  }
});