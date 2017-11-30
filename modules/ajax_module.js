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
		//Success response
		//debug(response.data,'---Success---');
		$scope.cities=response.data;
		angular.forEach($scope.cities,function(city){
			city.selected=false;
			city.show=false;
			city.refresh=false;
			city.refresh_time=0;
		});
	},function(response){
		//Error response
		debug(response,'---Error---');
	});
	/*
		Get weather
	*/
	var getWeather=function(city){
		var appId='ef27a31b33920f047388689eed3f8cf2';
		var weatherUrl='http://api.openweathermap.org/data/2.5/weather?id='+city.id+'&units=metric&lang=pl&APPID='+appId;
		$http.get(weatherUrl).then(function(response){
			//Success response
			//debug(response,'---response.data---');
			city.temp=response.data.main.temp;
			city.desc=response.data.weather[0].description;
			city.ico='http://openweathermap.org/img/w/'+response.data.weather[0].icon+'.png';
		},function(response){
			//Error response
			debug(response,'---Error---');
		});
	};
	var setPrevVal=function(val){
		var prevVal=val;
		if(typeof(prevVal)==="undefined"){
			return val=1;
		}
		else{
			return val=prevVal;
		}
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
				city.refresh_time=setPrevVal(city.refresh_time);
			}
			else{
				city.show=false;
			}
		});
	};
	$scope.checkCity=function(city){
		if(city.selected){
			getWeather(city);
			city.show=true;
			city.refresh_time=setPrevVal(city.refresh_time);
		}
		else{
			$scope.allCheck=false;
			city.show=false;
			city.refresh=false;
		}
	};
	$scope.setDefVal=function(refVal){
		if(refVal===null){
			this.city.refresh_time=1;
		}
		else if(typeof(refVal)==="undefined"){
			this.city.refresh_time=60;
		}
	};
	var startTimer=function(city){
		city.timerId=setInterval(function(){
			if(city.selected){
				getWeather(city);
			}
			else{
				stopTimer(city);
			}
		},(city.refresh_time*1000));
	};
	var stopTimer=function(city){
		clearInterval(city.timerId);
	};
	$scope.refWeather=function(city){
		if(city.refresh===true){
			startTimer(city);
		}
		else{
			stopTimer(city);
		}
	};
};
app.controller('appCtrl',appCtrl);