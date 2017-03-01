/**
 * Created by medna on 25/01/2017.
 */
app.controller('appController', ['$scope', 'authService', '$http', 'API_ENDPOINT', '$timeout',
    '$translate', '$rootScope', '$state',
    function ($scope, authService, $http, API_ENDPOINT, $timeout, $translate, $rootScope, $state) {
        $scope.parameters={facebookUrl:"",twitterUrl:"",email:"",youtubeUrl:"",instagramUrl:""};
        $http.get(API_ENDPOINT.url + '/parameters').then(function (res) {
            if(res.data)
                $scope.parameters=res.data;
        });

        $rootScope.dateYear = new Date().getFullYear();

        if (authService.isAuthenticated()) {
            $scope.unseen = 0;
            $http.get(API_ENDPOINT.url + '/admin/notification').then(function (res) {
                $scope.notifications = res.data;
                angular.forEach(res.data, function (notif) {
                    if (notif.seen == false)
                        $scope.unseen += 1;
                })
            });

            $scope.setNotificationSeen = function () {
                if ($scope.unseen > 0)
                    $http.post(API_ENDPOINT.url + '/admin/notification/seen').then(function () {
                        $timeout(function () {
                            $scope.unseen = 0;
                        }, 2000)
                    });
            }
        }
        $scope.zone=$state.current.name;

        $scope.switchLanguage = function () {
            $scope.isLoading=true;
            if ($translate.use() == 'ar')
                $translate.use('fr');
            else
                $translate.use('ar');

            $timeout(function () {
                $scope.isLoading=false;
            },2000)
        };

        $rootScope.changeLanguage = function (lng) {
            $translate.use(lng);
        }

        $rootScope.$on('$translateChangeSuccess', function (event, data) {

            var language = data.language;

            $rootScope.lang = language;

            $rootScope.dir = language === 'ar' ? 'rtl' : 'ltr';
            $rootScope.default_direction = language === 'ar' ? '-rtl' : '';
            $rootScope.opposite_direction = language === 'ar' ? 'ltr' : 'rtl';

            $rootScope.default_float = language === 'ar' ? 'right' : 'left';
            $rootScope.opposite_float = language === 'ar' ? 'left' : 'right';

        });
    }]).
controller('homeController', ['$scope', '$http', 'API_ENDPOINT', '$rootScope', '$timeout', '$state',
        function ($scope, $http, API_ENDPOINT, $rootScope, $timeout, $state) {
            $scope.currentDate = new Date();
            $scope.search = {price:"0,200000"};
            $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
                $scope.marques = result.data;
            });
            $scope.marque = null;

            $scope.$watch("marque", function (new_marque) {
                if (new_marque) {
                    $scope.models = JSON.parse(new_marque).models;
                }
            });

            $scope.loading = true;

            $http.get(API_ENDPOINT.url + '/home').then(function (res) {
                $scope.loading = false;
                $scope.newCars = res.data.newCars;
                $scope.oldCars = res.data.usedCars;
                $timeout(function () {
                    $('.lightSlider').lightSlider({
                        gallery: false,
                        slideMove: 1,
                        item: 3,
                        loop:true,
                        rtl: $rootScope.dir == 'rtl',
                        pager: false,
                        slideMargin: 10,
                        prevHtml: '<div class="swiper-button-prev"><i class="fa fa-angle-left"></i></div>',
                        nextHtml: '<div class="swiper-button-next"><i class="fa fa-angle-right"></i></div>',
                        responsive: [
                            {
                                breakpoint: 800,
                                settings: {
                                    item: 2,
                                    slideMove: 1,
                                    slideMargin: 6,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    item: 1,
                                    slideMove: 1
                                }
                            }
                        ]
                    });
                }, 0);
                window.resize()
            });

            $scope.searchCar = function () {
                if($scope.marque)
                    $scope.search.marque = JSON.parse($scope.marque).nom;
                $state.go("search", $scope.search);
            }


        }]).
