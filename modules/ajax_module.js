var appCtrl=function($scope,$http){
	var citiesUrl='cities.json';
	$http.get(citiesUrl).then(function(response){
		$scope.cities=response.data;
		//Success response
		console.log(response);
		console.log(response.data);
	},function(response){
		//Error response
		console.log('Error');
		console.log(response);
	});
	//GET JSON
	var jsonUrl='https://danepubliczne.imgw.pl/api/data/synop';
	$http({
		method:'GET',
		url:jsonUrl,
		headers:{
			'Access-Control-Allow-Origin':'http://localhost:8080/'
		}
	}).then(function(respnse){
		//Success response
		console.log(response);
	},function(response){
		//Error response
		console.log('Error:');
		console.log(response);
	});
	$scope.checkCity=false;
	$scope.checkFunc=function(checkArg,city){
		if(checkArg===true){
			$scope.cityName=city;
		}
		else{
			$scope.cityName='-';
		}
	};
};
app.controller('appCtrl',appCtrl);