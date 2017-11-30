var appCtrl=function($scope,$http){
	/*
		Debug
	*/
	var debug=function(obj,title){
		console.log(title);
		console.log(obj);
	};
	/*
		Fisher-Yates shuffle
	*/
	$scope.shuffle=function(arr){
		var arrNum=(arr.length-1),i,randNum,tmp;
		for(i=arrNum;i>0;i--){
			randNum=Math.floor(Math.random()*i);
			tmp=arr[randNum];
			arr[randNum]=arr[i];
			arr[i]=tmp;
		}
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
		$scope.shuffle($scope.cities);
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
			debug(response,'---response.data---');
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
		$scope.notSelected=false;
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
	$scope.select={
		opt:{id:1,name:'A-Z'},
		opts:[
			{id:1,name:'A-Z'},
			{id:2,name:'Z-A'}
		]
	};
	/*
		Insertion sort
	*/
	$scope.sortAZ=function(arrayToSort){
		var arrNum=arrayToSort.length,i,j,tmp,arrIndex;
		for(i=0;i<arrNum;i++){
			tmp=arrayToSort[i];
			arrIndex=$scope.cities.indexOf(tmp);
			$scope.cities.splice(arrIndex,1);
			for(j=i-1;j>-1&&(arrayToSort[j].sort>tmp.sort);j--){
				arrayToSort[j+1]=arrayToSort[j];
			}
			arrayToSort[j+1]=tmp;
		}
		$scope.cities=arrayToSort.concat($scope.cities);
	};
	/*
		Insertion sort
	*/
	$scope.sortZA=function(arrayToSort){
		var arrNum=arrayToSort.length,i,j,tmp,arrIndex;
		for(i=0;i<arrNum;i++){
			tmp=arrayToSort[i];
			arrIndex=$scope.cities.indexOf(tmp);
			$scope.cities.splice(arrIndex,1);
			for(j=i-1;j>-1&&(arrayToSort[j].sort<tmp.sort);j--){
				arrayToSort[j+1]=arrayToSort[j];
			}
			arrayToSort[j+1]=tmp;
		}
		$scope.cities=arrayToSort.concat($scope.cities);
	};
	$scope.sortF=function(sortType){
		var sortArray=[];
		angular.forEach($scope.cities,function(city){
			if(city.selected){
				sortArray.push(city);
			}
		});
		switch(sortType){
			case 1:
				$scope.sortAZ(sortArray);
			break;
			case 2:
				$scope.sortZA(sortArray);
		}
	};
	$scope.checkSelect=function(){
		var sortType=$scope.select.opt.id;
		$scope.notSelected=true;
		angular.forEach($scope.cities,function(city){
			if($scope.notSelected){
				if(city.selected){
					$scope.notSelected=false;
					$scope.sortF(sortType);
				}
			}
		});
	};
	$scope.hideInfo=function(){
		$scope.notSelected=false;
	};
};
app.controller('appCtrl',appCtrl);