controller('showCarController', ['car', '$scope', '$http', 'API_ENDPOINT','$state','$rootScope','$timeout',
    function (car, $scope, $http, API_ENDPOINT,$state,$rootScope,$timeout) {
        $scope.car = car;
        $scope.search = {};
        $scope.marque = null;
        $http.get(API_ENDPOINT.url + "/related/" + $scope.car._id).then(function (result) {
            $scope.other_cars = result.data;

            $timeout(function () {
                $('.lightSlider').lightSlider({
                    gallery: true,
                    rtl: $rootScope.dir == 'rtl',
                    item: 1,
                    speed:1000,
                    easing: 'cubic-bezier(0.25, 0, 0.25, 1)',
                    slideMargin: 0,
                    thumbItem: car.images.length,
                    freeMove: true,
                    swipeThreshold: 40,
                    adaptiveHeight: true,
                    auto:true,
                    loop:true,
                    pauseOnHover: true,
                    onBeforeSlide: function (el) {
                        $('#current').text(el.getCurrentSlideCount());
                    }
                });
            }, 0);
            window.resize()
        });


        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
        });

        $scope.$watch("marque", function (new_marque) {
            if (new_marque) {
                $scope.models = JSON.parse(new_marque).models;
            }
        });

        $scope.searchCar = function () {
            if($scope.marque)
                $scope.search.marque = JSON.parse($scope.marque).nom;
            $state.go("search", $scope.search);
        }
    }]).
controller('marqueController', ['$scope', '$http', 'API_ENDPOINT', '$stateParams','$state',
    function ($scope, $http, API_ENDPOINT, $stateParams,$state) {
        $scope.itemsPerPage=9;
        $scope.loading = true;
        $scope.marque = null;
        $scope.search = {price:"0,200000"};
        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
            $scope.loading = false;
        });
        $scope.zone=$state.current.name;
        $scope.selectedMarque=$stateParams.marque;

        $scope.$watch("marque", function (new_marque) {
            if (new_marque) {
                $scope.models = JSON.parse(new_marque).models;
            }
        });

        $http.get(API_ENDPOINT.url + '/marque/' + $stateParams.marque).then(function (result) {
            $scope.cars = result.data;
            $scope.totalItems = $scope.cars.length;
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        $scope.$watch('itemsPerPage',function (newP) {
            $scope.currentPage=1;
        })
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setPage($scope.currentPage);
        /* pagination */
        $scope.pageChanged = function () {
            $scope.setPage($scope.currentPage);
            $('html, body').animate({scrollTop: 0}, 1000);

        };

        $scope.searchCar = function () {
            if($scope.marque)
                $scope.search.marque = JSON.parse($scope.marque).nom;
            $state.go("search", $scope.search);
        }

    }]).
controller('contactController', ['$scope', 'NgMap', '$timeout', 'GOVERNORATE', 'vcRecaptchaService',
    'toastr', '$http', 'API_ENDPOINT','$translate',
    function ($scope, NgMap, $timeout, GOVERNORATE, vcRecaptchaService, toastr, $http, API_ENDPOINT,$translate) {
        $scope.recaptcha = {};
        $scope.recaptcha.key = "6LdcSRQUAAAAAMyYVWuyDYn6eMp29m077xtkAuKS";
        $scope.recaptcha.lang = $translate.use();
        $scope.recaptcha.type = "image";
        $scope.recaptcha.valid = false;
        $scope.contact = {};
        $timeout(function () {
            NgMap.getMap('map').then(function (map) {
                $scope.map = map;
                google.maps.event.trigger(map, 'resize');
                $scope.map.showInfoWindow('bar', 'marker1');
            }, 1000);
        });
        $scope.response = null;
        $scope.widgetId = null;
        $scope.cites = GOVERNORATE;
        $scope.setResponse = function (response) {
            $scope.response = response;
        };
        $scope.setWidgetId = function (widgetId) {
            $scope.widgetId = widgetId;
        };
        $scope.cbExpiration = function () {
            vcRecaptchaService.reload($scope.widgetId);
            $scope.response = null;
        };

        $scope.sendMessage = function () {
            var valid = $scope.contact.email.length > 5 && $scope.contact.name.length > 1 && $scope.contact.message.length > 9;
            if (valid) {
                toastr.success($translate.instant('MESSAGE_TOAST_SEND_EMAIL_WAIT'), $translate.instant('PAGE_CONTACT_SEND_US'));
                $http.post(API_ENDPOINT.url + "/contact/new", $scope.contact).then(function (res) {
                    if (res.data.success) {
                        toastr.clear();
                        toastr.success($translate.instant('MESSAGE_TOAST_SEND_EMAIL_DONE'), $translate.instant('PAGE_CONTACT_SEND_US'));
                        $scope.contact = {};
                        vcRecaptchaService.reload($scope.widgetId);
                    } else {
                        toastr.clear();
                        toastr.error($translate.instant('SYSTEM_FAIL'), $translate.instant('PAGE_CONTACT_SEND_US'));
                        vcRecaptchaService.reload($scope.widgetId);
                    }
                })

            } else {
                vcRecaptchaService.reload($scope.widgetId);
            }
        }

    }]).
