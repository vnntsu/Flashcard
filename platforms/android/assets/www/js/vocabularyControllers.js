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
                        break;
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

app.controller('ReviewCtrl', function($scope, DatabaseService, QuestionSrve, $stateParams, $cordovaProgress, $cordovaMedia, $ionicLoading, RandomSrve, $timeout){
	if($stateParams.idsubtopic){
		$scope.idSubtopicParam = $stateParams.idsubtopic;
		$scope.title = $stateParams.title;
	}

    $scope.checkAnswer = function(isAnswer){
    	if(isAnswer){
    		console.log("The answer: " + isAnswer);
    		$scope.rightAnswerShow = true;
    		$timeout(function() {$scope.createQuestion()}, 1000 * 2);
    	}else{
    		// showCard();
    		console.log("wrong answer");
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

    $scope.createQuestion = function(){
   		$scope.rightAnswerShow = false;
   		var randTypeOfQuestion = RandomSrve.myRandom(4);
   		if(randTypeOfQuestion==0){ // Meaning questions
   			console.log("meaning word question!");
        	$scope.theQuestion = QuestionSrve.meaningWordQuestion($scope.vocabularies, 4);
   		}else if(randTypeOfQuestion==1){ // Word question (meaning is the answer)
   			console.log("word meaning question!");
        	$scope.theQuestion = QuestionSrve.wordMeaningQuestion($scope.vocabularies, 4);
   		}else if(randTypeOfQuestion==2){ // Vnmean question (vnmean is the answer)
   			console.log("vnmean word question!");
        	$scope.theQuestion = QuestionSrve.vnmeanWordQuestion($scope.vocabularies, 4);
   		}else{
   			console.log("word vnmean question!");
  		    $scope.theQuestion = QuestionSrve.wordVNMeanQuestion($scope.vocabularies, 4);
   		}
        do{
        	console.log("waiting for data from service");
        }while(!$scope.theQuestion);
        $scope.playSound($scope.vocabularies[$scope.theQuestion.idQuestion].sound);
    }

    var query="select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic="+ $scope.idSubtopicParam +") as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
	DatabaseService.get(query).then(function(result){
		$scope.vocabularies = result;
		for (var i = 0; i < $scope.vocabularies.length; i++) {
			$scope.vocabularies[i].checkTimes = 0;
		}
		$scope.createQuestion();
	});    
});
