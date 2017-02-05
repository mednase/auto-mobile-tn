/**
 * Created by medna on 25/01/2017.
 */
app.
controller('loginController', ['$scope','$rootScope', 'authService', '$window','API_ENDPOINT','$state',
    function ($scope, $rootScope,authService, $window,API_ENDPOINT,$state) {

        if (authService.isAuthenticated()) {
            $state.go("admin");
        }

        $scope.doLogin = function () {
            $scope.loading=true;
            data = $scope.login;
            authService.login(data).then(function () {
                $rootScope.isLoading=true;
                $scope.$parent.authenticated = true;
                $scope.loading=false;
                $state.go("admin");
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
controller('logoutController', ['authService', '$state', '$scope','$window','API_ENDPOINT','$rootScope', function (authService, $state, $scope,$window,API_ENDPOINT,$rootScope) {
    $scope.$parent.authenticated = false;
    authService.logout();
    setTimeout(function () {
        $state.go('home');
    },500)
}]);

