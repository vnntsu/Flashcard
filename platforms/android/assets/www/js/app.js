var app = angular.module('ionicApp', ['ionic', 'ngCordova', 'ionicApp.services', 'ionicApp.controllers','ionicApp.customControllers'])

app.run(function($ionicPlatform, $cordovaSQLite, DatabaseService){

    $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
        cordova.plugins.Keyboard.show();

    }
    if (window.StatusBar) {
    // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
    }
    DatabaseService.init();
});
  // $rootScope.preventDefaultScroll = function(event){
  //   event.preventDefaultScroll();
  //   window.scroll(0,0);
  //   return true;
  // };
  // window.document.addEventListener('touchmove', preventDefaultScroll, true);

});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    if(ionic.Platform.isAndroid()){
        $ionicConfigProvider.scrolling.jsScrolling(false);
    };

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

    /// Custom tabs
    .state('tabs.custom', {
        url: "/custom",
        views: {
            'custom-tab': {
                templateUrl: "templates/custom/custom.html"
            }
        }
    })

    .state('tabs.newcard', {
        url: "/newcard",
        views: {
            'custom-tab': {
                templateUrl: "templates/custom/newcard.html",
                controller: 'NewCardCtrl'
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