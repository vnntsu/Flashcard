var app = angular.module('ionicApp.vocabularyControllers', ['ionicApp.services']);

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
        for (var i = 0; i < $scope.subtopics.length; i++) {
            $scope.subtopics[i].length=0;
            $scope.subtopics[i].learned=0;
        }
        console.log("subtopics.length = " + $scope.subtopics.length);
        query = "select subtopic.idsubtopic as idsubtopic, newtable2.isremember as isremember, count(newtable2.isremember) as learned from (select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab) as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword) as newtable2 join subtopic on newtable2.idsubtopic=subtopic.idsubtopic where subtopic.idtopic="+$scope.idTopicParam+" group by newtable2.isremember";
        DatabaseService.get(query).then(function(result){
            $scope.datas = result;
            for(var i = 0; i < $scope.datas.length; i++){
                for (var j = 0; j < $scope.subtopics.length; j++) {
                    if($scope.datas[i].idsubtopic==$scope.subtopics[j].idsubtopic){
                        $scope.subtopics[j].length += $scope.datas[i].learned;
                        if($scope.datas[i].isremember==1){
                            $scope.subtopics[j].learned = $scope.datas[i].learned;
                        };
                    };
                    console.log("Total: "+$scope.subtopics[i].length + " words");
                    console.log($scope.subtopics[i].learned + " words learned");
                };
            };
        });
    });

   
    $scope.showCard = function(id, title){
        console.log("IDSUBTOPIC before transfer: " + id);
        $state.go('tabs.vocabfrontcard',{idsubtopic: id, title: title});
    }
    $scope.review = function(id,title){
        console.log("IDSUBTOPIC before transfer: " + id);
        $state.go('tabs.review',{idsubtopic: id, title: title});
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
        $scope.title = $stateParams.title;
        console.log($scope.title);
        $scope.currentVocab = 0;
    };
    var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic="+ $scope.idSubtopicParam +") as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
    DatabaseService.get(query).then(function(result){
        $scope.vocabularies = result;
        $scope.playCard($scope.vocabularies[$scope.currentVocab]);
        $scope.isFront = true;
        $scope.isBack = !$scope.isFront;
    });


    $scope.nextCard = function(){
        $scope.isFront = true;
        $scope.isBack = !$scope.isFront;
        $scope.currentVocab++;
        if($scope.currentVocab<=$scope.vocabularies.length - 1){
            $scope.playCard($scope.vocabularies[$scope.currentVocab]);
        }else{
            $scope.currentVocab = 0;
            $scope.playCard($scope.vocabularies[$scope.currentVocab]);
        }
    };

    $scope.previousCard = function(){
        $scope.isFront = true;
        $scope.isBack = !$scope.isFront;
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
            $scope.isFront = false;
        	$scope.isBack = !$scope.isFront;
        }else{
            $scope.isBack = false;
        	$scope.isFront = !$scope.isBack;
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

app.controller('ReviewCtrl', function($scope, DatabaseService, $stateParams, $cordovaProgress, $interval){
	if($stateParams.idsubtopic){
		$scope.idSubtopicParam = $stateParams.idsubtopic;
		$scope.title = $stateParams.title;
		$scope.answers = [{isAnswer: false, content: ""},{isAnswer: false, content: ""},{isAnswer: false, content: ""},{isAnswer: false, content: ""}];
	}
	$scope.progressval = 0;
    $scope.stopinterval = null;
  
    $scope.updateProgressbar = function(){
        startprogress();
    };

    function startprogress(){
        $scope.progressval = 0;
        if ($scope.stopinterval){
            $interval.cancel($scope.stopinterval);
        }
        $scope.stopinterval = $interval(function() {
            $scope.progressval = $scope.progressval + 1;
            if( $scope.progressval >= 100 ) {
                $interval.cancel($scope.stopinterval);
                return;
            }
        }, 100);
    };
	function updateRandom(range) {
		$scope.random = Math.round((Math.random() * (around-1)) * 1);
	}
    // startprogress();

    function randomQuestion(rand){
		if($scope.vocabularies[rand].checkTimes<2){
			$scope.idQuestion = $rand;
	    	$scope.question = $scope.vocabularies[rand].text;
	    	$scope.typeword = $scope.vocabularies[rand].name;
	    	updateRandom(4);
	    	$scope.rightAnswer = random;
			for (var i = 0; i < 4; i++) {
				if(i==$scope.rightAnswer){
					$scope.answer[i].isAnswer: true;
					$scope.answer[i].content = $scope.vocabularies[$scope.idQuestion].meaning;
				}else{
					$scope.answer[i].isAnswer: false;
					do{
						updateRandom($scope.vocabularies.length);
					}while($scope.random==$scope.idQuestion);
					$scope.answer[i].content = $scope.vocabularies[$scope.random].meaning;
				}
			}
		}else{
			updateRandom();
			randomQuestion($scope.random);
		}
    };

    function checkAnswer(isAnswer){
    	if(isAnswer){
    		$scope.rightAnswerShow: true;
    		//////// wait 2s then call next question function
    	}
    };

    var query="select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic="+ $scope.idSubtopicParam +") as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
	DatabaseService.get(query).then(function(result){
		$scope.vocabularies = result;
		for (var i = 0; i < $scope.vocabularies.length; i++) {
			$scope.vocabularies[i].checkTimes = 0;
		}
		updateRandom($scope.vocabularies.length);
		randomQuestion($scope.random);
	});    
});
