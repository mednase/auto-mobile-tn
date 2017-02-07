var app = angular.module('AutoMobileTn', ['ui.router','ngAnimate', 'toastr','datatables','ui.bootstrap',
'ngSweetAlert','ngMap','vcRecaptcha','pascalprecht.translate','ngCookies']);

app.config(['$urlRouterProvider', '$urlMatcherFactoryProvider', '$stateProvider',
    '$httpProvider', '$logProvider', '$locationProvider','toastrConfig','$qProvider','$translateProvider',
    function ($urlRouterProvider, $urlMatcherFactoryProvider, $stateProvider,
              $httpProvider, $logProvider, $locationProvider,toastrConfig,$qProvider,$translateProvider) {

        $translateProvider
            .useStaticFilesLoader({
                prefix: '/public/app/translations/',
                suffix: '.json'
            })
            .preferredLanguage('ar')
            .useLocalStorage()
            .useMissingTranslationHandlerLog();

        $qProvider.errorOnUnhandledRejections(false);

        $logProvider.debugEnabled(true);

        $httpProvider.interceptors.push(function ($q, $location) {
            return {
                response: function (response) {
                    return response;
                },
                responseError: function (response) {
                    if (response.status == 404)
                        $location.url('/error');
                    if (response.status === 401)
                        $location.url('/login');
                    if (response.status === 403) {
                        $location.url('/logout');
                    }
                    return $q.reject(response);
                }
            };
        });

        /* disable ui-router # in url */
        $urlRouterProvider.otherwise('/error');
        $locationProvider.html5Mode(true);


        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '/public/views/core/home.html',
                controller: 'homeController'
            })
            .state('marque_car', {
                url: '/marque/:marque',
                templateUrl: '/public/views/core/car.marque.html',
                controller: 'marqueController'
            })
            .state('login', {
                url: '/login',
                templateUrl: '/public/views/auth/login.html',
                controller: 'loginController'

            })
            .state('logout', {
                url: '/logout',
                controller: 'logoutController'
            })
            .state('contact', {
                url: '/contact',
                templateUrl: '/public/views/core/contact.html',
                controller: 'contactController'
            })
            .state('admin', {
                url: '/admin',
                controller: 'dashboardController',
                templateUrl: '/public/views/admin/dashboard.html',
                data: {
                    authenticate: true,
                }
            })
            .state('newCar', {
                url: '/admin/car/new',
                templateUrl: '/public/views/admin/new.car.html',
                controller: 'newCarController',
                data: {
                    authenticate: true,
                }
            })
            .state('editCar', {
                url: '/admin/car/:id/edit',
                templateUrl: '/public/views/admin/edit.car.html',
                controller: 'editCarController',
                resolve: {
                    car: function ($http, API_ENDPOINT, $stateParams, $state) {
                        return $http.get(API_ENDPOINT.url + '/car/'+$stateParams.id).then(function (res) {
                            return res.data;
                        },function () {
                            $state.go("error");
                        });
                    }
                },
                data: {
                    authenticate: true,
                }
            })
            .state('cars', {
                url: '/admin/cars',
                templateUrl: '/public/views/admin/list.cars.html',
                controller: 'carListController',
                data: {
                    authenticate: true,
                }
            }) .
            state('show_car', {
                url: '/car/:id/detail',
                templateUrl: '/public/views/core/show_car.html',
                controller: 'showCarController',
                resolve: {
                    car: function ($http, API_ENDPOINT, $stateParams, $state) {
                        return $http.get(API_ENDPOINT.url + '/car/'+$stateParams.id).then(function (res) {
                            return res.data;
                        },function () {
                            $state.go("error");
                        });
                    }
                }
            })
            .state('messages', {
                url: '/admin/messages',
                templateUrl: '/public/views/admin/messages.html',
                controller: 'messagesController',
                data: {
                    authenticate: true,
                }
            })
            .state('settings', {
                url: '/admin/settings',
                templateUrl: '/public/views/admin/settings.html',
                controller: 'settingsController',
                data: {
                    authenticate: true,
                }
            }).
            state('error', {
                url: '/error',
                templateUrl: '/public/views/core/error.html',
                controller:function ($window,API_ENDPOINT) {
                    $window.location.href=API_ENDPOINT.domain+"error"
                }
            });
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,
                newestOnTop: true,
                positionClass: 'toast-top-left',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body'
            });
}])
.run(['$rootScope','authService','$state','uibPaginationConfig',
    function ($rootScope,authService,$state,uibPaginationConfig) {
        $rootScope.isLoading=true;

        $rootScope.$on('$stateChangeStart', function (event, next) {
        uibPaginationConfig.nextText='التالي';
        uibPaginationConfig.previousText='السابق';

        if(next.data==null && authService.isAuthenticated() ){
            $rootScope.isLoading=true;
            authService.logout();
        }

        if (next.data && next.data.authenticate && !authService.isAuthenticated()) {
            event.preventDefault();
            $state.go('login');
        }

        if (authService.isAuthenticated()) {
            $rootScope.stylesheet = "/public/assets/css/admin.css";
            $rootScope.authenticated = true;
        } else
            $rootScope.stylesheet = "/public/assets/css/main.css";
        $rootScope.$on('$stateChangeSuccess', function (event, next) {
            if(next.name!="logout")
                $rootScope.isLoading=false;

            document.body.scrollTop = document.documentElement.scrollTop = 0;
        });


    });



}]);