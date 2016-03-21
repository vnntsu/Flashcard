var db = null;

var app = angular.module('ionicApp', ['ionic']);

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
})
.controller('HomeTabCtrl', function($scope) {
}); 

app.controller('profileController', function($scope, $ionicSideMenuDelegate, $cordovaSQLite){
  $scope.selectName = function() {
    var query = "select firstname, lastname from profile";
    $cordovaSQLite.excute(db, query).then(function(result){
      $scope.firstname = result.rows.item(0).firstname;
      $scope.lastname = result.rows.item(0).lastname;
    });
  };
  $scope.selectName();
  //dang o day
});