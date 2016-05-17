var app = angular.module('ionicApp.services', ['ionic', 'ngCordova']);

app.factory('DatabaseService', function($cordovaSQLite){
	var database = null;
	return {
		init: function(){
			window.plugins.sqlDB.copy("flashcard.db");
    		database = $cordovaSQLite.openDB("flashcard.db");
    		console.log("Open DB successful!");
		},
		get: function(query){
			var datas = [];
			return $cordovaSQLite.execute(database,query).then(function(result){
				if(result.rows.length > 0){
					for(var i=0; i<result.rows.length; i++){
						datas.push(result.rows.item(i));
					}
					console.log(datas.length);
					return datas;
				}else{
					console.log("NO DATA");
					return false;
				};
			});
		},
		update: function(query){
			database.transaction(function(transaction) {
				transaction.executeSql(query);
			});
		}

	};
});

app.factory('VocabCtrl', function(){

});

app.factory('LevelServ', function(DatabaseService,$ionicPopup){
	var showAlert = function(level, name){
		var alertPopup = $ionicPopup.alert({
			title: 'Congratulation!',
			template: "Your level is "+level+" and the name is " + name
		});
	};
	return {
		increase: function(){
			var query = "select idlevel, currentexp from profile";
			DatabaseService.get(query).then(function(result){
				var exp = result[0];
				query = "select point from level where idlevel=" + (exp.idlevel+1);
				DatabaseService.get(query).then(function(result){
					var point = result[0].point;
					console.log("exp point: " + point);
					exp.currentexp += 50;
					console.log("current exp point: " + exp.currentexp);
					if(exp.currentexp>=point){
						exp.idlevel++;
						query = "select nameoflevel name from level where idlevel="+(exp.idlevel);
						DatabaseService.get(query).then(function(result){
							showAlert(exp.idlevel,result[0].name);
						});

					}
					query = "update profile set idlevel="+exp.idlevel+",currentexp="+ exp.currentexp;
					console.log(query);
					DatabaseService.update(query);

				});
			});
		}
	};
});

app.factory('RandomSrve', function(){
	return {
		myRandom: function(range){
			return Math.round((Math.random() * (range-1)) * 1);
		}
	};
});

