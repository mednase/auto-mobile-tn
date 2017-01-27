/**
 * Created by medna on 09/10/2016.
 */
app.controller('dashboardController',['$scope','$http','API_ENDPOINT',
    function ($scope,$http,API_ENDPOINT) {

}]).
controller('newCarController',['$scope','$http','API_ENDPOINT','toastr',
    function ($scope,$http,API_ENDPOINT,toastr) {
        $scope.initCar=function(){
            $scope.car={};
            $scope.car.images=[];
            $scope.car.caracteristique={};
            $('.input-image').each(function () {
                $(this).val("");
            });
            $scope.marque=null;
        };

        $scope.initCar();
        $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
            $scope.marques=result.data;
        });

        $scope.$watch("marque",function (new_marque) {
            if(new_marque){
                $scope.models=JSON.parse(new_marque).models;
            }
        });

        $scope.addCar=function () {
            $('.input-image').each(function () {
               $scope.car.images.push($(this).val());
            });
            $scope.car.marque=JSON.parse($scope.marque).nom;
            $http.post(API_ENDPOINT.url+"/admin/car/new",$scope.car).then(function () {
                toastr.success('لقد تم إضافة السيارة بنجاح ! ', 'إضافة السيارة');
                $scope.initCar();
            });
        }

}]).
controller('carListController',['Cars','$scope','DTOptionsBuilder',
    function (Cars,$scope,DTOptionsBuilder) {

        $scope.cars=Cars;

        var language = {
            "sProcessing": "جارٍ التحميل...",
            "sLengthMenu": "أظهر _MENU_ مدخلات",
            "sZeroRecords": "لم يعثر على أية سجلات",
            "sInfo": "إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل",
            "sInfoEmpty": "يعرض 0 إلى 0 من أصل 0 سجل",
            "sInfoFiltered": "(منتقاة من مجموع _MAX_ مُدخل)",
            "sInfoPostFix": "",
            "sSearch": "ابحث:",
            "sUrl": "",
            "oPaginate": {
                "sFirst": "الأول",
                "sPrevious": "السابق",
                "sNext": "التالي",
                "sLast": "الأخير"
            }
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(2)
            .withOption('order', [1, 'desc'])
            .withLanguage(language)



    }
]).
controller('messagesController',['$scope','$http','API_ENDPOINT',
    function ($scope,$http,API_ENDPOINT) {

}]).
controller('settingsController',['$scope','$http','API_ENDPOINT',
    function ($scope,$http,API_ENDPOINT) {
        $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
            $scope.marques=result.data;
        });

        $scope.addModel=function () {
            $http.post(API_ENDPOINT.url+"/admin/model/new",{marque_id:$scope.marque,model_name:$scope.model}).then(function (msg) {
                if(msg.data.success){
                    $scope.addModelSuccess=true;
                    $scope.addModelError=false;
                    $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
                        $scope.marques=result.data;
                    });
                    $scope.new_model="";
                }else{
                    $scope.addModelSuccess=false;
                    $scope.addModelError=true;
                }
                $scope.marque=null;
            });
        };
        $scope.addMarque=function () {
            $http.post(API_ENDPOINT.url+"/admin/marque/new",{nom_marque:$scope.nom_marque}).then(function (msg) {
                if(msg.data.success){
                    $scope.addMarqueSuccess=true;
                    $scope.addMarqueError=false;
                    $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
                        $scope.marques=result.data;
                    });
                    $scope.nom_marque="";
                }else{
                    $scope.addMarqueSuccess=false;
                    $scope.addMarqueError=true;
                }
            });
        };
    }]);