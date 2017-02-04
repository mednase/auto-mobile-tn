/**
 * Created by medna on 25/01/2017.
 */
app.controller('appController',['$scope',function ($scope) {
}]);
app.
controller('homeController', ['$scope', '$http', 'API_ENDPOINT',
    function ($scope,$http, API_ENDPOINT ) {

        $scope.currentDate=new Date();
        $scope.currentPage = 1;


        var setPage = function (pageNo) {
            $scope.currentPage = pageNo;

            $http.get(API_ENDPOINT.url + '/cars/'+pageNo).then(function (res) {
                $scope.cars= res.data.cars;
                $scope.totalCars=res.data.total;
                if(!$scope.$$phase){$scope.$apply();}
            });
        };

        setPage($scope.currentPage);

        /* pagination */
        $scope.pageChanged = function () {
            setPage($scope.currentPage);
            $('html, body').animate({scrollTop : 0},1000);

        };


}]).
controller('showCarController', ['car','$scope','$http','API_ENDPOINT',
    function (car,$scope ,$http,API_ENDPOINT) {
        $scope.car = car;

        $http.get(API_ENDPOINT.url+"/related/"+$scope.car._id).then(function (result) {
            $scope.other_cars=result.data;
        });
        $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
            $scope.marques=result.data;
        });

        $scope.$watch("selectedMarque",function (new_marque) {
            if(new_marque){
                $scope.models=JSON.parse(new_marque).models;
            }
        });

}]).
controller('marqueController', ['$scope', '$http', 'API_ENDPOINT','$stateParams',
    function ($scope,$http, API_ENDPOINT ,$stateParams) {

        $http.get(API_ENDPOINT.url+'/marque/'+$stateParams.marque).then(function (result) {
            $scope.cars=result.data;
            $scope.totalItems = $scope.cars.length;
        });

        $scope.currentPage = 1;

        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function() {
            $log.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.maxSize = 12;
        $scope.bigCurrentPage = 1;


}]).
controller('contactController',['$scope','NgMap','$timeout','GOVERNORATE',function ($scope,NgMap,$timeout,GOVERNORATE) {
    $scope.recaptcha={};
    $scope.recaptcha.key="6LdcSRQUAAAAAMyYVWuyDYn6eMp29m077xtkAuKS";
    $scope.recaptcha.lang="ar";
    $scope.recaptcha.type="image";
    $scope.recaptcha.valid=false;
    $timeout(function(){
        NgMap.getMap('map').then(function(map) {
            $scope.map=map;
            google.maps.event.trigger(map,'resize');
            $scope.map.showInfoWindow('bar', 'marker1');
        },1000);
    });
    $scope.recaptcha.response=function () {
        if($scope.recaptcha.getResponse() === ""){ //if string is empty
            alert("Please resolve the captcha and submit!")
        }else {
            var post_data = {  //prepare payload for request
                'name':vm.name,
                'email':vm.email,
                'password':vm.password,
                'g-recaptcha-response':$scope.recaptcha.getResponse()  //send g-captcah-response to our server
            };


            /* MAKE AJAX REQUEST to our server with g-captcha-string */
            $http.post('https://code.ciphertrick.com/demo/phpapi/api/signup',post_data).success(function(response){
                if(response.error === 0){
                    alert("Successfully verified and signed up the user");
                }else{
                    alert("User verification failed");
                }
            })
                .error(function(error){

                })
        }
    }

    $scope.cites=GOVERNORATE;

    $scope.sendMessage=function () {

    }

}]);