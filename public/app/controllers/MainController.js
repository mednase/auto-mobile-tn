/**
 * Created by medna on 25/01/2017.
 */
app.controller('appController',['$scope','authService','$http','API_ENDPOINT','$timeout',
    '$translate','$rootScope','$state',
    function ($scope,authService,$http,API_ENDPOINT,$timeout,$translate,$rootScope,$state) {

        $rootScope.dateYear=new Date().getFullYear();

        if(authService.isAuthenticated()){
            $scope.unseen=0;
            $http.get(API_ENDPOINT.url+'/admin/notification').then(function (res) {
                $scope.notifications=res.data;
                angular.forEach(res.data,function (index,notif) {
                    if(notif.seen==false)
                        $scope.unseen+=1;
                })
            });

            $scope.setNotificationSeen=function () {
                if($scope.unseen>0)
                $http.post(API_ENDPOINT.url+'/admin/notification/seen').then(function () {
                    $timeout(function () {
                        $scope.unseen=0;
                    },2000)
                });
            }
        }

        $scope.switchLanguage = function() {
            if($translate.use()=='ar')
                $translate.use('fr');
            else
                $translate.use('ar');
        };

        $rootScope.changeLanguage=function (lng) {
            $translate.use(lng);
        }

        $rootScope.$on('$translateChangeSuccess', function(event, data) {

            var language = data.language;

            $rootScope.lang = language;

            $rootScope.dir= language === 'ar' ? 'rtl' : 'ltr';
            $rootScope.default_direction = language === 'ar' ? '-rtl' : '';
            $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

            $rootScope.default_float = language === 'ar' ? 'right' : 'left';
            $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';

        });



}]);
app.controller('homeController', ['$scope', '$http', 'API_ENDPOINT','$rootScope','$timeout',
    function ($scope,$http, API_ENDPOINT,$rootScope,$timeout ) {
        $scope.currentDate=new Date();
        $scope.search={};
        $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
            $scope.marques=result.data;
        });
        $scope.marque=null;

        $scope.$watch("marque",function (new_marque) {
            if(new_marque){
                $scope.models=JSON.parse(new_marque).models;
            }
        });

            $scope.loading=true;

            $http.get(API_ENDPOINT.url + '/home').then(function (res) {
                $scope.loading=false;
                $scope.newCars= res.data.newCars;
                $scope.oldCars= res.data.usedCars;
                $timeout(function () {
                    $('.lightSlider').lightSlider({
                        gallery: false,
                        slideMove: 1,
                        item: 3,
                        rtl:$rootScope.dir=='rtl',
                        pager:false,
                        slideMargin: 10,
                        prevHtml:'<div class="swiper-button-prev"><i class="fa fa-angle-left"></i></div>',
                        nextHtml:'<div class="swiper-button-next"><i class="fa fa-angle-right"></i></div>',
                        responsive : [
                            {
                                breakpoint:800,
                                settings: {
                                    item:2,
                                    slideMove:1,
                                    slideMargin:6,
                                }
                            },
                            {
                                breakpoint:480,
                                settings: {
                                    item:1,
                                    slideMove:1
                                }
                            }
                        ]
                    });
                },0);
            window.resize()
            });

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


        setPage($scope.currentPage);
        /* pagination */
        $scope.pageChanged = function () {
            setPage($scope.currentPage);
            $('html, body').animate({scrollTop : 0},1000);

        };


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

}]).
controller('carsController', ['$scope', '$http', 'API_ENDPOINT','$state',
    function ($scope,$http, API_ENDPOINT ,$state) {


        if($state.current.name=="new_cars")
            $http.get(API_ENDPOINT.url+'/new-cars').then(function (result) {
                $scope.cars=result.data;
                $scope.totalItems = $scope.cars.length;
            });
        else
            $http.get(API_ENDPOINT.url+'/old-cars').then(function (result) {
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


        $scope.setPage($scope.currentPage);
        /* pagination */
        $scope.pageChanged = function () {
            $scope.setPage($scope.currentPage);
            $('html, body').animate({scrollTop : 0},1000);

        };


    }]);