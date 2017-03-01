/**
 * Created by medna on 09/10/2016.
 */
app.controller('dashboardController', ['$rootScope', 'authService', '$http', 'API_ENDPOINT', '$timeout',
    function ($rootScope, authService, $http, API_ENDPOINT, $timeout) {
        $rootScope.unseen = 0;
        $http.get(API_ENDPOINT.url + '/admin/notification').then(function (res) {
            $rootScope.notifications = res.data;
            angular.forEach(res.data, function (notif,index) {
                if (!notif.seen)
                    $rootScope.unseen += 1;
            })
        });

        $http.get(API_ENDPOINT.url + '/admin/car/count').then(function (res) {
            $rootScope.allCars = res.data.number;
        });

        $rootScope.setNotificationSeen = function () {
            if ($rootScope.unseen > 0)
                $http.post(API_ENDPOINT.url + '/admin/notification/seen').then(function () {
                    $timeout(function () {
                        $rootScope.unseen = 0;
                    }, 2000)
                });
        }
    }]).
controller('newCarController', ['$scope', '$http', 'API_ENDPOINT', 'toastr', '$state', '$translate', 'blockUI',
    function ($scope, $http, API_ENDPOINT, toastr, $state, $translate, blockUI) {
        $scope.initCar = function () {
            $scope.car = {};
            $scope.car.images = [];
            $scope.car.security = {};
            $scope.car.fonctional = {};
            $('.input-image').each(function () {
                $(this).val("");
            });
            $scope.marque = null;
        };

        $scope.initCar();
        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
        });

        $scope.$watch("marque", function (new_marque) {
            if (new_marque) {
                $scope.models = JSON.parse(new_marque).models;
            }
        });


        $scope.addCar = function () {
            blockUI.start($translate.instant("TOAST_WAIT_MESSAGE")+"......");
            $('.input-image').each(function () {
                if ($(this).val().length > 5)
                    $scope.car.images.push($(this).val());
            });
            $scope.car.marque = JSON.parse($scope.marque).nom;
            $http.post(API_ENDPOINT.url + "/admin/car/new", $scope.car).then(function () {
                toastr.success($translate.instant("CAR_TOAST_ADD_DONE"), $translate.instant("CAR_TOAST_ADD"));
                $scope.initCar();
                blockUI.stop();
            }, function () {
                toastr.error($translate.instant("SYSTEM_FAIL"), $translate.instant("CHANGE_PASSWORD"));
                blockUI.stop();

            });

        }

    }]).
controller('editCarController', ['car', '$scope', '$http', 'API_ENDPOINT', 'toastr', '$state',
    '$translate', 'blockUI','$timeout',
    function (car, $scope, $http, API_ENDPOINT, toastr, $state, $translate, blockUI,$timeout) {
        console.log("aaaaaaa");
        $scope.car = angular.copy(car);
        $scope.initCar = function () {
            $scope.car.images = [];
            $scope.car = angular.copy(car);
        };
        $scope.removeImage = function ($index) {
            $scope.car.images.splice($index, 1);
        }

        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
            angular.forEach($scope.marques, function (mq, key) {
                if (mq.nom == car.marque) {
                    $scope.marque = mq;
                    $scope.models = mq.models
                }
            })
        });

        $scope.$watch("car.marque", function (new_marque) {
            angular.forEach($scope.marques, function (mq) {
                if (mq.nom == new_marque)
                    $scope.models = mq.models;
            });
        });

        $scope.editCar = function () {
            blockUI.start($translate.instant("TOAST_WAIT_MESSAGE") + ".......");
            $('.input-image').each(function () {
                if ($(this).val().length > 5)
                    $scope.car.images.push($(this).val());
            });
            $http.post(API_ENDPOINT.url + "/admin/car/update", $scope.car).then(function () {
                toastr.success($translate.instant("CAR_TOAST_EDIT_DONE"), $translate.instant("CAR_TOAST_EDIT"));
                blockUI.stop();
            }, function () {
                toastr.error($translate.instant("SYSTEM_FAIL"), $translate.instant("CAR_TOAST_EDIT"));
                blockUI.stop();

            });

        }


    }]).
