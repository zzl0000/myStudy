var myModule = angular.module('MyModule', []);
myModule.directive('hello', ['', function(){
	// Runs during compile
	return {		
		restrict : 'E',
		template : '<div> Hi everyone ！</div>',
		replace : 'true'
	};
}]);