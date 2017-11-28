var appCtrl=function($scope,$http){
	/*
		Debug
	*/
	var debug=function(obj,title){
		console.log(title);
		console.log(obj);
	};
	/*
		Get cities
	*/
	var citiesUrl='cities.json';
	$http.get(citiesUrl).then(function(response){
		$scope.cities=response.data;
		//Success response
		//debug(response.data,'---Success---');
	},function(response){
		//Error response
		debug(response,'---Error---');
	});
	/*
		Get weather
	*/
	var getWeather=function(city){
		// var jsonUrl='http://danepubliczne.imgw.pl/api/data/synop';
		var appId='ef27a31b33920f047388689eed3f8cf2';
		var weatherUrl='http://api.openweathermap.org/data/2.5/weather?id='+city.id+'&units=metric&lang=pl&APPID='+appId;
		$http.get(weatherUrl).then(function(response){
			//Success response
			// debug(response,'---response.data---');
			city.temp=response.data.main.temp;
			city.desc=response.data.weather[0].description;
			city.ico='http://openweathermap.org/img/w/'+response.data.weather[0].icon+'.png';
		},function(response){
			//Error response
			debug(response,'---Error---');
		});
	};
	$scope.checkAll=function(){
		if($scope.allCheck){
			$scope.allCheck=true;
		}
		else{
			$scope.allCheck=false;
		}
		angular.forEach($scope.cities,function(city){
			city.selected=$scope.allCheck;
			if($scope.allCheck){
				getWeather(city);
				city.show=true;
			}
			else{
				city.show=false;
			}
		});
	};
	$scope.checkCity=function(city){
		if(city.selected){
			$scope.allCheck=true;
			getWeather(city);
			city.show=true;
		}
		else{
			$scope.allCheck=false;
			city.show=false;
		}
	};
};
app.controller('appCtrl',appCtrl);