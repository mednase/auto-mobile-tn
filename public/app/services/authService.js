/**
 * Created by medna on 25/01/2017.
 */
app.service('authService', function($q, $http, API_ENDPOINT,$window) {

    var LOCAL_TOKEN_KEY = 'user_token';
    var isAuthenticated = false;
    var authToken;


    function loadUserCredentials() {
        var token = $window.localStorage.getItem(LOCAL_TOKEN_KEY);
        if (token) {
            useCredentials(token);
        }
    }

    function storeUserCredentials(token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
        useCredentials(token);
    }

    function useCredentials(token) {
        isAuthenticated = true;
        authToken = token;
        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken;
    }

    function destroyUserCredentials() {
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN_KEY);
    }

    var register = function(user) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/auth/register', user).then(function(result) {
                if (result.data.success) {
                    resolve(result.data);
                } else {
                    reject(result.data);
                }
            });
        });
    };

    var login = function(user) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url + '/auth/login', user).then(function(result) {
                if (result.data.success) {
                    storeUserCredentials(result.data.token);
                    resolve(1);
                } else {
                    reject(2);
                }
            },function () {
                reject(3)
            });
        });
    };

    var logout = function() {
        destroyUserCredentials();
    };

    var forgot = function (email) {
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url+ '/auth/forgot',{email: email}).then(function (success) {
                    resolve(success)
                },function(err){
                    reject(err);
                }
            );
        });
    };

    var getUser= function(callback){
        $http.get(API_ENDPOINT.url + '/user/getInformation').then(function(result) {
            callback(result.data.user);
        });
    };

    var resetTokenV=function (token) {
        return $q(function(resolve, reject) {
            $http.get(API_ENDPOINT.url+ '/auth/reset/'+token).then(function (success) {
                    resolve(success)
                },function(err){
                    reject(err);
                }
            );
        });
    };
    var resetPassword=function (token,password,confirmpassword) {
        var data={token: token,password: password,Cpassword: confirmpassword};
        return $q(function(resolve, reject) {
            $http.post(API_ENDPOINT.url+ '/auth/reset',data).then(function (success) {
                    resolve(success)
                },function(err){
                    reject(err);
                }
            );
        });
    };

    loadUserCredentials();

    return {
        storeUserCredentials:storeUserCredentials,
        login: login,
        register: register,
        logout: logout,
        getUser: getUser,
        forgot: forgot,
        resetTokenValid: resetTokenV,
        resetPassword: resetPassword,
        isAuthenticated: function() {return isAuthenticated;}
    };
}).factory('httpRequestInterceptor', function () {
    return {
        request: function (config) {
            config.headers['Authorization'] = window.localStorage.getItem("user_token");
            return config;
        }
    };
}).config(function ($httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
});