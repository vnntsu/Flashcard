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

app.controller('ReviewCtrl', function($scope, DatabaseService, $stateParams, $cordovaProgress, $interval){
	if($stateParams.idsubtopic){
		$scope.idSubtopicParam = $stateParams.idsubtopic;
		$scope.title = $stateParams.title;
		$scope.answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
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
		$scope.random = Math.round((Math.random() * (range-1)) * 1);
	};
    // startprogress();

    function randomQuestion(rand){
    	console.log("call back to create new question");
    	var asked = [];
		if($scope.vocabularies[rand].checkTimes<2){
			$scope.isCreateRightAnswer = false;
			console.log("Less than 2");
			$scope.idQuestion = rand;
			console.log("current question: " + $scope.idQuestion);
	    	$scope.question = $scope.vocabularies[rand].text;
	    	$scope.typeword = $scope.vocabularies[rand].name;
			$scope.vocabularies[rand].checkTimes++;
	    	updateRandom(4);
	    	$scope.rightAnswer = $scope.random;
	    	console.log("the right answer is " + $scope.rightAnswer);
	    	updateRandom($scope.vocabularies.length);
			for (var i = 0; i < 4; i++) {
				console.log("create the answer: " + i);
				if(i==$scope.rightAnswer){
					$scope.isCreateRightAnswer = true;
					console.log("create right answer");
					asked.push($scope.random);
					$scope.answers[i].isAnswer=true;
					$scope.answers[i].content = $scope.vocabularies[$scope.idQuestion].meaning;
					asked.push($scope.random);
					updateRandom($scope.vocabularies.length);
				}else{
					$scope.answers[i].isAnswer=false;
					var check = true;
					do{
						check = true;
						console.log("1111 random to find other answer: " + $scope.random);
						/// Check the answer dont be same with right answer
						if($scope.random==$scope.idQuestion){
							updateRandom($scope.vocabularies.length);
							continue;
						}else{
							do{
								console.log("2222 random to find other answer: " + $scope.random);
								/// check the answer dont be same with other answers
								if(asked.length){
									for (var j = 0; j < asked.length; j++) {
										if(asked[j]==$scope.random || $scope.random==$scope.idQuestion){
											console.log("This answer have exist");
											check=true;
											updateRandom($scope.vocabularies.length);
											break;
										}else{
											console.log("This answer not exist");
											check=false;
										}
									}
								}else{
									console.log("No any answer");
									check=false;
								}
								if(!check){
									asked.push($scope.random);
									$scope.answers[i].content = $scope.vocabularies[$scope.random].meaning;
									updateRandom($scope.vocabularies.length);
								}
								updateRandom($scope.vocabularies.length);
							}while(check);
						}
						updateRandom($scope.vocabularies.length);
					}while(check);
				}
				console.log("create answer: " + i + " success");
			}
		}else{
			console.log("have to change the question");
			updateRandom($scope.vocabularies.length);
			randomQuestion($scope.random);
		}
    };

    $scope.checkAnswer = function(isAnswer){

    	if(isAnswer){
    		console.log("The answer: " + isAnswer);
    		$scope.rightAnswerShow = true;
    		updateRandom($scope.vocabularies.length);
    		$interval(randomQuestion($scope.random), 2000);
    		//////// wait 2s then call next question function
    	}else{
    		console.log("wrong answer");
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
