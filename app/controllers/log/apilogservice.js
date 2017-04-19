angular.module('eayun.log')
    .service('ApiLogService', ['$http', 'SysCode', '$q', function ($http, SysCode, $q) {
        var logService = this;
        logService.getCusUser = function () {
            return $http.post('/api/ecmc/api/overview/getcuslistbyorg',{}) .then(function (response) {
                return response.data;
            });
        };

        logService.getListData = function () {
            return $http.post('/api/ecmc/system/api/log/fetchApiNamesAndResourceTypes',{}).then(function (response) {
                return response.data;
            });
        };

        logService.getApiNamesByVersion = function (type) {
            return $http.post('/api/ecmc/system/api/log/getApiNamesByVersion',{
                "type":type
            }).then(function (response) {
                return response.data;
            });
        };


    }])
    .filter("isNull",function(){
        return function (input){
            if (input){
                return input ;
            }else {
                return "-------" ;
            }
        }
    })
    .filter("showStatus",function(){
        return function (input){
            if (input == 0){
                return "失败" ;
            }
            if (input == 1){
                return "成功" ;
            }
            if (input == 2){
                return "执行中" ;
            }
            return "" ;
        }
    })
    .filter("addVersion",function(){
        return function (input,version){
            if (input == "-------") {
                return input;
            }else{
                return version + "/" + input ;
            }
        }
    }).directive('resize', [ "$window", function ($window) {
        return function (scope, element) {
            var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return { 'h': w.height(), 'w': w.width() };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                //scope.windowWidth = newValue.w;

                scope.style = function () {
                    return {
                        'height': (newValue.h/3 - 70) + 'px',
                        //'width': (newValue.w/2 - 70) + 'px'
                    };
                };

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    }]);