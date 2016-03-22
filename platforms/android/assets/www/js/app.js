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
    .state('search', {
      url: '/search',
      templateUrl: 'templates/search.html'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'templates/settings.html'
    })
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.home', {
      url: "/home",
      views: {
        'home-tab': {
          templateUrl: "templates/home.html",
          controller: 'HomeTabCtrl'
        }
      }
    })
    .state('tabs.pronunciation', {
      url: '/pronunciation',
      views: {
        'home-tab': {
          templateUrl: "templates/pronunciation.html"
        }
      }
    })
    .state('tabs.pronuncard', {
      url: '/pronuncard',
      views: {
        'home-tab': {
          templateUrl: "templates/pronuncard.html"
        }
      }
    })
    .state('tabs.facts', {
      url: "/facts",
      views: {
        'home-tab': {
          templateUrl: "templates/facts.html"
        }
      }
    })
    .state('tabs.facts2', {
      url: "/facts2",
      views: {
        'home-tab': {
          templateUrl: "templates/facts2.html"
        }
      }
    })
    .state('tabs.custom', {
      url: "/custom",
      views: {
        'custom-tab': {
          templateUrl: "templates/custom.html"
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
          templateUrl: "templates/dict.html"
        }
      }
    })
    .state('tabs.profile', {
      url: "/profile",
      views: {
        'profile-tab': {
          templateUrl: "templates/profile.html"
        }
      }
    });


   $urlRouterProvider.otherwise("/tab/home");

});

app.controller('NavCtrl', function($scope, $ionicSideMenuDelegate) {
  $scope.showMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };
  $scope.showRightMenu = function () {
    $ionicSideMenuDelegate.toggleRight();
  };
});

app.controller('HomeTabCtrl', function($scope) {
}); 

app.controller('profileController', function($scope, $ionicSideMenuDelegate, $cordovaSQLite){
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