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

app.factory('LevelServ', function(DatabaseService){
	return {
		increase: function(){
			console.log("Come in!");
			var query = "select idlevel, currentexp from profile";
			DatabaseService.get(query).then(function(result){
				var exp = result[0];
				query = "select point from level where idlevel=" + (exp.idlevel+1);
				DatabaseService.get(query).then(function(result){
					var point = result[0].point;
					console.log("exp point: " + point);
					exp.currentexp += 45;
					if(exp.currentexp>=point){
						exp.idlevel++;
					}
					query = "update profile set idlevel="+exp.idlevel+",currentexp="+ exp.currentexp;
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

app.factory('QuestionSrve', function(RandomSrve){
	return{
		isEqualRightAnswer: function(index,rightAnswer){
			if(index==rightAnswer){
				return true;
			}else{
				return false;
			}
		},
		meaningWordQuestion: function(vocabs, question, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = question.idvocab;
	    	var question1 = question.text;
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
					answers[answerIndex].content = question.meaning;
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
						answers[answerIndex].content = vocabs[nextAnswer].meaning;
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
		wordMeaningQuestion: function(vocabs, question, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = question.idvocab;
	    	var question1 = question.meaning;
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
					answers[answerIndex].content = question.text;
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
						answers[answerIndex].content = vocabs[nextAnswer].text;
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
		vnmeanWordQuestion: function(vocabs, question, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = question.idvocab;
	    	var question1 = question.text;
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
					answers[answerIndex].content = question.vnmean;
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
						answers[answerIndex].content = vocabs[nextAnswer].vnmean;
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
		wordVNMeanQuestion: function(vocabs, question, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = question.idvocab;
	    	var question1 = question.vnmean;
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
					answers[answerIndex].content = question.text;
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
						answers[answerIndex].content = vocabs[nextAnswer].text;
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
		}
	};
});

app.factory('ProgressBarServ', function(){
	return{
		init: function(){
	        define(['require', './bower_components/progressbar.js/dist/progressbar.js'], function (require) {
	        	var ProgressBar = require('./bower_components/progressbar.js/dist/progressbar.js');
	        });
	        return ProgressBar;
		},
		createCircle: function(){
			var ProgressBar = this.init();
			var bar = new ProgressBar.Circle(container, {
				strokeWidth: 6,
				easing: 'easeInOut',
				duration: 12000,
				color: '#F44336',
				trailColor: '#eee',
				trailWidth: 6,
				svgStyle: null
	        });
	        return bar;
		}
	}
});