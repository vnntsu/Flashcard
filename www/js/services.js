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