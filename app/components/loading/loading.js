'use strict';

/**
 * @ngdoc directive
 * @name eayunApp.directive
 * @description
 * 页面组件模块
 */
angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:ajaxValid
     * @description
     * # tree
     * 树形控件
     */
    .directive('eayunLoading', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'EA',
            templateUrl: 'components/loading/loading.html',
            controller: 'eayunLoadingCtrl'
        };
    }])
    .controller('eayunLoadingCtrl', ['$rootScope', '$scope', '$document', function ($rootScope,$scope, $document) {
        $rootScope.$on('loading.begin',function(){
            $document.find('body').css('overflow','hidden');
            $scope.show = true;
        });
        $rootScope.$on('loading.end',function(){
            $document.find('body').css('overflow','');
            $scope.show = false;
        });
    }]);

