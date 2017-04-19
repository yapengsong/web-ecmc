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
    .directive('treeView', ['$q', '$log', function ($q, $log) {
        return {
            restrict: 'E',
            templateUrl: 'components/tree/treeView.html',
            scope: {
                treeData: '=',
                canChecked: '=',
                textField: '@',
                itemClicked: '&',
                itemCheckedChanged: '&',
                itemTemplateUrl: '@',
                expendLevel: '='
            },
            controller: 'TreeCtrl'
        };
    }])
    .controller('TreeCtrl', ['$scope', 'eayunTreeService', function ($scope, eayunTreeService) {
        $scope.itemExpended = function (item, $event) {
            item.$$isExpend = !item.$$isExpend;
            $event.stopPropagation();
        };

        $scope.getItemIcon = function (item) {
            var isLeaf = $scope.isLeaf(item);

            if (isLeaf) {
                return 'glyphicon glyphicon-leaf';
            }

            return item.$$isExpend ? 'glyphicon glyphicon-minus' : 'glyphicon glyphicon-plus';
        };

        $scope.isLeaf = function (item) {
            return !item.children || !item.children.length;
        };

        $scope.$watch('treeData', function (data) {
            if (data) {
                eayunTreeService.expendToLevel(data, $scope.expendLevel === undefined ? 1 : $scope.expendLevel);
            }
        });

        $scope.warpCallback = function (callback, item, $event) {
            ($scope[callback] || angular.noop)({
                $item: item,
                $event: $event
            });
        };
    }])
    .service('eayunTreeService', [function () {
        var tree = this;

        function breadthFirst(item, visitFn, maxDepth, _depth) {
            var depth = _depth || 0;
            depth++;
            if (depth > maxDepth && maxDepth !== -1) {
                return;
            }
            var i, curItem, items = [], children = [];
            items = items.concat(item);

            for (i = 0; i < items.length; i++) {
                curItem = items[i];
                visitFn(curItem);
                if (!tree.isLeaf(curItem)) {
                    children = children.concat(tree.getChildren(curItem))
                }
            }
            if (children.length > 0) {
                breadthFirst(children, visitFn, maxDepth, depth);
            }
            depth--;
        };

        tree.expend = function (item) {
            if (!tree.isLeaf(item)) {
                item.$$isExpend = true;
            }
        };
        tree.expendAll = function (item) {
            if (angular.isArray(item)) {
                angular.forEach(item, function (value) {
                    tree.depthFirst(value, tree.expend);
                });
            } else {
                tree.depthFirst(item, tree.expend);
            }

        };
        tree.expendToLevel = function (item, level) {
            tree.breadthFirst(item, tree.expend, level);
        };
        tree.collapse = function (item) {
            if (!tree.isLeaf(item)) {
                item.$$isExpend = false;
            }
        };
        tree.collapseAll = function (item) {
            tree.depthFirst(item, tree.collapse);
        };
        /**
         * 深度优先遍历
         * @param item  树节点
         * @param visitFn 访问函数
         */
        tree.depthFirst = function (item, visitFn) {
            var i, children;
            visitFn(item);
            if (!tree.isLeaf(item)) {
                children = tree.getChildren(item);
                for (i = 0; i < children.length; i++) {
                    tree.depthFirst(children[i], visitFn);
                }
            }
        };
        tree.breadthFirst = function (item, visitFn, maxDepth) {
            breadthFirst(item, visitFn, maxDepth);
        };
        tree.getChildren = function (item) {
            return item ? item.children : undefined;
        };
        tree.isLeaf = function (item) {
            return !item.children || !item.children.length;
        };
    }]);
