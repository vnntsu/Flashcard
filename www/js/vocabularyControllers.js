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

app.controller('SubTopicCtrl', function($scope, DatabaseService, $stateParams, $state, $timeout, $ionicLoading, LoadingServ){
    if ($stateParams.idtopic) {
        $scope.idTopicParam = $stateParams.idtopic;
    }else{
        //do something
    };
    $ionicLoading = LoadingServ.init();
    var query = "select idsubtopic, name from subtopic where idtopic="+$scope.idTopicParam;
    DatabaseService.get(query).then(function(result){
        $scope.tmpSubtopic = result;
        for (var i = 0; i < $scope.tmpSubtopic.length; i++) {
            $scope.tmpSubtopic[i].length=0;
            $scope.tmpSubtopic[i].learned=0;
        }
        query = "select subtopic.idsubtopic as idsubtopic, remembered, count(subtopic.idsubtopic)as number from subtopic join (select vocabulary.idvocab, idsubtopic, viewed,remembered,rememberday from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab) newtable on newtable.idsubtopic=subtopic.idsubtopic where idtopic="+$scope.idTopicParam+" group by subtopic.idsubtopic, remembered";
        DatabaseService.get(query).then(function(result){
            $scope.datas = result;
            for(var i = 0; i < $scope.tmpSubtopic.length; i++){
                $scope.tmpSubtopic[i].length = 0;
                $scope.tmpSubtopic[i].learned = 0;
            }
            if($scope.datas==false){
            }else{
                for(var i = 0; i < $scope.datas.length; i++){

                    for (var j = 0; j < $scope.tmpSubtopic.length; j++) {
                        if($scope.datas[i].idsubtopic==$scope.tmpSubtopic[j].idsubtopic){
                            $scope.tmpSubtopic[j].length += $scope.datas[i].number;
                            if($scope.datas[i].remembered==1){
                                $scope.tmpSubtopic[j].learned = $scope.datas[i].number;
                            };
                            break;
                        }
                    }
                }
            }
            
            query = "select idsubtopic, count(viewed)as number from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic in (select subtopic.idsubtopic from subtopic where idtopic="+$scope.idTopicParam+") and viewed=1 and remembered=0 group by idsubtopic, viewed";
            DatabaseService.get(query).then(function(result){
                var array = result;
                for(var i = 0; i < $scope.tmpSubtopic.length; i++){
                        $scope.tmpSubtopic[i].numberWordViewed = 0;
                        $scope.tmpSubtopic[i].isReview = true;
                }
                if(array==false){
                    // do something
                }else{
                    for (var j = 0; j < array.length; j++) {
                        for(var i = 0; i < $scope.tmpSubtopic.length; i++){
                            if($scope.tmpSubtopic[i].idsubtopic==array[j].idsubtopic){
                                $scope.tmpSubtopic[i].numberWordViewed = array[j].number;
                                $scope.tmpSubtopic[i].isReview = false;
                                break;
                            }else{
                                $scope.tmpSubtopic[i].numberWordViewed = 0;
                                $scope.tmpSubtopic[i].isReview = true;
                            }
                        }
                    }
                }
                
            });
        });
    });
    $timeout(function() {
        $scope.subtopics=$scope.tmpSubtopic;
        $ionicLoading.hide();
    }, 2000);
   
    $scope.showCard = function(id, title){
        var query = "select idvocab from topicofword where idsubtopic="+id;
        DatabaseService.get(query).then(function(result){
            if(result){
                $state.go('tabs.vocabfrontcard',{idsubtopic: id, title: title});
            }else{
                alert("The words of this sub-topic is coming!");
            }
        });
    }
    $scope.review = function(id,number){
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
        if($scope.idSubtopicParam>=0){
            if(vocab.viewed==0){
                var query = "update topicofword set viewed=1 where idvocab="+vocab.idvocab+" and idsubtopic=" + $scope.idSubtopicParam;
                DatabaseService.update(query);
            }
        }else{
            if(vocab.viewed==0){
                var toDay = $filter('date')(new Date(), 'yyyy-MM-dd');
                var query = "update daily set viewed=1 where idvocab="+vocab.idvocab;
                console.log(query);
                DatabaseService.update(query);
            }
        }
    };

    if($stateParams.idsubtopic){
        $scope.idSubtopicParam = $stateParams.idsubtopic;
        console.log("Get idsubtopic: " + $scope.idSubtopicParam);
        $scope.title = $stateParams.title;
        $scope.currentVocab = 0;
    };
    if($scope.idSubtopicParam>=0){
        var query = "select * from (select * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where idsubtopic="+$scope.idSubtopicParam+") newtable1 join typeofword on typeofword.idvocab=newtable1.idvocab) newtable2 join kindofword on kindofword.idkindword=newtable2.idkindword";
        DatabaseService.get(query).then(function(result){
            /// please show alert to inform user know that the words haven't had yet.
            $scope.vocabularies = result;
            $scope.playCard($scope.vocabularies[$scope.currentVocab]);
            $scope.isFront = true;
            $scope.isBack = !$scope.isFront;
        });
    }else{
        var query = "select * from (select * from vocabulary a, typeofword b where a.idvocab=b.idvocab) c join (select * from daily where learnday='"+$filter('date')(new Date(), 'yyyy-MM-dd')+"') d on d.idvocab=c.idvocab";
        DatabaseService.get(query).then(function(result){
            /// please show alert to inform user know that the words haven't had yet.
            $scope.vocabularies = result;
            $scope.playCard($scope.vocabularies[$scope.currentVocab]);
            $scope.isFront = true;
            $scope.isBack = !$scope.isFront;
        });
    }
    


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

app.controller('ReviewCtrl', function($scope, $rootScope, IonicGoBackServ, DatabaseService, QuestionSrve, LevelServ, $stateParams, $cordovaProgress, $cordovaMedia, $ionicLoading, RandomSrve, $timeout, $state, LoadingServ, $ionicHistory,$filter){
	if($stateParams.idsubtopic){
		$scope.idSubtopicParam = $stateParams.idsubtopic;
		$scope.numberWordViewed = $stateParams.numberWordViewed;
        console.log("numberWordViewed: " + $scope.numberWordViewed);
        $scope.normalTest = true;
        $scope.wrongCard = false;
        $scope.current = 0;
        $scope.questions = [];
	}

    $ionicLoading = LoadingServ.init();

    $scope.showCard = function(vocab){
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

    // $scope.callBack = function(){
    //     $state.go('tabs.subtopic',{idtopic: $scope.idSubtopicParam});
    // }

    $scope.checkAnswer = function(isAnswer, content){
        $scope.clicked=true;
        $scope.questions[$scope.current-1].checkTimes++;
    	if(isAnswer){
            $scope.questions[$scope.current-1].rightTimes++;
            if($scope.questions[$scope.current-1].rightTimes>=3){
                $scope.questions[$scope.current-1].remembered=1;
                if($scope.idSubtopicParam>=0){
                    query = "update topicofword set remembered=1 where idvocab="+$scope.theQuestion.idQuestion;
                }else{
                    query = "update daily set remembered=1 where idvocab="+$scope.theQuestion.idQuestion;
                    console.log(query);
                }
                DatabaseService.update(query);
                query="select idvocab from testword where idvocab="+$scope.theQuestion.idQuestion;
                DatabaseService.get(query).then(function(result){
                    if(result){
                        console.log("da ton tai tu nay trong testword");
                    }else{
                        query="insert into testword values("+$scope.theQuestion.idQuestion+", '"+$filter('date')(new Date(), "yyyy-MM-dd")+"',1)";
                        console.log(query);
                        DatabaseService.update(query);
                    }
                });
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
            $timeout(function() {$scope.createQuestion()}, 1000 * 5);

    	}else{
            $scope.wrongButtonClicked = content;
            for (var i = 0; i < $scope.theQuestion.answers.length; i++) {
                if($scope.theQuestion.answers[i].isAnswer){
                    $scope.rightButtonClicked = $scope.theQuestion.answers[i].content;
                    break;
                }
            }

    		$scope.wrongAnswerShow = true;
            $scope.showAnswer = false;
            $scope.showWrong = true;
    		console.log("wrong answer");
            var tmp = $scope.questions[$scope.current-1];
            $scope.playSound(tmp.sound);

            $timeout(function() {$scope.getWrongCard(tmp)}, 1000 * 2);
    	}
    };

    $scope.createQuestion = function(){
        $scope.theQuestion=null;
        if($scope.questions[$scope.questions.length-1].checkTimes>=3){
            alert("Finish test!");
            IonicGoBackServ.default();
            $rootScope.$ionicGoBack();
        }else{
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
        console.log("current: " + $scope.current);
        console.log($scope.questions[$scope.current].idvocab + ": " + $scope.questions[$scope.current].text);
        $scope.theQuestionTmp = QuestionSrve.createQuestion($scope.vocabularies,  $scope.questions[$scope.current], 4, $scope.randTypeOfQuestion);
        $scope.current++;
        $timeout(function() {
            $ionicLoading.hide();
            $scope.theQuestion = $scope.theQuestionTmp;
        }, 1000);
    };

    $rootScope.$ionicGoBack = function(backCount) { 
        var r = confirm("Do you want to quit this review!");
        if (r == true) {
            IonicGoBackServ.default();
            $ionicHistory.goBack(backCount);
        }else{
            //do something when user cancel
        }
    };
    if($scope.idSubtopicParam>=0){
        var query="select newtable1.idvocab idvocab, (select name from kindofword where idkindword=newtable1.idkindword) name, meaning, vnmean, text, sound, image, pronounce, remembered, viewed from (select  * from (select * from vocabulary join topicofword on vocabulary.idvocab=topicofword.idvocab where topicofword.idsubtopic="+$scope.idSubtopicParam+") as newtable left join typeofword on  newtable.idvocab = typeofword.idvocab) as newtable1 left join kindofword on newtable1.idkindword = kindofword.idkindword";
        DatabaseService.get(query).then(function(result){
            $scope.vocabularies = result;
            console.log("length: " + result.length);
            if($scope.numberWordViewed<=5){
                for (var i = 0; i < $scope.vocabularies.length; i++) {
                    if($scope.vocabularies[i].viewed==1&&$scope.vocabularies[i].remembered==0){
                        $scope.vocabularies[i].checkTimes=0;
                        $scope.vocabularies[i].rightTimes=0;
                        $scope.questions.push($scope.vocabularies[i]);
                    }
                }
            }else{
                for (var i = 0; i < 5; i++) {
                    if($scope.vocabularies[i].viewed==1&&$scope.vocabularies[i].remembered==0){
                        $scope.vocabularies[i].checkTimes=0;
                        $scope.vocabularies[i].rightTimes=0;
                        $scope.questions.push($scope.vocabularies[i]);
                    }
                }
            }
            $scope.createQuestion();
        });
    }else{
        query = "select * from vocabulary a, typeofword b where a.idvocab=b.idvocab and a.idvocab in (select idvocab from daily where remembered=0 and viewed=1)";
        // query = "select idvocab from daily where remembered=0";
        DatabaseService.get(query).then(function(result){
            $scope.questions = result;
            for (var i = 0; i < $scope.questions.length; i++) {
                $scope.questions[i].checkTimes=0;
                $scope.questions[i].rightTimes=0;
                console.log($scope.questions[i].text);
            }
            query = "select * from vocabulary, typeofword where vocabulary.idvocab=typeofword.idvocab limit 30";
            DatabaseService.get(query).then(function(result){
                $scope.vocabularies = result;
                $scope.createQuestion();
            });
        });
    }
});

app.controller('TestCtrl', function($scope, IonicGoBackServ, DatabaseService, QuestionSrve, LevelServ, $stateParams, $cordovaProgress, $cordovaMedia, $ionicLoading, RandomSrve, $timeout, $state,ProgressBarServ, LoadingServ,$rootScope,$ionicHistory, $ionicPopup, $document, $filter){
    $scope.questions=[];
    $scope.current=0;
    var tmp = null;
    var bar = null;
    $scope.questionCountDown=null;
    $scope.pressCountDown=null;
    $scope.wrongCard = false;
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

    $rootScope.$ionicGoBack = function(backCount) { 
        console.log(backCount + " back back Count");
        if(bar){
            var value = bar.value();
            var r = confirm("Do you want to quit this test!");
            if (r == true) {
                $timeout.cancel($scope.questionCountDown);
                bar.destroy();
                IonicGoBackServ.default();
                $ionicLoading.hide();
                $ionicHistory.goBack(backCount);
            }else{
                //do something when user cancel
                bar.destroy();
                bar = ProgressBarServ.createCircle(value*10000);
                bar.set(value);
                bar.animate(0);
            }
        }else{
            var r = confirm("Do you want to quit this test!");
            if (r == true) {
                $ionicLoading.hide();
                IonicGoBackServ.default();
                $ionicHistory.goBack(backCount);
            }else{
                //do something when user cancel
            }
        }
    };

    $ionicLoading = LoadingServ.init();

    var mediaStatusCallback = function(status) {
        if(status == 1) {
            $ionicLoading.show({template: 'Loading...'});
        } else {
            $ionicLoading.hide();
        }
    };

    $scope.playSound = function(src){
        console.log("LINK SOUND: " + src);
        var media = new Media(src, null, null, mediaStatusCallback);
        media.play();
    };

    $scope.getWrongCard = function(vocab){
        $scope.showCard(vocab);
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
        IonicGoBackServ.default();
        $rootScope.$ionicGoBack();
        // $state.go('tabs.learn');
    }

    $scope.checkAnswer = function(isAnswer, content){
        $timeout.cancel($scope.questionCountDown);
        bar.destroy();
        bar = null;
        $scope.showButton = true;
        $scope.clicked=true;
        $scope.questions[$scope.current-1].checktimes++;
        if(isAnswer){
            $scope.isNext=true;
            $scope.questions[$scope.current-1].righttimes++;
            if($scope.questions[$scope.current-1].righttimes >= 3){
                $scope.questions[$scope.current-1].remembered=1;
                query = "update testword set remembered=1 where idvocab="+$scope.questions[$scope.current-1].idvocab;
                DatabaseService.get(query);
            }
            $scope.rightButtonClicked = content;
            LevelServ.increase();
            console.log("The answer: " + isAnswer);
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
                if($scope.theQuestion.answers[i].isAnswer){
                    $scope.rightButtonClicked = $scope.theQuestion.answers[i].content;
                    break;
                }
            }
            $scope.wrongAnswerShow = true;
            console.log("wrong answer");
            tmp = $scope.questions[$scope.current-1];
            $scope.playSound(tmp.sound);

            $scope.pressCountDown = $timeout(function() {$scope.getWrongCard(tmp)}, 1000 * 5);
            
        }
    };

    $scope.timeOut = function(isAnswer, content){
        bar.destroy();
        bar = null;
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

    var isExistTestToDay = function(){
        var query = "select * from test where testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"'";
        DatabaseService.get(query).then(function(result){
            if(result==false){
                query = "insert into test(testday, testtimes) values('"+$filter('date')(new Date(), "yyyy-MM-dd")+"', 0)";
            }else{
                query = "update test set testtimes="+(result[0].testtimes+1);
            }
            DatabaseService.update(query);
        });
    }

    $scope.createQuestion = function(){
        $ionicLoading = LoadingServ.init();
        $scope.theQuestion=null;
        if($scope.questions[$scope.questions.length-1].checktimes>=3){
            isExistTestToDay();
            alert("Finish test!");
            $ionicLoading.hide();
            $scope.callBack();
        }else{
            $scope.questions[$scope.current-1];
            if($scope.current==($scope.questions.length)){
                $scope.current=0;
            }
        }
        $scope.rightAnswerShow = false;
        $scope.wrongAnswerShow = false;
        $scope.wrongCard = false;
        $scope.rightButtonClicked = "";
        $scope.wrongButtonClicked = "";
        $scope.clicked = false;
        $scope.randTypeOfQuestion = RandomSrve.myRandom(4);
        $scope.theQuestionTmp = QuestionSrve.createQuestion($scope.vocabularies,  $scope.questions[$scope.current], 4, $scope.randTypeOfQuestion);
        $scope.current++;
        $scope.showButton=false;
        bar = ProgressBarServ.createCircle(10000);

        $timeout(function() {
            $ionicLoading.hide();
            $scope.theQuestion = $scope.theQuestionTmp;
            bar.set(1);
            bar.animate(0);
        }, 1000);


        $scope.questionCountDown = $timeout(function() {
            $scope.timeOut();
        }, 1000 * 11);
    };

    var findQuestion = function(length){
        var query = "select a.idvocab idvocab, (select name from kindofword where idkindword=a.idkindword) name, meaning, vnmean, text from typeofword a, (select * from vocabulary) b where a.idvocab=b.idvocab order by idvocab desc limit 30";
        DatabaseService.get(query).then(function(result){
            $scope.vocabularies = result;
        });
        console.log(idWords[0] + " idWords[0]");
        for (var i = 0; i < idWords.length; i++) {
            // query = "select * from testword where idvocab="+idWords[i];
            id = idWords[i];
            // DatabaseService.get(query).then(function(result){
            //     if(result){
                    query="update testword set testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"', remembered=0 where idvocab="+id;
                    DatabaseService.update(query);
                    console.log(query);
                // }
                // else{
                //     query="insert into testword values("+id+",'"+$filter('date')(new Date(), "yyyy-MM-dd")+"',0)";
                //     DatabaseService.update(query);
                // }
            // });
            query = "select a.idvocab idvocab, (select name from kindofword where idkindword=a.idkindword) name, meaning, vnmean, text, sound, image, pronounce from typeofword a, (select * from vocabulary where idvocab="+idWords[i]+") b where a.idvocab=b.idvocab";
            DatabaseService.get(query).then(function(result){
                result[0].checktimes=0;
                result[0].righttimes=0;
                $scope.questions.push(result[0]);
                console.log($scope.questions[0].checktimes + " - checktimes");
            });
        }


        $timeout(function() {
            $scope.createQuestion();
        }, 2000);
    };

    var isTestQuestion = function(rememberday){
        var day = $filter('date')(Date.parse(rememberday), 'dd');
        var month = $filter('date')(Date.parse(rememberday), 'MM');
        if(month<curMonth || curDay-day>=3){
            return true;
        }else{
            return false;
        }
    };

    var getMoreWordInDaily = function(){
        var query="select idvocab, rememberday from daily a where remembered=1 and idvocab not in (select idvocab from testword where testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"') order by rememberday";
        return DatabaseService.get(query).then(function(result){
            if(result){
                var lenthTmp = idWords.length;
                if(result.length>(5-lenthTmp)){
                    for (var i = 0; i < 5-lenthTmp; i++) {
                        if(isTestQuestion(result[i].rememberday)){
                            console.log(idWords.length + " idWords.length 22222222222222");
                            idWords.push(result[i].idvocab);
                        }
                    }
                }else{
                    for (var i = 0; i < result.length; i++) {
                        if(isTestQuestion(result[i].rememberday)){
                            console.log(idWords.length + " idWords.length 22222222222222");
                            idWords.push(result[i].idvocab);
                        }
                    }
                }
            }
            if(idWords.length<5){
                getMoreWordInTopicOfWord().then(function(result){

                });
            }else{
                findQuestion(5);
            }
        });
    };
    var getMoreWordInTopicOfWord = function(){
        var query="select idvocab, rememberday from topicofword a where remembered=1 and idvocab not in (select idvocab from testword where testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"') order by rememberday";
        return DatabaseService.get(query).then(function(result){
            if(result){
                var lenthTmp = idWords.length;
                if(result.length>(5-lenthTmp)){
                    console.log("Lay duoc 5 tu roi` + " +(5-lenthTmp));
                    for (var i = 0; i < 5-lenthTmp; i++) {
                    console.log("lap lap lap");
                        if(isTestQuestion(result[i].rememberday)){
                            idWords.push(result[i].idvocab);
                        }
                    }
                }else{
                    for (var i = 0; i < result.length; i++) {
                        if(isTestQuestion(result[i].rememberday)){
                            console.log(idWords.length + " idWords.length 3333333");
                            idWords.push(result[i].idvocab);
                        }
                    }
                }
            }
            findQuestion(idWords.length);
        });
    };

    var query = "select idvocab from testword where remembered=0";
    var idWords = [];
    var curDay = $filter('date')(Date.parse(new Date()), 'dd');
    var curMonth = $filter('date')(Date.parse(new Date()), 'MM');
    DatabaseService.get(query).then(function(result){
        if(result){
            for (var i = 0; i < result.length; i++) {
                idWords.push(result[i].idvocab);
            }
        }
        if(idWords.length<5){
            console.log(idWords.length + " idWords.length 11111111111111");
            // getMoreWordInDaily().then(function(result){

            // });
            query="select * from testword";
            DatabaseService.get(query).then(function(result){
                var index=0;
                for (var i = 0; i < result.length; i++) {
                    if(index>5){
                        break;
                    }else{
                        console.log("ok test");
                        console.log(result[i].testday);
                        if(isTestQuestion(result[i].testday)){
                            console.log("ok push");
                            idWords.push(result[i].idvocab);
                            index++;
                        }
                    }
                }
                findQuestion(5);
            });
        }else{
            findQuestion(5);
        }
    });
});

app.controller('DailyWordCtrl', function($scope, DatabaseService, $filter, $timeout, $state, LoadingServ, $ionicLoading){
    // $ionicLoading = LoadingServ.init();
    // $scope.words=[];
    // $scope.currentVocab = 0;
    // var query = "select wordperday from profile";
    // DatabaseService.get(query).then(function(result){
    //     $scope.numberWord=result[0].wordperday;
    //     query = "select idvocab from daily where remembered=0";
    //     DatabaseService.get(query).then(function(result){
    //         if(result){
    //             $scope.words=result;
    //         }
    //         if($scope.words.length<$scope.numberWord){
    //             query = "select idvocab from vocabulary where idvocab not in (select idvocab from daily) limit "+($scope.numberWord-$scope.words.length);
    //             console.log(query);
    //             DatabaseService.get(query).then(function(result){
    //                 for (var i = 0; i < result.length; i++) {
    //                     query = "insert into daily(idvocab, learnday,viewed,remembered) values("+result[i].idvocab+","+$filter('date')(new Date(), 'yyyy-MM-dd')+",0,0)"
    //                     DatabaseService.update(query);
    //                     $scope.words.push(result[i]);
    //                 }
    //             });
    //         }
    //         $timeout(function() {
    //             $scope.vocabs = [];
    //             for (var i = 0; i < $scope.numberWord; i++) {
    //                 query = "select * from vocabulary, typeofword where vocabulary.idvocab="+$scope.words[i].idvocab+"  and vocabulary.idvocab=typeofword.idvocab";
    //                 DatabaseService.get(query).then(function(result){
    //                     $scope.vocabs.push(result[0]);
    //                 });
    //             }
    //         }, 1000);
    //         query = "select idvocab from daily where remembered=0 and viewed=1";
    //         DatabaseService.get(query).then(function(result){
    //             if(result==false){
    //                 $scope.isReview=false;
    //             }else{
    //                 $scope.isReview=true;
    //                 $scope.numberWordViewed = result.length;
    //             }
    //             $ionicLoading.hide();
    //         });
    //     });
    // });

    // $scope.viewFunc = function(){
    //     $state.go('tabs.vocabfrontcard',{idsubtopic: -1, title: "Daily word"});
    // };

    // $scope.reviewFunc = function(){
    //     $state.go('tabs.review',{idsubtopic: -1, numberWordViewed: $scope.vocabs.length});

    // };

    var startGetWord = function(){
        console.log($scope.words.length + " words.length");
        $scope.vocabs = [];
        for (var i = 0; i < $scope.words.length; i++) {
            query = "select text from vocabulary a, typeofword b where a.idvocab="+$scope.words[i].idvocab+" and a.idvocab=b.idvocab";
            DatabaseService.get(query).then(function(result){
                $scope.vocabs.push(result[0]);
            });
        }
        query = "select idvocab from daily where remembered=0 and viewed=1";
        DatabaseService.get(query).then(function(result){
            if(result==false){
                $scope.isReview=false;
            }else{
                $scope.isReview=true;
                $scope.numberWordViewed = result.length;
            }
            $ionicLoading.hide();
        });
    };

    $ionicLoading = LoadingServ.init();
    $scope.words=[];
    $scope.currentVocab = 0;
    $scope.numberWordInDay=0;
    var query = "select wordperday from profile";
    DatabaseService.get(query).then(function(result){
        $scope.numberWord=result[0].wordperday;
        query = "select * from daily where learnday='"+$filter('date')(new Date(), 'yyyy-MM-dd')+"'";
        DatabaseService.get(query).then(function(result){
            if(result){
                console.log("111111111111111");
                $scope.words=result;
                startGetWord();
            }else{
                console.log("222222222222222");
                query = "select * from daily where remembered=0";
                DatabaseService.get(query).then(function(result){
                    if(result){
                        for (var i = 0; i < result.length; i++) {
                            console.log("idvocab = " + result[i].idvocab);
                            query = "update daily set learnday='"+$filter('date')(new Date(), 'yyyy-MM-dd')+"' where idvocab="+result[i].idvocab;
                            $scope.words.push(result[i]);
                        }
                    }
                    if($scope.words.length>=5){
                        // console.log($scope.words[0].idvocab + " 333333333");
                        startGetWord();
                    }else{
                console.log("333333333333");
                        query="select idvocab from vocabulary where idvocab not in (select idvocab from daily) limit "+($scope.numberWord-$scope.words.length);
                        DatabaseService.get(query).then(function(result){
                            if(result){
                                // console.log(result.length+" askldjfaksldjflk;asdf");
                                for (var i = 0; i < result.length; i++) {
                            console.log("idvocab = " + result[i].idvocab);
                                    query = "insert into daily(idvocab, learnday,viewed,remembered) values("+result[i].idvocab+",'"+$filter('date')(new Date(), 'yyyy-MM-dd')+"',0,0)"
                                    DatabaseService.update(query);
                                    $scope.words.push(result[i]);
                                }
                                startGetWord();
                            }else{
                                if($scope.words.length==0){
                                    alert("Out of word to learn!");
                                    return;
                                }else{
                                    startGetWord();
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    $scope.viewFunc = function(){
        $state.go('tabs.vocabfrontcard',{idsubtopic: -1, title: "Daily word"});
    };

    $scope.reviewFunc = function(){
        $state.go('tabs.review',{idsubtopic: -1, numberWordViewed: $scope.vocabs.length});

    };
});