/**
 * Created by medna on 25/01/2017.
 */
app.
controller('loginController', ['$scope','$rootScope', 'authService', '$window','API_ENDPOINT',
    function ($scope, $rootScope,authService, $window,API_ENDPOINT) {

        if (authService.isAuthenticated()) {
            $window.location.href=API_ENDPOINT.domain+"admin";
        }

        $scope.doLogin = function () {
            $scope.loading=true;
            data = $scope.login;
            authService.login(data).then(function () {
                $scope.loading=false;
                $window.location.href=API_ENDPOINT.domain+"admin";
            }, function (err) {
                if(err==2){
                    $scope.errorMessage="معلومات الدخول خاطئة.";
                }else
                    $scope.errorMessage="خطأ في الإتصال بقاعدة البيانات الرجاء إعادة المحاولة.";
                $scope.loginError=true;
                $scope.loading=false;
            });
        }

    }]).
controller('registerController', ['$scope', 'authService', '$state',
    function ($scope, authService, $state) {
        if (authService.isAuthenticated())
            $state.go('home');
        $scope.doRegister = function () {
            data = $scope.register;
            authService.register(data).then(function (data) {
                $state.go('login');
            }, function (response) {
            });
        }

    }]).
controller('logoutController', ['authService', '$state', '$scope','$window','API_ENDPOINT', function (authService, $state, $scope,$window,API_ENDPOINT) {
    authService.logout();
    $scope.$parent.authenticated = false;
    $window.location.href=API_ENDPOINT.domain;
}]).
controller('forgotController',['authService','$scope',function (authService,$scope) {
    $scope.email="";
    $scope.forgetProcess=function () {
        authService.forgot($scope.email).then(function (success) {
        },function(fail){
        })
    }
}]).
controller('resetPasswordController',['authService','$stateParams','$state','$scope',
    '$http','toastr'
    ,function (authService, $stateParams,$state,$scope,toastr) {

        authService.resetTokenValid($stateParams.token).then(function (response) {
            if(response.data.success==false){
                $state.go('forget');
            }
            $scope.resetProcess=function () {
                authService.resetPassword($stateParams.token,$scope.password,$scope.cpassword).then(function (response) {
                    if(response.data.success==false)

                    toastr.success(response.data.msg,'Reset Password');
                    $state.go('login');
                })
            }

        });

}]);

