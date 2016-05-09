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
    var query = "select idsubtopic, name from subtopic where idtopic="+$scope.idTopicParam;
    DatabaseService.get(query).then(function(result){
        $scope.subtopics = result;
        for (var i = 0; i < $scope.subtopics.length; i++) {
            $scope.subtopics[i].length=0;
            $scope.subtopics[i].learned=0;
        }

        console.log("subtopics.length = " + $scope.subtopics.length);
        query = "select subtopic.idsubtopic as idsubtopic, remembered, count(subtopic.idsubtopic)as number from subtopic join (select vocabulary.idvocab, idsubtopic, viewed,viewday,remembered,rememberday from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab) newtable on newtable.idsubtopic=subtopic.idsubtopic where idtopic="+$scope.idTopicParam+" group by subtopic.idsubtopic, remembered";
        DatabaseService.get(query).then(function(result){
            $scope.datas = result;
            console.log("length of datas: " +$scope.datas.length);
            for(var i = 0; i < $scope.subtopics.length; i++){
                $scope.subtopics[i].length = 0;
                $scope.subtopics[i].learned = 0;
            }
            if($scope.datas==false){
                console.log("false!");
            }else{
                console.log("wwhy");
                for(var i = 0; i < $scope.datas.length; i++){

                    console.log("check "+ i + "   :::" + $scope.datas[i].idsubtopic);
                    for (var j = 0; j < $scope.subtopics.length; j++) {
                        console.log("loop "+ j);
                        if($scope.datas[i].idsubtopic==$scope.subtopics[j].idsubtopic){
                            $scope.subtopics[j].length += $scope.datas[i].number;
                            if($scope.datas[i].remembered==1){
                                console.log("vo day");
                                $scope.subtopics[j].learned = $scope.datas[i].number;
                            };
                            break;
                        }
                    }
                }
                console.log("Total: "+$scope.subtopics[0].length + " words");
                console.log($scope.subtopics[0].learned + " words learned");
            }
            
            query = "select idsubtopic, count(viewed)as number from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic in (select subtopic.idsubtopic from subtopic where idtopic="+$scope.idTopicParam+") and viewed=1 and remembered=0 group by idsubtopic, viewed";
            DatabaseService.get(query).then(function(result){
                var array = result;
                for(var i = 0; i < $scope.subtopics.length; i++){
                        $scope.subtopics[i].numberWordViewed = 0;
                        $scope.subtopics[i].isReview = true;
                }
                if(array==false){
                    
                }else{
                    for (var j = 0; j < array.length; j++) {
                        for(var i = 0; i < $scope.subtopics.length; i++){
                            if($scope.subtopics[i].idsubtopic==array[j].idsubtopic){
                                $scope.subtopics[i].numberWordViewed = array[j].number;
                                $scope.subtopics[i].isReview = false;
                                break;
                            }else{
                                $scope.subtopics[i].numberWordViewed = 0;
                                $scope.subtopics[i].isReview = true;
                            }
                        }
                    }
                }
                
            });
        });
    });

   
    $scope.showCard = function(id, title){
        console.log("IDSUBTOPIC before transfer: " + id);
        $state.go('tabs.vocabfrontcard',{idsubtopic: id, title: title});
    }
    $scope.review = function(id,number){
        console.log("IDSUBTOPIC before transfer: " + id);
        $state.go('tabs.review',{idsubtopic: id, numberWordViewed: number});
    }
});
app.controller('VocabCardCtrl',function($scope, $filter, DatabaseService, $ionicLoading,$cordovaMedia, $state, $stateParams, $ionicGesture){
    $scope.playCard = function(vocab){
        $scope.text = vocab.text;
        $scope.pronounce = vocab.pronounce;
        $scope.sound = vocab.sound;
        $scope.image = vocab.image;
        $scope.example = vocab.example;
        $scope.meaning = vocab.meaning;
        $scope.vnmean = vocab.vnmean;
        $scope.topicName = vocab.name;
        $scope.topicVNname = vocab.vnname;
        $scope.isRemember = vocab.remembered;
        $scope.rememberDay = vocab.rememberday;
        $scope.isCustom = vocab.isCustom;
        if(vocab.viewed==0){
            var toDay = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
            var query = "update topicofword set viewed=1, viewday='"+ toDay +"' where idvocab="+vocab.idvocab+" and idsubtopic=" + $scope.idSubtopicParam;
            DatabaseService.update(query);
        }
        query = "select * from topicofword where viewed=1";
        DatabaseService.get(query).then(function(result){
        });
    };

    if($stateParams.idsubtopic){
        $scope.idSubtopicParam = $stateParams.idsubtopic;
        console.log("Get idsubtopic: " + $scope.idSubtopicParam);
        $scope.title = $stateParams.title;
        console.log($scope.title);
        $scope.currentVocab = 0;
    };
    var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where idsubtopic="+$scope.idSubtopicParam+") newtable1 join typeofword on typeofword.idvocab=newtable1.idvocab) newtable2 join kindofword on kindofword.idkindword=newtable2.idkindword";
    DatabaseService.get(query).then(function(result){
        /// please show alert to inform user know that the words haven't had yet.
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

app.controller('ReviewCtrl', function($scope, DatabaseService, QuestionSrve, LevelServ, $stateParams, $cordovaProgress, $cordovaMedia, $ionicLoading, RandomSrve, $timeout, $state){
	if($stateParams.idsubtopic){
		$scope.idSubtopicParam = $stateParams.idsubtopic;
		$scope.numberWordViewed = $stateParams.numberWordViewed;
        console.log("get number word Viewed: " + $scope.numberWordViewed);
        $scope.normalTest = true;
        $scope.wrongCard = false;
        $scope.current = 0;
        $scope.questions = [];
	}

    $scope.showCard = function(vocab){
        // here here
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

    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    };

    $scope.playSound = function(src){
        console.log("LINK SOUND: " + src)
        var media = new Media(src, null, null, mediaStatusCallback);
        media.play();
    };

    $scope.getWrongCard = function(vocab){
        $scope.showCard(vocab);
        $scope.normalTest = false;
        $scope.wrongCard = true;
        $scope.isFront = true;
        $scope.isBack = !$scope.isFront;

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

    $scope.callBack = function(){
        $state.go('tabs.subtopic',{idtopic: $scope.idSubtopicParam});
    }

    $scope.checkAnswer = function(isAnswer, content){
        $scope.clicked=true;
        $scope.questions[$scope.current-1].checkTimes++;
    	if(isAnswer){
            $scope.questions[$scope.current-1].reviewtimes++;
            if($scope.questions[$scope.current-1].reviewtimes >= 5){
                $scope.questions[$scope.current-1].remembered=1;
                query = "update topicofword set remembered=1, reviewtimes="+$scope.questions[$scope.current-1].reviewtimes+" where idvocab="+$scope.theQuestion.idQuestion;
                DatabaseService.update(query);
            }
            $scope.rightButtonClicked = content;
            LevelServ.increase();
    		console.log("The answer: " + isAnswer);
            $scope.showAnswer = false;
            $scope.showRight = true;
    		$scope.rightAnswerShow = true;
            if($scope.randTypeOfQuestion==0){
                $scope.rightContent = $scope.questions[$scope.current-1].meaning;
            }else if($scope.randTypeOfQuestion==2){
                $scope.rightContent = $scope.questions[$scope.current-1].vnmean;
            }else{
                $scope.rightContent = $scope.questions[$scope.current-1].text;
            }
            
    		$scope.playSound($scope.questions[$scope.current-1].sound);

            if($scope.questions[$scope.questions.length-1].checkTimes>=5){
                alert("Finish test!");
                $scope.callBack();
            }else{
                if($scope.current==($scope.questions.length)){
                    $scope.current=0;
                }
                $timeout(function() {$scope.createQuestion()}, 1000 * 2);
            }

    	}else{
            $scope.wrongButtonClicked = content;
            for (var i = 0; i < $scope.theQuestion.answers.length; i++) {
                if($scope.theQuestion.answers[i].isAnswer){
                    $scope.rightButtonClicked = $scope.theQuestion.answers[i].content;
                    break;
                }
            }
        
            // if($scope.randTypeOfQuestion==0){
            //     $scope.wrongContent = $scope.vocabularies[$scope.theQuestion.idQuestion].meaning;
            // }else if($scope.randTypeOfQuestion==2){
            //     $scope.wrongContent = $scope.vocabularies[$scope.theQuestion.idQuestion].vnmean;
            // }else{
            //     $scope.wrongContent = $scope.vocabularies[$scope.theQuestion.idQuestion].text;
            // }
    		$scope.wrongAnswerShow = true;
            $scope.showAnswer = false;
            $scope.showWrong = true;
    		console.log("wrong answer");
            var tmp = $scope.questions[$scope.current-1];
            $scope.playSound(tmp.sound);

            $timeout(function() {$scope.getWrongCard(tmp)}, 1000 * 2);
            if($scope.questions[$scope.questions.length-1].checkTimes>=5){
                alert("Finish test!");
                $scope.callBack();
            }else{
                if($scope.current==($scope.questions.length)){
                    $scope.current=0;
                }
            }
    	}
    };

    $scope.createQuestion = function(){
        $scope.rightAnswerShow = false;
        $scope.wrongAnswerShow = false;
        $scope.normalTest = true;
        $scope.wrongCard = false;
        $scope.rightButtonClicked = "";
        $scope.wrongButtonClicked = "";
        $scope.clicked = false;
        $scope.randTypeOfQuestion = RandomSrve.myRandom(4);
        // var randTypeOfQuestion = 0;
   		if($scope.randTypeOfQuestion==0){ // Meaning questions
        	$scope.theQuestion = QuestionSrve.meaningWordQuestion($scope.vocabularies,  $scope.questions[$scope.current], 4);
   		}else if($scope.randTypeOfQuestion==1){ // Word question (meaning is the answer)
        	$scope.theQuestion = QuestionSrve.wordMeaningQuestion($scope.vocabularies,  $scope.questions[$scope.current], 4);
   		}else if($scope.randTypeOfQuestion==2){ // Vnmean question (vnmean is the answer)
        	$scope.theQuestion = QuestionSrve.vnmeanWordQuestion($scope.vocabularies,   $scope.questions[$scope.current], 4);
   		}else{// word vnmean question
  		    $scope.theQuestion = QuestionSrve.wordVNMeanQuestion($scope.vocabularies,   $scope.questions[$scope.current], 4);
   		}
        $scope.current++;
    };

    // $scope.loadProgressBar = function(){
    //     define(['require', './bower_components/progressbar.js/dist/progressbar.js'], function (require) {
    //     var ProgressBar = require('./bower_components/progressbar.js/dist/progressbar.js');
    //     });
    //     // var ProgressBar = require('./bower_components/progressbar.js/dist/progressbar.js');
    //     // var line = new ProgressBar.Line('#container');
    //     var bar = new ProgressBar.Circle(container, {
    //         color: '#333',
    //         // This has to be the same size as the maximum width to
    //         // prevent clipping
    //         strokeWidth: 6,
    //         trailWidth: 6,
    //         easing: 'easeInOut',
    //         duration: 12000,
    //         text: {
    //             autoStyleContainer: false
    //         },
    //         from: { color: '#333', width: 6 },
    //         to: { color: '#333', width: 6 },
    //         // Set default step function for all animate calls
    //         step: function(state, circle) {
    //             circle.path.setAttribute('stroke', state.color);
    //             circle.path.setAttribute('stroke-width', state.width);

    //             var value = Math.round(100 - circle.value() * 100);
    //             if (value === 0) {
    //               circle.setText('');
    //             } else {
    //               circle.setText(value);
    //             }
    //         }
    //     });
    //     bar.text.style.fontFamily = '"Raleway", Helvetica, sans-serif';
    //     bar.text.style.fontSize = '2rem';
    //     bar.animate(1); 
    // };

    // $scope.loadButton = function(){
    //     $scope.showButton = true;
    // };
    

    var query="select newtable1.idvocab as idvocab, * from (select newtable.idvocab as idvocab, * from (select vocabulary.idvocab as idvocab, * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic="+$scope.idSubtopicParam+") as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
	DatabaseService.get(query).then(function(result){
		$scope.vocabularies = result;
        if($scope.numberWordViewed<=5){
            for (var i = 0; i < $scope.vocabularies.length; i++) {
                if($scope.vocabularies[i].viewed==1&&$scope.vocabularies[i].remembered==0){
                    $scope.vocabularies[i].checkTimes=0;
                    $scope.questions.push($scope.vocabularies[i]);
                }
            }
        }
		$scope.createQuestion();
        // $scope.showButton=false;
        // $scope.showProgressBar = true;
        // $scope.loadProgressBar();
        // $timeout(function() {$scope.loadButton();}, 1000 * 11);
	});    
});

app.controller('TestCtrl', function($scope, DatabaseService, QuestionSrve, LevelServ, $stateParams, $cordovaProgress, $cordovaMedia, $ionicLoading, RandomSrve, $timeout, $state,ProgressBarServ){
    $scope.questions=[];
    $scope.current=0;
    var tmp = null;
    var bar = null;
    $scope.questionCountDown=null;
    $scope.pressCountDown=null;
    $scope.showCard = function(vocab){
        // here here
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

    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    };

    $scope.playSound = function(src){
        console.log("LINK SOUND: " + src)
        var media = new Media(src, null, null, mediaStatusCallback);
        media.play();
    };

    $scope.getWrongCard = function(vocab){
        $scope.showCard(vocab);
        $scope.normalTest = false;
        $scope.wrongCard = true;
        $scope.isFront = true;
        $scope.isBack = !$scope.isFront;

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

    $scope.callBack = function(){
        $state.go('tabs.subtopic',{idtopic: $scope.idSubtopicParam});
    }

    $scope.checkAnswer = function(isAnswer, content){
        $timeout.cancel($scope.questionCountDown);
        bar.destroy();
        $scope.showButton = true;
        $scope.clicked=true;
        $scope.questions[$scope.current-1].checkTimes++;
        if(isAnswer){
            $scope.isNext=true;
            $scope.questions[$scope.current-1].reviewtimes++;
            if($scope.questions[$scope.current-1].reviewtimes >= 5){
                $scope.questions[$scope.current-1].remembered=1;
                query = "update topicofword set remembered=1, reviewtimes="+$scope.questions[$scope.current-1].reviewtimes+" where idvocab="+$scope.theQuestion.idQuestion;
                DatabaseService.update(query);
            }
            $scope.rightButtonClicked = content;
            LevelServ.increase();
            console.log("The answer: " + isAnswer);
            $scope.showAnswer = false;
            $scope.showRight = true;
            $scope.rightAnswerShow = true;
            if($scope.randTypeOfQuestion==0){
                $scope.rightContent = $scope.questions[$scope.current-1].meaning;
            }else if($scope.randTypeOfQuestion==2){
                $scope.rightContent = $scope.questions[$scope.current-1].vnmean;
            }else{
                $scope.rightContent = $scope.questions[$scope.current-1].text;
            }
            
            $scope.playSound($scope.questions[$scope.current-1].sound);
            $scope.pressCountDown = $timeout(function() {$scope.createQuestion()}, 1000 * 5);

        }else{
            $scope.isNext=false;
            $scope.wrongButtonClicked = content;
            for (var i = 0; i < $scope.theQuestion.answers.length; i++) {
                console.log("isAnswer: " + $scope.theQuestion.answers[i].isAnswer + " ; content: " + $scope.theQuestion.answers[i].content)
                if($scope.theQuestion.answers[i].isAnswer){
                    $scope.rightButtonClicked = $scope.theQuestion.answers[i].content;
                    break;
                }
            }
            $scope.wrongAnswerShow = true;
            $scope.showAnswer = false;
            $scope.showWrong = true;
            console.log("wrong answer");
            tmp = $scope.questions[$scope.current-1];
            $scope.playSound(tmp.sound);

            $scope.pressCountDown = $timeout(function() {$scope.getWrongCard(tmp)}, 1000 * 5);
            
        }
    };

    $scope.timeOut = function(isAnswer, content){
        bar.destroy();
        $scope.isNext=false;
        $scope.showButton = true;
        $scope.clicked = true;
        $scope.wrongButtonClicked = content;
        $scope.rightButtonClicked = "";
        tmp = $scope.questions[$scope.current-1];
        $scope.playSound(tmp.sound);
        for (var i = 0; i < $scope.theQuestion.answers.length; i++) {
            if($scope.theQuestion.answers[i].isAnswer){
                $scope.rightButtonClicked = $scope.theQuestion.answers[i].content;
                break;
            }
        }
        $scope.pressCountDown = $timeout(function() {
                $scope.getWrongCard(tmp);
        }, 1000 * 2);
    };

    $scope.nextQuestion = function(isNext){
        $timeout.cancel($scope.pressCountDown);
        if(isNext){
            $scope.createQuestion();
        }else{
            console.log("tmp.idvocab: "+tmp);
            $scope.getWrongCard(tmp);
        }
    };

    $scope.createQuestion = function(){
        if($scope.questions[$scope.questions.length-1].checkTimes>=5){
            alert("Finish test!");
            $scope.callBack();
        }else{$scope.questions[$scope.current-1]
            if($scope.current==($scope.questions.length)){
                $scope.current=0;
            }
        }
        $scope.rightAnswerShow = false;
        $scope.wrongAnswerShow = false;
        $scope.normalTest = true;
        $scope.wrongCard = false;
        $scope.rightButtonClicked = "";
        $scope.wrongButtonClicked = "";
        $scope.clicked = false;
        $scope.randTypeOfQuestion = RandomSrve.myRandom(4);
        // var randTypeOfQuestion = 0;
        if($scope.randTypeOfQuestion==0){ // Meaning questions
            $scope.theQuestion = QuestionSrve.meaningWordQuestion($scope.vocabularies,  $scope.questions[$scope.current], 4);
        }else if($scope.randTypeOfQuestion==1){ // Word question (meaning is the answer)
            $scope.theQuestion = QuestionSrve.wordMeaningQuestion($scope.vocabularies,  $scope.questions[$scope.current], 4);
        }else if($scope.randTypeOfQuestion==2){ // Vnmean question (vnmean is the answer)
            $scope.theQuestion = QuestionSrve.vnmeanWordQuestion($scope.vocabularies,   $scope.questions[$scope.current], 4);
        }else{// word vnmean question
            $scope.theQuestion = QuestionSrve.wordVNMeanQuestion($scope.vocabularies,   $scope.questions[$scope.current], 4);
        }
        $scope.current++;
        $scope.showButton=false;
        $scope.showProgressBar = true;
        // bar.value(0);
        ProgressBarServ.init();
        bar = ProgressBarServ.createCircle();
        bar.animate(1);
        $scope.questionCountDown = $timeout(function() {
            $scope.timeOut();
        }, 1000 * 11);
    };

    var query="select newtable1.idvocab as idvocab, * from (select newtable.idvocab as idvocab, * from (select vocabulary.idvocab as idvocab, * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab) as newtable left join typeofword on newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
    DatabaseService.get(query).then(function(result){
        $scope.vocabularies = result;
        // if($scope.numberWordViewed<=5){
            for (var i = 0; i < $scope.vocabularies.length; i++) {
                if($scope.vocabularies[i].remembered==1){
                    $scope.vocabularies[i].checkTimes=0;
                    $scope.questions.push($scope.vocabularies[i]);
                    console.log("current checktimes of word: " + $scope.questions[$scope.current].checkTimes);
                }
            }
        // }
        $scope.createQuestion();
    });   
});

app.controller('DailyWordCtrl', function($scope, DatabaseService){
    
});