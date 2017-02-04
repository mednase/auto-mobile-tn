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
controller('contactController',['$scope','NgMap','$timeout','GOVERNORATE','vcRecaptchaService',
    'toastr','$http','API_ENDPOINT',
    function ($scope,NgMap,$timeout,GOVERNORATE,vcRecaptchaService,toastr,$http,API_ENDPOINT) {
    $scope.recaptcha={};
    $scope.recaptcha.key="6LdcSRQUAAAAAMyYVWuyDYn6eMp29m077xtkAuKS";
    $scope.recaptcha.lang="ar";
    $scope.recaptcha.type="image";
    $scope.recaptcha.valid=false;
    $scope.contact={};
    $timeout(function(){
        NgMap.getMap('map').then(function(map) {
            $scope.map=map;
            google.maps.event.trigger(map,'resize');
            $scope.map.showInfoWindow('bar', 'marker1');
        },1000);
    });
    $scope.response = null;
    $scope.widgetId = null;
    $scope.cites=GOVERNORATE;
    $scope.setResponse = function (response) {
        $scope.response = response;
    };
    $scope.setWidgetId = function (widgetId) {
        $scope.widgetId = widgetId;
    };
    $scope.cbExpiration = function() {
        vcRecaptchaService.reload($scope.widgetId);
        $scope.response = null;
    };

    $scope.sendMessage=function () {
        var valid=$scope.contact.email.length>5 && $scope.contact.name.length>1 && $scope.contact.message.length>9;
        if (valid) {
            $http.post(API_ENDPOINT.url+"/contact/new",$scope.contact).then(function (res) {
                if(res.data.success){
                toastr.success('لقد تم لقد تم إرسال الرسالة  بنجاح  ! ', 'أرسل إلينا ');
                $scope.contact={};
                vcRecaptchaService.reload($scope.widgetId);
                }else {
                    toastr.error('خطأ في إرسال المعطيات ! ', 'أرسل إلينا ');
                    vcRecaptchaService.reload($scope.widgetId);
                }
            })

        } else {
            vcRecaptchaService.reload($scope.widgetId);
        }
    }

}]);