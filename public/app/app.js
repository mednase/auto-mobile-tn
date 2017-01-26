var app = angular.module('AutoMobileTn', ['ui.router']);

app.config(['$urlRouterProvider', '$urlMatcherFactoryProvider', '$stateProvider',
    '$httpProvider', '$logProvider', '$locationProvider',
    function ($urlRouterProvider, $urlMatcherFactoryProvider, $stateProvider,
              $httpProvider, $logProvider, $locationProvider) {

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
            .state('login', {
                url: '/login',
                templateUrl: '/public/views/core/login.html',
                controller: 'loginController'

            })
            .state('logout', {
                url: '/logout',
                controller: 'logoutController'
            })
            .state('register', {
                url: '/register',
                templateUrl: '/public/views/core/register.html',
                controller: 'registerController'
            })
            .state('forget', {
                url: '/forget',
                templateUrl: '/public/views/core/forget-password.html',
                controller: 'forgotController'
            })
            .state('resetPassword', {
                url: '/resetpassword/:token',
                templateUrl: '/public/views/core/reset.html',
                controller: 'resetPasswordController'
            })
            .state('contactUs', {
                url: '/contactUs',
                templateUrl: '/public/views/core/reset.html',
                controller: 'contactUsController'
            })
            .state('admin', {
                url: '/admin',
                templateUrl: '/public/views/admin/dashboard.html',
                controller: 'dashboardController'
            })
            .state('newCar', {
                url: '/admin/car/new',
                templateUrl: '/public/views/admin/new.car.html',
                controller: 'dashboardController'
            })
            .state('cars', {
                url: '/admin/cars',
                templateUrl: '/public/views/admin/cars.html',
                controller: 'dashboardController'
            })
            .state('contactUsMessage', {
                url: '/admin/cars',
                templateUrl: '/public/views/admin/messages.html',
                controller: 'dashboardController'
            })
    }]);
