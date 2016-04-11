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