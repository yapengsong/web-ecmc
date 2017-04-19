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
     * @name eayunApp.directive:eayunDialog
     * @description
     * # eayunDialog
     * 对话框组件
     */
    .directive('eayunDialog', ['$templateRequest', '$compile', '$controller', '$injector', '$q', '$sce', function ($templateRequest, $compile, $controller, $injector, $q, $sce) {
        return {
            templateUrl: 'components/modal/dialog.html',
            restrict: 'EA',
            replace: true,
            link: function postLink(scope, element, attrs) {

                var ctrlInstance, ctrlLocals = {};
                var resolveIter = 0;
                var modalOptions = scope.options;
                var modalScope = scope;
                var template = $('<div>' + scope.template + '</div>');
                delete scope.options;
                delete scope.template;
                //加载HTML模板并且绑定scope
                element.find('.eayun-modal-dialog').empty();
                var form = template.find('form');
                form.attr('name') || form.attr('name', 'dialogForm');
                element.find('.eayun-modal-dialog').append($compile(template.html())(modalScope));
                modalScope.dialogForm = modalScope[form.attr('name')];
                /*function getTemplatePromise(options) {
                 return options.template ? $q.when(options.template) :
                 $templateRequest(angular.isFunction(options.templateUrl) ? (options.templateUrl)() : options.templateUrl);
                 }*/

                //同步获取resolves中的数据
                function getResolvePromises(resolves) {
                    var promisesArr = [];
                    angular.forEach(resolves, function (value) {
                        if (angular.isFunction(value) || angular.isArray(value)) {
                            promisesArr.push($q.when($injector.invoke(value)));
                        } else if (angular.isString(value)) {
                            promisesArr.push($q.when($injector.get(value)));
                        } else {
                            promisesArr.push($q.when(value));
                        }
                    });
                    return promisesArr;
                }

                if (modalOptions.controller) {
                    //resolves中数据全部加载完成
                    $q.all(getResolvePromises(modalOptions.resolve)).then(function (values) {
                        //构造controller执行环境
                        ctrlLocals.$scope = modalScope;
                        angular.forEach(modalOptions.resolve, function (value, key) {
                            ctrlLocals[key] = values[resolveIter++];
                        });
                        //构造controller
                        ctrlInstance = $controller(modalOptions.controller, ctrlLocals);
                        //处理controller起别名的情况
                        if (modalOptions.controllerAs) {
                            if (modalOptions.bindToController) {
                                angular.extend(ctrlInstance, modalScope);
                            }
                            modalScope[modalOptions.controllerAs] = ctrlInstance;
                        }

                        //重新绑定scope
                        var form = template.find('form');
                        modalScope.dialogForm = modalScope[form.attr('name')];
//          //加载HTML模板并且绑定scope
//            element.find('.eayun-modal-dialog').empty();
//            var form = template.find('form');
//            form.attr('name') || form.attr('name','dialogForm');
//            element.find('.eayun-modal-dialog').append($compile(template.html())(modalScope));
//            modalScope.dialogForm = modalScope[form.attr('name')];

                    });
                }

            }
        };
    }])
    .controller('EayunModalCtrl', ['$scope', '$state', '$modalInstance', 'options', 'template', function ($scope, $state, $modalInstance, options, template) {
        $scope.options = options;
        $scope.template = template;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.ok = function (data) {
            $modalInstance.close(data);
        };
        $scope.commit = function () {
            $scope.ok(true);
        };
    }])
    .controller('EayunConfirmCtrl', ['$scope', '$modalInstance', '$timeout', 'msg', 'type', 'timeout', function ($scope, $modalInstance, $timeout, msg, type, timeout) {
        $scope.msg = msg;
        $scope.type = type;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        $scope.ok = function () {
            $modalInstance.close(true);
        };
        if (timeout) {
            $timeout(function () {
                $scope.cancel();
            }, timeout, false);
        }
    }]);