controller('carListController', ['$scope', 'DTOptionsBuilder', 'SweetAlert', '$http', 'API_ENDPOINT'
    , '$state', '$translate',
    function ($scope, DTOptionsBuilder, SweetAlert, $http, API_ENDPOINT, $state, $translate) {

        if ($state.current.name == "admin_new_cars") {
            $scope.NEWCARS = true;
            $http.get(API_ENDPOINT.url + '/new-cars').then(function (res) {
                $scope.cars = res.data;
            });
        } else {
            $scope.OLDCARS = true;
            $http.get(API_ENDPOINT.url + '/old-cars').then(function (res) {
                $scope.cars = res.data;
            });
        }
        var language = {
            "sProcessing": $translate.instant("TABLE_LANG.sProcessing"),
            "sSearch": $translate.instant("TABLE_LANG.sSearch"),
            "sLengthMenu": $translate.instant("TABLE_LANG.sLengthMenu"),
            "sInfo": $translate.instant("TABLE_LANG.sInfo"),
            "sInfoEmpty": $translate.instant("TABLE_LANG.sInfoEmpty"),
            "sInfoFiltered": $translate.instant("TABLE_LANG.sInfoFiltered"),
            "sInfoPostFix": "",
            "sLoadingRecords": $translate.instant("TABLE_LANG.sLoadingRecords"),
            "sZeroRecords": $translate.instant("TABLE_LANG.sZeroRecords"),
            "oPaginate": {
                "sFirst": $translate.instant("TABLE_LANG.oPaginate.sFirst"),
                "sPrevious": $translate.instant("TABLE_LANG.oPaginate.sPrevious"),
                "sNext": $translate.instant("TABLE_LANG.oPaginate.sNext"),
                "sLast": $translate.instant("TABLE_LANG.oPaginate.sLast"),
            }
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('order', [1, 'desc'])
            .withLanguage(language);

        $scope.deleteCar = function (car, $index) {
            SweetAlert.swal({
                title: $translate.instant('SWEETALERT_CONFIRM'),
                text: $translate.instant('CAR_SWEETALERT_DELETE_QUESTION'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: $translate.instant('SWEETALERT_DELETE_OK'),
                cancelButtonText: $translate.instant('SWEETALERT_DELETE_CANCEL'),
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true

            }, function (isConfirm) {
                if (isConfirm) {
                    $http.post(API_ENDPOINT.url + "/admin/car/delete", {id: car._id}).then(function () {
                        SweetAlert.swal("", $translate.instant('CAR_SWEETALERT_DELETE_DONE'), "success");
                        $scope.cars.splice($index, 1);
                    }, function () {
                        SweetAlert.swal("", $translate.instant('SYSTEM_FAIL'), "error");
                    })
                }
                return false;
            });
        }
    }
]).
controller('messagesController', ['$rootScope', '$scope', 'authService', '$http', 'API_ENDPOINT',
    'DTOptionsBuilder', '$uibModal', 'toastr', 'SweetAlert', '$translate',
    function ($rootScope, $scope, authService, $http, API_ENDPOINT, DTOptionsBuilder, $uibModal,
              toastr, SweetAlert, $translate) {

        $http.get(API_ENDPOINT.url + '/admin/contacts').then(function (res) {
            $scope.contacts = res.data;
        });


        var language = {
            "sProcessing": $translate.instant("TABLE_LANG.sProcessing"),
            "sSearch": $translate.instant("TABLE_LANG.sSearch"),
            "sLengthMenu": $translate.instant("TABLE_LANG.sLengthMenu"),
            "sInfo": $translate.instant("TABLE_LANG.sInfo"),
            "sInfoEmpty": $translate.instant("TABLE_LANG.sInfoEmpty"),
            "sInfoFiltered": $translate.instant("TABLE_LANG.sInfoFiltered"),
            "sInfoPostFix": "",
            "sLoadingRecords": $translate.instant("TABLE_LANG.sLoadingRecords"),
            "sZeroRecords": $translate.instant("TABLE_LANG.sZeroRecords"),
            "oPaginate": {
                "sFirst": $translate.instant("TABLE_LANG.oPaginate.sFirst"),
                "sPrevious": $translate.instant("TABLE_LANG.oPaginate.sPrevious"),
                "sNext": $translate.instant("TABLE_LANG.oPaginate.sNext"),
                "sLast": $translate.instant("TABLE_LANG.oPaginate.sLast"),
            }
        };

        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('order', [1, 'desc'])
            .withLanguage(language);


        $scope.openMessageModal = function (contact) {
            $rootScope.messageModal = $uibModal.open({
                animation: true,
                templateUrl: 'messageModal.html',
                size: 'lg',
                controller: function ($scope) {
                    $scope.contact = contact;
                    $scope.openSendModal = function (contact) {
                        $rootScope.messageModal.close('a');
                        $rootScope.sendModal = $uibModal.open({
                            animation: true,
                            templateUrl: 'sendModal.html',
                            size: 'lg',
                            controller: function ($scope) {
                                $scope.contact = contact;
                                $scope.message = "";
                                $scope.sendMessage = function () {
                                    toastr.info($translate.instant("MESSAGE_TOAST_SEND_EMAIL_WAIT"), $translate.instant("NAVBAR_CONTACT"), {progressBar: true});
                                    $http.post(API_ENDPOINT.url + '/admin/contact/replay', {
                                        email: contact.email,
                                        message: $scope.message, title: $scope.title, name: contact.name
                                    }).then(function () {
                                        $rootScope.sendModal.dismiss('cancel');
                                        toastr.clear();
                                        toastr.success($translate.instant("MESSAGE_TOAST_SEND_EMAIL_DONE"), $translate.instant("NAVBAR_CONTACT"))
                                    }, function (err) {
                                        toastr.error($translate.instant("SYSTEM_FAIL"), $translate.instant("NAVBAR_CONTACT"))

                                    })
                                };
                                $scope.closeSendModal = function () {
                                    $rootScope.sendModal.dismiss('cancel');
                                }
                            }
                        });
                    };
                }
            });
        };

        $scope.deleteMessage = function (contact, $index) {
            SweetAlert.swal({
                title: $translate.instant('SWEETALERT_CONFIRM'),
                text: $translate.instant('MESSAGE_SWEETALERT_DELETE_QUESTION'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: $translate.instant('SWEETALERT_DELETE_OK'),
                cancelButtonText: $translate.instant('SWEETALERT_DELETE_CANCEL'),
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true

            }, function (isConfirm) {
                if (isConfirm) {
                    $http.post(API_ENDPOINT.url + "/admin/contact/delete", {id: contact._id}).then(function () {
                        SweetAlert.swal("", $translate.instant('MESSAGE_SWEETALERT_DELETE_DONE'), "success");
                        $scope.contacts.splice($index, 1);
                    }, function () {
                        SweetAlert.swal("", $translate.instant('SYSTEM_FAIL'), "error");
                    })
                }
                return false;
            });
        }
    }]).
controller('settingsController', ['$scope', '$http', 'API_ENDPOINT', 'toastr', '$translate','$rootScope',
    function ($scope, $http, API_ENDPOINT, toastr, $translate,$rootScope) {
        $scope.password = {};
        $scope.changePassword = function () {
            $http.post(API_ENDPOINT.url + '/admin/reset-password', $scope.password).then(function (res) {
                if (res.data.error == 0)
                    toastr.success($translate.instant("CHANGE_PASSWORD_DONE"), $translate.instant("CHANGE_PASSWORD"));
                if (res.data.error == 1)
                    toastr.error($translate.instant("CHANGE_PASSWORD_WRONG_OLD"), $translate.instant("CHANGE_PASSWORD"));
                if (res.data.error == 2)
                    toastr.error($translate.instant("CHANGE_PASSWORD_WRONG_CONFIRM"), $translate.instant("CHANGE_PASSWORD"));

            }, function () {
                toastr.error($translate.instant("SYSTEM_FAIL"), $translate.instant("CHANGE_PASSWORD"));
            })
        };
        console.log($rootScope.parameters);
        $scope.changeParameters = function () {
            $http.post(API_ENDPOINT.url+'/admin/change-params',$scope.parameters).then(function (res) {
                $rootScope.parameters=res.data;
                toastr.success($translate.instant("CHANGE_PARAMS_DONE"), $translate.instant("CHANGE_PARAMS"));
            },function () {
                toastr.error($translate.instant("SYSTEM_FAIL"), $translate.instant("CHANGE_PARAMS"));
            });
        }
    }]).
controller('marquesController', ['$scope', '$http', 'API_ENDPOINT', '$compile', 'DTOptionsBuilder',
    '$translate', 'toastr', 'SweetAlert',
    function ($scope, $http, API_ENDPOINT, $compile, DTOptionsBuilder, $translate, toastr, SweetAlert) {
        $scope.models = [];
        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
            $scope.marques = result.data;
            angular.forEach($scope.marques, function (data) {
                angular.forEach(data.models, function (d) {
                    $scope.models.push({marque: data, nom: d});
                })
            })
        });

        var language = {
            "sProcessing": $translate.instant("TABLE_LANG.sProcessing"),
            "sSearch": $translate.instant("TABLE_LANG.sSearch"),
            "sLengthMenu": $translate.instant("TABLE_LANG.sLengthMenu"),
            "sInfo": $translate.instant("TABLE_LANG.sInfo"),
            "sInfoEmpty": $translate.instant("TABLE_LANG.sInfoEmpty"),
            "sInfoFiltered": $translate.instant("TABLE_LANG.sInfoFiltered"),
            "sInfoPostFix": "",
            "sLoadingRecords": $translate.instant("TABLE_LANG.sLoadingRecords"),
            "sZeroRecords": $translate.instant("TABLE_LANG.sZeroRecords"),
            "sEmptyTable": $translate.instant("TABLE_LANG.sEmptyTable"),
            "oPaginate": {
                "sFirst": $translate.instant("TABLE_LANG.oPaginate.sFirst"),
                "sPrevious": $translate.instant("TABLE_LANG.oPaginate.sPrevious"),
                "sNext": $translate.instant("TABLE_LANG.oPaginate.sNext"),
                "sLast": $translate.instant("TABLE_LANG.oPaginate.sLast"),
            }
        };
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withPaginationType('full_numbers')
            .withDisplayLength(10)
            .withOption('order', [1, 'desc'])
            .withLanguage(language);

        $("#btnAddMarque").click(function () {
            $("#tableMarque tbody").prepend($compile("" +
                "<tr><td colspan='2'><input id='vMai' ng-model='newMarque' placeholder='{{\"ADD_MARQUE_PLACEHOLDER\"|translate}}' class='form-control' type='text'></td><td>" +
                "<button ng-disabled='newMarque.length<1' ng-class='newMarque ?\"\":\"disabled\"' class='btn btn-primary' ng-click='addMarque()'>{{'SAVE'|translate}} <i class='fa fa-save'>  </i></button>" +
                "<button class='btn btn-warning' onclick='$(this).closest(\"tr\").remove()' >{{'CANCEL'|translate}} <i class='fa fa-times'>  </i></button>" +
                "</td></tr>")($scope));

            $scope.$apply();

        });
        $("#btnAddModel").click(function () {
            $("#tableModel").children('tbody:first').prepend($compile("" +
                "<tr><td><input  id='vMoi' ng-show='marque' ng-model='newModel' placeholder='{{\"ADD_MODEL_PLACEHOLDER\"|translate}}' class='form-control' type='text' ng-required='true'></td><td><select ng-model='marque'  class='form-control select2'>" +
                "<option ng-repeat='mq in marques track by $index' value='{{mq._id}}'>{{mq.nom}}</option>" +
                "</select></td><td>" +
                "<button class='btn btn-primary' ng-disabled='newModel.length<1' ng-class='marque && newModel ?\"\":\"disabled\"' ng-click='addModel()'>{{ 'SAVE'|translate }} <i class='fa fa-save'>  </i></button>" +
                "<button class='btn btn-warning' onclick='$(this).closest(\"tr\").remove()' >{{'CANCEL'|translate}} <i class='fa fa-times'>  </i></button>" +
                "</td></tr>")($scope));

            $scope.$apply();

        });

        $scope.addModel = function () {
            if ($scope.newModel && $scope.newModel.length > 0)
                $http.post(API_ENDPOINT.url + "/admin/model/new", {
                    marque_id: $scope.marque,
                    model_name: $scope.newModel
                }).then(function (msg) {
                    if (msg.data.success) {
                        toastr.success($translate.instant("MODEL_TOAST_ADD_DONE"), $translate.instant("MODEL_TOAST_ADD"));
                        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
                            $scope.marques = result.data;
                            $scope.models = [];
                            angular.forEach($scope.marques, function (data) {
                                angular.forEach(data.models, function (d) {
                                    $scope.models.push({marque: data, nom: d});
                                })
                            })
                        });
                        $scope.newModel = "";
                    } else {
                        $scope.addModelSuccess = false;
                        $scope.addModelError = true;
                    }
                    $scope.marque = null;
                });
            else
                $('#vMoi').addClass('error-input');
        };
        $scope.addMarque = function () {
            if ($scope.newMarque && $scope.newMarque.length > 0)
                $http.post(API_ENDPOINT.url + "/admin/marque/new", {nom_marque: $scope.newMarque}).then(function (msg) {
                    if (msg.data.success) {
                        toastr.success($translate.instant("MARQUE_TOAST_ADD_DONE"), $translate.instant("MARQUE_TOAST_ADD"));
                        $http.get(API_ENDPOINT.url + "/marques").then(function (result) {
                            $scope.marques = result.data;
                        });
                        $scope.newMarque = "";
                    } else {
                        $scope.addMarqueSuccess = false;
                        $scope.addMarqueError = true;
                    }
                });
            else
                $('#vMai').addClass('error-input');
        };
        $scope.deleteModel = function (model, marque) {
            SweetAlert.swal({
                title: $translate.instant('SWEETALERT_CONFIRM'),
                text: $translate.instant('MODEL_SWEETALERT_DELETE_QUESTION'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: $translate.instant('SWEETALERT_DELETE_OK'),
                cancelButtonText: $translate.instant('SWEETALERT_DELETE_CANCEL'),
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true

            }, function (isConfirm) {
                if (isConfirm) {
                    $http.post(API_ENDPOINT.url + "/admin/model/delete", {
                        marque_id: marque._id,
                        model_name: model.nom
                    }).then(function () {
                        $scope.models.splice($scope.models.indexOf(model), 1);
                        SweetAlert.swal("", $translate.instant('MODEL_SWEETALERT_DELETE_DONE'), "success");

                    }, function () {
                        SweetAlert.swal("", $translate.instant('SYSTEM_FAIL'), "error");
                    })
                }
                return false;
            });

        };
        $scope.deleteMarque = function (marque) {
            SweetAlert.swal({
                title: $translate.instant('SWEETALERT_CONFIRM'),
                text: $translate.instant('MARQUE_SWEETALERT_DELETE_QUESTION'),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55", confirmButtonText: $translate.instant('SWEETALERT_DELETE_OK'),
                cancelButtonText: $translate.instant('SWEETALERT_DELETE_CANCEL'),
                closeOnConfirm: false,
                closeOnCancel: true,
                showLoaderOnConfirm: true

            }, function (isConfirm) {
                if (isConfirm) {
                    $http.post(API_ENDPOINT.url + "/admin/marque/delete", marque).then(function () {
                        $scope.marques.splice($scope.marques.indexOf(marque), 1);
                        SweetAlert.swal("", $translate.instant('MARQUE_SWEETALERT_DELETE_DONE'), "success");
                        angular.forEach($scope.models, function (data, i) {
                            if (data.marque.nom == marque.nom) {
                                $scope.models.splice(i, 1);
                            }
                        });
                    }, function () {
                        SweetAlert.swal("", $translate.instant('SYSTEM_FAIL'), "error");
                    })
                }
                return false;
            });
        };
    }]);