/**
 * Created by medna on 09/10/2016.
 */
app.controller('dashboardController',['$rootScope','authService','$http','API_ENDPOINT','$timeout',
            function ($rootScope,authService,$http,API_ENDPOINT,$timeout) {
                $rootScope.unseen=0;
                $http.get(API_ENDPOINT.url+'/admin/notification').then(function (res) {
                    $rootScope.notifications=res.data;
                    angular.forEach(res.data,function (index,notif) {
                        if(notif.seen==false)
                            $rootScope.unseen+=1;
                    })
                });

                $http.get(API_ENDPOINT.url+'/admin/car/count').then(function (res) {
                    $rootScope.allCars=res.data.number;
                });

                $rootScope.setNotificationSeen=function () {
                    if($rootScope.unseen>0)
                        $http.post(API_ENDPOINT.url+'/admin/notification/seen').then(function () {
                        $timeout(function () {
                            $rootScope.unseen=0;
                        },2000)                    });
                }
}]).
controller('newCarController',['$scope','$http','API_ENDPOINT','toastr','$state',
    function ($scope,$http,API_ENDPOINT,toastr,$state) {
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
                if($(this).val().length>5)
                    $scope.car.images.push($(this).val());
            });
            $scope.car.marque=JSON.parse($scope.marque).nom;
            $http.post(API_ENDPOINT.url+"/admin/car/new",$scope.car).then(function () {
                toastr.success('لقد تم إضافة السيارة بنجاح ! ', 'إضافة السيارة');
                $scope.initCar();
                $state.go("cars");

            });
        }

}]).
controller('editCarController',['car','$scope','$http','API_ENDPOINT','toastr','$state',
    function (car,$scope,$http,API_ENDPOINT,toastr,$state) {
        $scope.car=angular.copy(car);
        $scope.initCar=function(){
            $scope.car.images=[];
            $scope.car=angular.copy(car);

        };
        $scope.removeImage=function ($index) {
            $scope.car.images.splice($index,1);
        }

        $http.get(API_ENDPOINT.url+"/marques").then(function (result) {
            $scope.marques=result.data;
            angular.forEach($scope.marques, function(mq, key) {
                if(mq.nom==car.marque){
                    $scope.marque=mq;
                    $scope.models=mq.models
                }
            })
        });

        $scope.$watch("car.marque",function (new_marque) {
            angular.forEach($scope.marques,function (mq) {
                if(mq.nom==new_marque)
                    $scope.models=mq.models;
            });
        });

        $scope.editCar=function () {
            $('.input-image').each(function () {
                if($(this).val().length>5)
                    $scope.car.images.push($(this).val());
            });
            $http.post(API_ENDPOINT.url+"/admin/car/update",$scope.car).then(function () {
                toastr.success('لقد تم حفظ التعديلات ! ', 'تعديل السيارة');
                $state.go("cars");
            });
        }



    }]).
controller('carListController',['$scope','DTOptionsBuilder','SweetAlert','$http','API_ENDPOINT',
    function ($scope,DTOptionsBuilder,SweetAlert,$http,API_ENDPOINT) {

         $http.get(API_ENDPOINT.url + '/cars').then(function (res) {
             $scope.cars=res.data;
         });


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
            .withDisplayLength(10)
            .withOption('order', [1, 'desc'])
            .withLanguage(language);

        $scope.deleteCar = function (car,$index) {
            SweetAlert.swal({
                    title: "هل أنت متأكد ؟",
                    text: "هل تريد حذف هذه السيارة من قاعدة البيانات ؟",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55", confirmButtonText: "نعم ، إحذف !",
                    cancelButtonText: "لا ، إلغاء الحذف",
                    closeOnConfirm: false,
                    closeOnCancel: true,
                    showLoaderOnConfirm: true

                }, function(isConfirm){
                    if (isConfirm) {
                        $http.post(API_ENDPOINT.url+"/admin/car/delete",{id:car._id}).then(function () {
                            SweetAlert.swal("","لقد تم حذف هذه السيارة بنجاح ", "success");
                            $scope.cars.splice($index,1);
                        },function () {
                            SweetAlert.swal("","حدث خطأ في النظام يرجى تكرار العملية","error");
                        })
                    }
                    return false;
                });
        }
    }
]).
controller('messagesController',['$rootScope','$scope','authService','$http','API_ENDPOINT','DTOptionsBuilder',
    '$uibModal','toastr','SweetAlert',
    function ($rootScope,$scope,authService,$http,API_ENDPOINT,DTOptionsBuilder,$uibModal,toastr,SweetAlert) {

        $http.get(API_ENDPOINT.url+'/admin/contacts').then(function (res) {
            $scope.contacts=res.data;
        });


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
            .withDisplayLength(10)
            .withOption('order', [1, 'desc'])
            .withLanguage(language);


        $scope.openMessageModal = function (contact) {
            $rootScope.messageModal=$uibModal.open({
                animation: true,
                templateUrl: 'messageModal.html',
                size: 'lg',
                controller: function($scope) {
                    $scope.contact=contact;
                    $scope.openSendModal = function (contact) {
                        $rootScope.messageModal.close('a');
                        $rootScope.sendModal=$uibModal.open({
                            animation: true,
                            templateUrl: 'sendModal.html',
                            size: 'lg',
                            controller: function($scope) {
                                $scope.contact=contact;
                                $scope.message="";
                                $scope.sendMessage=function () {
                                    toastr.info('يرجى الانتظار البريد الإلكتروني بصدد الإرسال','إتصل بنا :', {progressBar: true});
                                    $rootScope.sendModal.dismiss('cancel');
                                    $http.post(API_ENDPOINT.url+'/admin/contact/replay',{email:contact.email,
                                        message:$scope.message,title:$scope.title,name:contact.name}).then(function () {
                                        toastr.close();
                                        toastr.success('لقد تم بعث الرسالة بنجاح','إتصل بنا :')
                                    },function (err) {
                                        toastr.error('وقع خطأ في نظام بعث الرسائل الرجاء إعادة المحاولة ','إتصل بنا :')
                                    })
                                };
                                $scope.closeSendModal=function () {
                                    $rootScope.sendModal.dismiss('cancel');
                                }
                            }
                        });
                    };
                }
            });
        };

        $scope.deleteMessage = function (contact,$index) {
            SweetAlert.swal({
                title: "هل أنت متأكد ؟",
                text: "هل تريد حذف هذه الرسالة من قاعدة البيانات ؟",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: "نعم ، إحذف !",
                cancelButtonText: "لا ، إلغاء الحذف",
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true

            }, function(isConfirm){
                if (isConfirm) {
                    $http.post(API_ENDPOINT.url+"/admin/contact/delete",{id:contact._id}).then(function () {
                        SweetAlert.swal("","لقد تم حذف هذه الرسالة بنجاح ", "success");
                        $scope.contacts.splice($index,1);
                    },function () {
                        SweetAlert.swal("","حدث خطأ في النظام يرجى تكرار العملية","error");
                    })
                }
                return false;
            });
        }
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

        $scope.password={};
        $scope.changePassword=function () {
            console.log($scope.password);
        };
    }]);