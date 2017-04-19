/**
 * Created by eayun on 2016/4/14.
 */
'use strict'

angular.module('eayun.ecmc')
    .filter('discolor', [function () {
        return function (data) {
            var color = '';
            switch (data) {
                case 1:
                    color = 'diff-enlarge';
                    break;
                case 0:
                    color = '';
                    break;
                case -1:
                    color = 'diff-reduce';
                    break;
            }
            return color;
        }
    }])
    .filter('arrow', [function () {
        return function (data) {
            var arrow = '';
            switch (data) {
                case 1:
                    arrow = '↑';
                    break;
                case 0:
                    arrow = '—';
                    break;
                case -1:
                    arrow = '↓';
                    break;
            }
            return arrow;
        }
    }])
    .filter('time', [function () {
        return function (data) {
            var minute = Math.floor(data / 60);
            var second = data % 60;
            return minute + ':' + second;
        };
    }])
    .filter('statusClass', [function () {
        return function (data) {
            switch (data) {
                case 'ACTIVE':
                    return 'green';
                case 'ERROR':
                    return 'gray';
                case 'PENDING_CREATE':
                    return 'yellow';
                case 'PENDING_UPDATE':
                    return 'yellow';
                case 'PENDING_DELETE':
                    return 'yellow';
                default:
                    return '';
            }
        }
    }])
    .filter('statusCn', [function () {
        return function (data) {
            switch (data) {
                case 'ACTIVE':
                    return '正常';
                case 'ERROR':
                    return '错误';
                case 'PENDING_CREATE':
                    return '创建中';
                case 'PENDING_UPDATE':
                    return '更新中';
                case 'PENDING_DELETE':
                    return '删除中';
                case 'AVAILABLE':
                    return '正常';
                case 'IN-USE':
                    return '使用中';
                case 'CREATING':
                    return '创建中';
                case 'DOWNLOADING':
                    return '创建中';
                case 'ATTACHING':
                    return '挂载中';
                case 'DETACHING':
                    return '解绑中';
                case 'DELETING':
                    return '删除中';
                case 'SAVING':
                    return '创建中';
                case 'QUEUED':
                    return '创建中';
                default:
                    return data;
            }
        }
    }])
    .filter('statusWatch', [function () {
        return function (data, callback) {
            callback(data);
            return data;
        }
    }])
    .filter('setFirstKey', [function () {
        return function (data, firstKey) {
            var array = angular.copy(data,[]);
            return array.sort(sortFun);

            function sortFun(a,b) {
                var compare = 0;
                if (firstKey) {
                    if(a == firstKey){
                        if(b == a){
                            compare = 0;
                        } else {
                            compare = -1;
                        }
                    } else {
                        if(b == firstKey){
                            compare = 1;
                        }
                    }
                }
                return compare;
            }
        }
    }]);