controller('carsController', ['$scope', '$http', 'API_ENDPOINT', '$state',
    function ($scope, $http, API_ENDPOINT, $state) {
        $scope.marque = null;
        $scope.loading = true;
        $scope.search = {price:"0,200000"};
        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
        });
        $scope.itemsPerPage=9;
        $scope.zone=$state.current.name;

        $scope.$watch("marque", function (new_marque) {
            if (new_marque) {
                $scope.models = JSON.parse(new_marque).models;
            }
        });

        if ($state.current.name == "new_cars")
            $http.get(API_ENDPOINT.url + '/new-cars').then(function (result) {
                $scope.cars = result.data;
                $scope.totalItems = $scope.cars.length;
                $scope.loading = false;
            });
        else
            $http.get(API_ENDPOINT.url + '/old-cars').then(function (result) {
                $scope.cars = result.data;
                $scope.totalItems = $scope.cars.length;
                $scope.loading = false;
            });

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        $scope.$watch('itemsPerPage',function (newP) {
            $scope.currentPage=1;
        })
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setPage($scope.currentPage);
        /* pagination */
        $scope.pageChanged = function () {
            $scope.setPage($scope.currentPage);
            $('html, body').animate({scrollTop: 0}, 1000);

        };

        $scope.searchCar = function () {
            if($scope.marque)
                $scope.search.marque = JSON.parse($scope.marque).nom;
            $state.go("search", $scope.search, {reload: true});
        }

    }]).
controller('searchController', ['$scope', '$state', '$stateParams', '$http', 'API_ENDPOINT',
    function ($scope, $state, $stateParams, $http, API_ENDPOINT) {
        $scope.loading = true;


        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
        });
        $scope.zone=$state.current.name;

        $http.get(API_ENDPOINT.url + '/search',{ params:  $stateParams}).then(function (result) {
            $scope.cars=result.data;
            $scope.totalItems = $scope.cars.length;
            $scope.search=null;
            $scope.search = {
                price:"0,200000",
                marque:"",
                model:"",
                year:"",
                transmission:"",
                condition:""
            };

            $scope.loading = false;

        });
        $scope.itemsPerPage=9;

        $scope.currentPage = 1;
        $scope.maxSize = 5;

        $scope.$watch('itemsPerPage',function (newP) {
            $scope.currentPage=1;
        })
        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.setPage($scope.currentPage);
        /* pagination */
        $scope.pageChanged = function () {
            $scope.setPage($scope.currentPage);
            $('html, body').animate({scrollTop: 0}, 1000);

        };

        $scope.$watch("marque", function (new_marque) {
            if (new_marque){
                $scope.models = JSON.parse(new_marque).models;
            }
        });

        $scope.searchCar = function () {
            if($scope.marque)
                $scope.search.marque = JSON.parse($scope.marque).nom;

            $state.go($state.current, $scope.search, {reload: true});
        }

    }]);