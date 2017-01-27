/**
 * Created by medna on 25/01/2017.
 */
app.controller('homeController', ['$scope', '$http', 'API_ENDPOINT',
    function ($scope,$http, API_ENDPOINT ) {

        $http.get(API_ENDPOINT.url + '/cars').then(function (res) {
            $scope.cars= res.data;
        });

}]).controller('showCarController', ['$scope', '$http', 'API_ENDPOINT',
    function ($scope,$http, API_ENDPOINT ) {

        $http.get(API_ENDPOINT.url + '/cars').then(function (res) {
            $scope.cars= res.data;
        });

}]);