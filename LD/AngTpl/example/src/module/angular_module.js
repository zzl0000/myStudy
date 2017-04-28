var myModule = angular.module('HelloAngular',[]);

myModule.controller('HelloAngular', ['$scope', 
	function HelloAngular($scope){
		$scope.greeting = {
			text:'hello'
		};
	}
]);
