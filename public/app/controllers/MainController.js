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
    $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyDy03U_uM9tQyFlXna0b_WpuvPbwWufJAE";

    $timeout(function(){
        NgMap.getMap('mapID').then(function(map) {
            $scope.position = new google.maps.LatLng(35.690502,10.845789);
            $scope.map=map;
            google.maps.event.trigger(map,'resize');
            $scope.map.showInfoWindow('bar', 'marker1');
        },1000);
    });
    $scope.cites=GOVERNORATE;
}]);