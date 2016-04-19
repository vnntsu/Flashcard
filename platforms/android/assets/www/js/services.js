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
				};
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
		meaningWordQuestion: function(vocabs, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = RandomSrve.myRandom(vocabs.length);
	    	var question = vocabs[idQuestion].text;
	    	var typeWord = vocabs[idQuestion].name;
	    	console.log("The current answer: " + idQuestion);
	    	var rightAnswer = RandomSrve.myRandom(numOfQuestion);
	    	console.log("Right answer: " + rightAnswer);
			nextAnswer = RandomSrve.myRandom(vocabs.length);
			for (var answerIndex = 0; answerIndex < numOfQuestion; answerIndex++){
				console.log("create answer: " + answerIndex);
				if(this.isEqualRightAnswer(answerIndex,rightAnswer)){
					answers[answerIndex].isAnswer=true;
					answers[answerIndex].content = vocabs[idQuestion].meaning;
				}else{
					answers[answerIndex].isAnswer=false;
					do{

						console.log("random answer: " + nextAnswer);
						var isExist = true;
						// Checking the answer had been exist or be same the right answer
						if(asked.length || nextAnswer==idQuestion){
							console.log("asked array length: " + asked.length);
							for (var i = 0; i < asked.length; i++) {
								if(asked[i]==nextAnswer || nextAnswer==idQuestion){
									console.log("This answer had been exist");
									isExist = true;
									nextAnswer = RandomSrve.myRandom(vocabs.length);
									break;
								}else{
									console.log("No answer exists");
									isExist=false;
								}
							}
						}else{
							console.log("No any answer");
							isExist=false;
						}
					}while(isExist);
					if(!isExist){
						asked.push(nextAnswer);
						answers[answerIndex].content = vocabs[nextAnswer].meaning;
						nextAnswer = RandomSrve.myRandom(vocabs.length);
					}
				}
				console.log("create answer: " + answerIndex + " success");
			}
			var questionAndAnswer = {idQuestion: "", question: "", typeWord: "", answers: []};
			questionAndAnswer.idQuestion = idQuestion;
			questionAndAnswer.question = question;
			questionAndAnswer.typeWord = typeWord;
			for (var i = 0; i < answers.length; i++) {
				questionAndAnswer.answers.push(answers[i]);
			}
			return questionAndAnswer;
		},
		wordMeaningQuestion: function(vocabs, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = RandomSrve.myRandom(vocabs.length);
	    	var question = vocabs[idQuestion].meaning;
	    	var typeWord = vocabs[idQuestion].name;
	    	console.log("The current answer: " + idQuestion);
	    	var rightAnswer = RandomSrve.myRandom(numOfQuestion);
	    	console.log("Right answer: " + rightAnswer);
			nextAnswer = RandomSrve.myRandom(vocabs.length);
			for (var answerIndex = 0; answerIndex < numOfQuestion; answerIndex++){
				console.log("create answer: " + answerIndex);
				if(this.isEqualRightAnswer(answerIndex,rightAnswer)){
					answers[answerIndex].isAnswer=true;
					answers[answerIndex].content = vocabs[idQuestion].text;
				}else{
					answers[answerIndex].isAnswer=false;
					do{

						console.log("random answer: " + nextAnswer);
						var isExist = true;
						// Checking the answer had been exist or be same the right answer
						if(asked.length){
							console.log("asked array length: " + asked.length);
							for (var i = 0; i < asked.length; i++) {
								if(asked[i]==nextAnswer || nextAnswer==idQuestion){
									console.log("This answer had been exist");
									isExist = true;
									nextAnswer = RandomSrve.myRandom(vocabs.length);
									break;
								}else{
									console.log("No answer exists");
									isExist=false;
								}
							}
						}else{
							console.log("No any answer");
							isExist=false;
						}
					}while(isExist);
					if(!isExist){
						asked.push(nextAnswer);
						answers[answerIndex].content = vocabs[nextAnswer].text;
						nextAnswer = RandomSrve.myRandom(vocabs.length);
					}
				}
				console.log("create answer: " + answerIndex + " success");
			}
			var questionAndAnswer = {idQuestion: "", question: "", typeWord: "", answers: []};
			questionAndAnswer.idQuestion = idQuestion;
			questionAndAnswer.question = question;
			questionAndAnswer.typeWord = typeWord;
			for (var i = 0; i < answers.length; i++) {
				questionAndAnswer.answers.push(answers[i]);
			}
			return questionAndAnswer;
		},
		vnmeanWordQuestion: function(vocabs, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = RandomSrve.myRandom(vocabs.length);
	    	var question = vocabs[idQuestion].text;
	    	var typeWord = vocabs[idQuestion].name;
	    	console.log("The current answer: " + idQuestion);
	    	var rightAnswer = RandomSrve.myRandom(numOfQuestion);
	    	console.log("Right answer: " + rightAnswer);
			nextAnswer = RandomSrve.myRandom(vocabs.length);
			for (var answerIndex = 0; answerIndex < numOfQuestion; answerIndex++){
				console.log("create answer: " + answerIndex);
				if(this.isEqualRightAnswer(answerIndex,rightAnswer)){
					answers[answerIndex].isAnswer=true;
					answers[answerIndex].content = vocabs[idQuestion].vnmean;
				}else{
					answers[answerIndex].isAnswer=false;
					do{

						console.log("random answer: " + nextAnswer);
						var isExist = true;
						// Checking the answer had been exist or be same the right answer
						if(asked.length){
							console.log("asked array length: " + asked.length);
							for (var i = 0; i < asked.length; i++) {
								if(asked[i]==nextAnswer || nextAnswer==idQuestion){
									console.log("This answer had been exist");
									isExist = true;
									nextAnswer = RandomSrve.myRandom(vocabs.length);
									break;
								}else{
									console.log("No answer exists");
									isExist=false;
								}
							}
						}else{
							console.log("No any answer");
							isExist=false;
						}
					}while(isExist);
					if(!isExist){
						asked.push(nextAnswer);
						answers[answerIndex].content = vocabs[nextAnswer].vnmean;
						nextAnswer = RandomSrve.myRandom(vocabs.length);
					}
				}
				console.log("create answer: " + answerIndex + " success");
			}
			var questionAndAnswer = {idQuestion: "", question: "", typeWord: "", answers: []};
			questionAndAnswer.idQuestion = idQuestion;
			questionAndAnswer.question = question;
			questionAndAnswer.typeWord = typeWord;
			for (var i = 0; i < answers.length; i++) {
				questionAndAnswer.answers.push(answers[i]);
			}
			return questionAndAnswer;
		},
		wordVNMeanQuestion: function(vocabs, numOfQuestion){
			var answers = [{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""},{isAnswer:false,content:""}];
			var asked = [];
			var nextAnswer = 0;
			var idQuestion = RandomSrve.myRandom(vocabs.length);
	    	var question = vocabs[idQuestion].vnmean;
	    	var typeWord = vocabs[idQuestion].name;
	    	console.log("The current answer: " + idQuestion);
	    	var rightAnswer = RandomSrve.myRandom(numOfQuestion);
	    	console.log("Right answer: " + rightAnswer);
			nextAnswer = RandomSrve.myRandom(vocabs.length);
			for (var answerIndex = 0; answerIndex < numOfQuestion; answerIndex++){
				console.log("create answer: " + answerIndex);
				if(this.isEqualRightAnswer(answerIndex,rightAnswer)){
					answers[answerIndex].isAnswer=true;
					answers[answerIndex].content = vocabs[idQuestion].text;
				}else{
					answers[answerIndex].isAnswer=false;
					do{

						console.log("random answer: " + nextAnswer);
						var isExist = true;
						// Checking the answer had been exist or be same the right answer
						if(asked.length){
							console.log("asked array length: " + asked.length);
							for (var i = 0; i < asked.length; i++) {
								if(asked[i]==nextAnswer || nextAnswer==idQuestion){
									console.log("This answer had been exist");
									isExist = true;
									nextAnswer = RandomSrve.myRandom(vocabs.length);
									break;
								}else{
									console.log("No answer exists");
									isExist=false;
								}
							}
						}else{
							console.log("No any answer");
							isExist=false;
						}
					}while(isExist);
					if(!isExist){
						asked.push(nextAnswer);
						answers[answerIndex].content = vocabs[nextAnswer].text;
						nextAnswer = RandomSrve.myRandom(vocabs.length);
					}
				}
				console.log("create answer: " + answerIndex + " success");
			}
			var questionAndAnswer = {idQuestion: "", question: "", typeWord: "", answers: []};
			questionAndAnswer.idQuestion = idQuestion;
			questionAndAnswer.question = question;
			questionAndAnswer.typeWord = typeWord;
			for (var i = 0; i < answers.length; i++) {
				questionAndAnswer.answers.push(answers[i]);
			}
			return questionAndAnswer;
		}
	};
});

