var app = angular.module('ionicApp.customControllers', ['ionicApp.services']);

app.controller('NewCardCtrl', function($scope,$ionicActionSheet,$timeout){
	// $scope.hide = 0;	
	// console.log($scope.hide);
	$scope.ImageURI = 'Select Image';
    function UploadPicture(imageURI) {
        $scope.ImageURI =  imageURI;
        alert($scope.ImageURI );
    }
	$scope.ShowPictures = function() {
        navigator.camera.getPicture(UploadPicture, function(message) {
                alert('get picture failed');
            }, {
                quality: 50,
                destinationType: navigator.camera.DestinationType.FILE_URI,
                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
            }
        );
	};
	$scope.pickImage = function(){
		 // Show the action sheet
		var hideSheet = $ionicActionSheet.show({
			buttons: [
				{ text: 'From your gallery' },
				{ text: 'Take a photo' }
			],
			// destructiveText: 'Cancel',
			titleText: 'Pick the image',
			cancelText: 'Cancel',
			cancel: function() {
			// add cancel code..
			},
			buttonClicked: function(index) {
				if(index==0){
					navigator.camera.getPicture(UploadPicture, function(message) {
			            alert('get picture failed');
			        }, {
		                quality: 50,
		                destinationType: navigator.camera.DestinationType.FILE_URI,
		                sourceType: navigator.camera.PictureSourceType.PHOTOLIBRARY
			            }
			        );
				}else if(index==1){

				};
			}
		});
		// For example's sake, hide the sheet after two seconds
		// $timeout(function() {
		// 	hideSheet();
		// }, 2000);
		
    };
});

app.controller('CustomCtrl', function($scope){
    var tmp = angular.element(document.getElementById("#highchart"));
    tmp.highcharts({
        title: {
            text: 'Monthly Average Temperature',
            x: -20 //center
        },
        subtitle: {
            text: 'Source: WorldClimate.com',
            x: -20
        },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yAxis: {
            title: {
                text: 'Temperature (°C)'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
            valueSuffix: '°C'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Tokyo',
            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        }, {
            name: 'New York',
            data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        }, {
            name: 'Berlin',
            data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        }, {
            name: 'London',
            data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }]
    });
});