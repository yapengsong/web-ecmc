'use strict';

/**
 * @ngdoc directive
 * @name eayunApp.directive
 * @description
 * ҳ�����ģ��
 */
angular.module('eayun.ui.components')
    /**
     * @ngdoc directive
     * @name eayunApp.directive:eayunTable
     * @description
     * # eayunTable
     * ���
     */
    .directive('eayunTable', ['tableService', function (tableService) {
        var eayunTable = {
            template: '<div ng-transclude></div>',
            restrict: 'EA',
            replace: true,
            transclude: true,
            controller: ['$scope', function ($scope) {
                var tableCtrl = {};
                tableCtrl.api = {
                    draw: function () {
                        tableService.query(tableCtrl.getSource(), tableCtrl.getParam()).then(function (data) {
                            $scope.result = data;
                        });
                    },
                    setSource: function (source) {
                        $scope.ajaxSource = source;
                    }
                };
                tableCtrl.getParam = function () {
                    return typeof $scope.param === 'function' ? $scope.param() : {};
                };
                tableCtrl.getSource = function () {
                    return $scope.ajaxSource;
                };
                tableCtrl.setResult = function (result) {
                    $scope.result = result;
                };
                $scope.api = tableCtrl.api;
                return tableCtrl;
            }],
            scope: {api: '=api', ajaxSource: '=ajaxSource', param: '=param', result: '=result'},
            link: function postLink(scope, element, attrs) {
                if (scope.ajaxSource && element.find('eayun-table-page').length == 0) {
                    scope.api.draw();
                }
                if (!scope.ajaxSource) {
                    scope.$watch('ajaxSource', function (a) {
                        var tableCtrl = eayunTable.controller[eayunTable.controller.length - 1](scope);
                        scope.$broadcast('a', tableCtrl);
                        if (element.find('eayun-table-page').length == 0) {
                            scope.api.draw();
                        }
                    });
                }
            }
        };
        return eayunTable;
    }])
    /**
     * @ngdoc directive
     * @name eayunApp.directive:eayunTablePage
     * @description
     * # eayunTablePage
     * ����ҳ���
     */
    .directive('eayunTablePage', ['tableService', '$timeout', function (tableService, $timeout) {
        return {
            templateUrl: 'components/table/tablepage.html',
            restrict: 'EA',
            replace: true,
            require: '^eayunTable',
            scope: false,
            link: function postLink(scope, element, attrs, tableCtrl) {
                scope.$on('a', function (event, tableCtrl) {
                    tableCtrl.api.draw = function () {
                        pageApi.first();
                    };
                    tableCtrl.api.refresh = function () {
                        pageApi.goto(options.pageNumber);
                    };
                    tableCtrl.api.draw();
                });
                var options = {
                    pageSize: attrs.pageSize || 10,//ÿҳ��ʾ����
                    pageNumber: 1,//��ǰҳ
                    totalPage: 1,//��ҳ��
                    params: {}//ҵ����ز�ѯ����
                };
                scope.buttons = [2, 3, 4, 5];
                var changeButtons = function () {
                    if (options.pageNumber < 5) {
                        scope.buttons = [2, 3, 4, 5];
                    } else if (options.pageNumber <= (options.totalPage - 3)) {
                        scope.buttons = [options.pageNumber - 1, options.pageNumber, options.pageNumber + 1, options.pageNumber + 2];
                    } else if (options.pageNumber > (options.totalPage - 3)) {
                        scope.buttons = [options.totalPage - 4, options.totalPage - 3, options.totalPage - 2, options.totalPage - 1];
                    } else if (options.pageNumber == scope.buttons[0] || options.pageNumber == scope.buttons[3]) {
                        scope.buttons = [options.pageNumber - 1, options.pageNumber, options.pageNumber + 1, options.pageNumber + 2];
                    }
                };
                var pageApi = {
                    draw: function () {
                        options.params = tableCtrl.getParam();
                        if(options.params && options.params.$showLoading){
                            options.$showLoading = true;
                            delete options.params.$showLoading;
                        }
                        if (tableCtrl.getSource()) {
                            tableService.queryPage(tableCtrl.getSource(), options).then(function (page) {
                                scope.isLoad = true;
                                options.totalPage = (page.totalCount == 0 ? 1 : Math.ceil(page.totalCount / (null == page.pageSize || 0 == page.pageSize ? options.pageSize : page.pageSize)));//����ȡ����������ҳ��,����1ҳ
                                tableCtrl.setResult(page.result);
                                if (options.pageNumber > options.totalPage)
                                    this.goto(options.totalPage);
                            });
                        }
                    },
                    goto: function (index) {
                        if (angular.isString(index)) {
                            index = parseInt(index);
                        }
                        options.pageNumber = index;
                        if (index < 1)
                            options.pageNumber = 1;
                        if (index > options.totalPage)
                            options.pageNumber = options.totalPage;
                        changeButtons();
                        this.draw();
                    },
                    first: function () {
                        this.goto(1);
                    },
                    next: function () {
                        this.goto(options.pageNumber + 1);
                    },
                    back: function () {
                        this.goto(options.pageNumber - 1);
                    },
                    last: function () {
                        this.goto(options.totalPage);
                    }
                };
                tableCtrl.api.draw = function () {
                    pageApi.first();
                };
                tableCtrl.api.refresh = function () {
                    pageApi.goto(options.pageNumber);
                };
                tableCtrl.api.draw();
                scope.pageApi = pageApi;
                scope.options = options;
                scope.isLoad = false;
                scope.canShowButton = function (value) {
                    return value > 1 && value < options.totalPage;
                };
                scope.isCurrent = function (num) {
                    return options.pageNumber === num;
                };
                scope.number = '';
                var valid = /^[1-9]+[0-9]*]*$/;
                scope.$watch('number', function (newV, oldV) {
                    scope.number = oldV;
                    if ((newV > 0 && newV <= options.totalPage && valid.test(newV)) || newV == '') {
                        scope.number = newV;
                    }
                });
                /*scope.isInt = function($event){
                 var code = $event.keyCode;
                 if(code>47&&code<58){
                 var num = code - 48;
                 scope.number = scope.number + num + "";
                 }else if(code>95&&code<106){
                 var num = code - 96;
                 scope.number = scope.number + num + "";
                 }else if(code == 8){
                 scope.number = scope.number.substr(0,scope.number.length-1);
                 }
                 if(parseInt(scope.number) > options.totalPage)
                 scope.number = options.totalPage + "";
                 };*/
            }
        };
    }]);