app.factory('QuestionSrve', function(RandomSrve,DatabaseService,$filter,$rootScope){
	var idWords=[];
	var findQuestion = function(length){
		var questions=[];
        for (var i = 0; i < length; i++) {
            query = "select a.idvocab idvocab, (select name from kindofword where idkindword=a.idkindword) name, meaning, vnmean, text, sound, image, pronounce from typeofword a, (select * from vocabulary where idvocab="+idWords[i]+") b where a.idvocab=b.idvocab";
            DatabaseService.get(query).then(function(result){
                result[0].checkTimes=0;
                questions.push(result[0]);
            });
        }
        return questions;
	};
    var isTestQuestion = function(rememberday){
    	console.log("come in here!");
        var day = $filter('date')(Date.parse(rememberday), 'dd');
        var month = $filter('date')(Date.parse(rememberday), 'MM');
	    var curDay = $filter('date')(Date.parse(new Date()), 'dd');
	    var curMonth = $filter('date')(Date.parse(new Date()), 'MM');
        if(month<curMonth || curDay-day>3){
            return true;
        }else{
            return false;
        }
    };
    var getMoreWordInDaily = function(){
        var query="select idvocab, rememberday from daily a where remembered=1 and idvocab not in (select idvocab from testword where testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"') order by rememberday";
        return DatabaseService.get(query).then(function(result){
            if(result){
                for (var i = 0; i < result.length; i++) {
                    if(isTestQuestion(result[i].rememberday)){
                    	console.log("have a word to test!");
                        return true;
                    }
                }
            }
            return getMoreWordInTopicOfWord().then(function(result){
            	return result;
            });
        });
    };
    var getMoreWordInTopicOfWord = function(){
        var query="select idvocab, rememberday from topicofword a where remembered=1 and idvocab not in (select idvocab from testword where testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"') order by rememberday";
        return DatabaseService.get(query).then(function(result){
            if(result){
                for (var i = 0; i < result.length; i++) {
                    if(isTestQuestion(result[i].rememberday)){
                        return true;
                    }
                }
                return false;
            }else{
            	return false;
            }
        });
    };
	var isOverTestTimes = function(){
    	var query = "select * from test where testday='"+$filter('date')(new Date(), "yyyy-MM-dd")+"'";
        return DatabaseService.get(query).then(function(result){
            if(result==false){
                return false;
            }else{
                if(result[0].testtimes<3){
                	return false;
                }else{
                	console.log("ho ho");
                	return true;
                }
            }
        });
    };

	return{
		isEqualRightAnswer: function(index,rightAnswer){
			if(index==rightAnswer){
				return true;
			}else{
				return false;
			}
		},
		createQuestion: function(vocabs, question, numOfQuestion, type){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = question.idvocab;
			console.log("typeQuestion: "+ type);
			if(type==1){
	    		var question1 = question.meaning;
			}else if(type==3){
	    		var question1 = question.vnmean;
			}else{
	    		var question1 = question.text;
			}
	    	var typeWord = question.name;
	    	console.log("The current answer: " + idQuestion);
	    	var rightAnswer = RandomSrve.myRandom(numOfQuestion);
	    	asked.push(idQuestion);
	    	console.log("Right answer: " + rightAnswer);
			nextAnswer = RandomSrve.myRandom(vocabs.length);
			for (var answerIndex = 0; answerIndex < numOfQuestion; answerIndex++){
				console.log("create answer: " + answerIndex);
				if(this.isEqualRightAnswer(answerIndex,rightAnswer)){
					answers[answerIndex].isAnswer=true;
					if(type==0){
			    		answers[answerIndex].content = question.meaning;
					}else if(type==2){
			    		answers[answerIndex].content = question.vnmean;
					}else{
						answers[answerIndex].content = question.text;
					}
				}else{
					answers[answerIndex].isAnswer=false;
					do{
						console.log("random answer: " + nextAnswer);
						var isExist = true;
						console.log("asked array length: " + asked.length);
						for (var i = 0; i < asked.length; i++) {
							if(asked[i]==vocabs[nextAnswer].idvocab){
								console.log("This answer had been exist");
								isExist = true;
								nextAnswer = RandomSrve.myRandom(vocabs.length);
								break;
							}else{
								console.log("No answer exists");
								isExist=false;
							}
						}
					}while(isExist);
					if(!isExist){
						asked.push(vocabs[nextAnswer].idvocab);
						if(type==0){
				    		answers[answerIndex].content = vocabs[nextAnswer].meaning;
						}else if(type==2){
				    		answers[answerIndex].content = vocabs[nextAnswer].vnmean;
						}else{
							answers[answerIndex].content = vocabs[nextAnswer].text;
						}
						nextAnswer = RandomSrve.myRandom(vocabs.length);
					}
				}
				console.log("create answer: " + answerIndex + " success");
			}
			var questionAndAnswer = {idQuestion: "", question: "", typeWord: "", answers: []};
			questionAndAnswer.idQuestion = idQuestion;
			questionAndAnswer.question = question1;
			questionAndAnswer.typeWord = typeWord;
			for (var i = 0; i < answers.length; i++) {
				questionAndAnswer.answers.push(answers[i]);
			}
			return questionAndAnswer;
		},
		isTest: function(){
			return isOverTestTimes().then(function(result){
				if(result){
					return 1; // case 1: over test times
				}else{
					console.log("hehe");
					var query = "select idvocab from testword where remembered=0";
				    var idWords = [];
				    return DatabaseService.get(query).then(function(result){
				        if(result){
				            return 3; // case 3: will be able to test
				        }else{
				        	return getMoreWordInDaily().then(function(result){
				        		if(result){
					            	console.log("OK! test");
					            	return 3;
				        		}else{
				            		return 2; // case 2: dont have any word to test
				        		}
				        	});
				        }
				    });
				}
			});
			
			
			// var query="select idvocab, rememberday from topicofword a where remembered=1 order by rememberday";
		 //    var idWords = [];
		 //    return DatabaseService.get(query).then(function(result){
		 //        if(result){
		 //            for (var i = 0; i < result.length; i++) {
		 //                if(isTestQuestion(result[i].rememberday)){
		 //                    idWords.push(result[i].idvocab);
		 //                }
		 //            }
		 //        }
		 //        query = "select idvocab, rememberday from daily where remembered=1 and idvocab not in (select idvocab from topicofword a where remembered=1) order by rememberday";
		 //        return DatabaseService.get(query).then(function(result){
		 //            if(result){
		 //                for (var i = 0; i < result.length; i++) {
		 //                    if(isTestQuestion(result[i].rememberday)){
		 //                        idWords.push(result[i].idvocab);
		 //                    }
		 //                }
		 //            }
		 //            if(idWords.length>=1){
		 //            	return true;
		 //            }else{
		 //            	return false;
		 //            }
		 //        });
		 //    });
		}
	};
});

app.factory('ProgressBarServ', function($interval){
	return{
		init: function(){
	        define(['require', './bower_components/progressbar.js/dist/progressbar.js'], function (require) {
	        	var ProgressBar = require('./bower_components/progressbar.js/dist/progressbar.js');
	        });
	        return ProgressBar;
		},
		createCircle: function(duration){
			var ProgressBar = this.init();
			var bar = new ProgressBar.Circle(container, {
				color: '#000',
				// This has to be the same size as the maximum width to
				// prevent clipping
				strokeWidth: 10,
				trailWidth: 10,
				duration: duration,
				text: {
					autoStyleContainer: false
				},
				from: { color: '#4CAF50', width: 10 },
				to: { color: '#4CAF50', width: 10 },
				// Set default step function for all animate calls
				step: function(state, circle) {
					circle.path.setAttribute('stroke', state.color);
					circle.path.setAttribute('stroke-width', state.width);

					var value = Math.round(circle.value() *10);
				    if (value === 0) {
				      circle.setText('Over');
				    } else {
				      circle.setText(value);
				    }
				}
			});
	        return bar;
		}
	}
});

app.factory('LoadingServ', function($ionicLoading, $timeout){
	return{
		init: function(){
			return $ionicLoading.show({
		        content: 'Loading',
		        animation: 'fade-in',
		        showBackdrop: true,
		        maxWidth: 200,
		        showDelay: 0
		    });
		},

	}
});

app.factory('IonicGoBackServ', function($rootScope, $ionicHistory){
	return{
		default: function(){
			$rootScope.$ionicGoBack = function(backCount) { 
	    	    $ionicHistory.goBack(backCount);
		    };
		}
	}
});