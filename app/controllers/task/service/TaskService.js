/**
 * Created by Administrator on 2016/6/20 0020.
 */
/**
 * Created by cxy on 2016/3/24.
 */
'use strict';

angular.module('eayun.task')
    .service('ServicetaskService', ['$http', 'toast', 'SysCode', 'eayunModal', '$q', function ($http, toast, SysCode, eayunModal, $q) {
        var tasklistService = {};


        /**校验*/
        tasklistService.checkBeanVail = function (value) {
            return $http.post('/api/ecmc/system/schedule/checkbeanname', {beanName: value}).then(function (response) {
                if (response.data.data) {
                    return true;
                } else {
                    return false;
                }
            });

        };

        /**获取任务名称*/
        tasklistService.getTaskName = function (taskId) {
            return $http.post('/api/ecmc/system/schedule/gettaskname', {taskId: taskId}).then(function (response) {
                if (response.data.data) {
                    return response.data.data.taskName;
                } else {
                    return "";
                }
            });

        };

        tasklistService.checkdate = function (value) {
            return $http.post('/api/ecmc/system/schedule/checkcronexpression', {cronExpression: value}).then(function (response) {
                if (response.data.data) {
                    return true;
                } else {
                    return false;
                }
            });

        };
        tasklistService.checkmethod = function (value, name) {
            return $http.post('/api/ecmc/system/schedule/checkmethodname', {
                methodName: value,
                beanName: name
            }).then(function (response) {
                if (response.data.data) {
                    return true;
                } else {
                    return false;
                }
            });

        };


        /******************增加************************/
        /**上一页*/
        tasklistService.goUp = function (pagenumber) {
            pagenumber--;
            if (pagenumber < 1) {
                pagenumber = 1;
            }
            return pagenumber;
        };
        /**下一页*/
        tasklistService.goDown = function (pagenumber) {
            pagenumber++;
            if (pagenumber > 3) {
                pagenumber = 3;
            }
            return pagenumber;
        };

        tasklistService.add = function (model) {
            console.info(model);
            return $http.post('/api/ecmc/system/schedule/addtask', model).then(function (response) {
                if (response.data.respCode == SysCode.success) {
                    toast.success('添加成功!');
                } else {
                    toast.error('添加失败!');
                }
            });
        };

        tasklistService.editModel = function (model) {
            return $http.post('/api/ecmc/system/schedule/modifytask', model).then(function (response) {
                if (response.data.respCode == SysCode.success) {
                    toast.success('编辑成功!');
                } else {
                    toast.error('编辑失败!');
                }
            });
        };

        tasklistService.detail = function (id, name) {
            return $http.post('/api/ecmc/system/schedule/gettask', {
                taskId: id,
                beanName: name
            }).then(function (response) {
                return response.data.data;
            });
        };

        /**
         * 暂停
         * */

        tasklistService.pausetask = function
            (id) {

            return $http.post('/api/ecmc/system/schedule/pausetask', {taskId: id}).then(function (response) {

                if (response.data.respCode == SysCode.success) {
                    toast.success('操作成功!');
                } else {
                    toast.error('操作失败!');
                }
            });

        };
        tasklistService.triggertask = function (id, name) {

            return $http.post('/api/ecmc/system/schedule/triggertask', {
                taskId: id,
                beanName: name
            }).then(function (response) {
                if (response.data.respCode == SysCode.success) {
                    toast.success('操作成功!');
                } else {
                    toast.error('操作失败!');
                }
            });
        };

        tasklistService.resumeTask = function (id) {

            return $http.post('/api/ecmc/system/schedule/resumetask', {
                taskId: id,

            }).then(function (response) {
                if (response.data.respCode == SysCode.success) {
                    toast.success('操作成功!');
                } else {
                    toast.error('操作失败!');
                }
            });
        };
        /**
         * 删除
         * */

        tasklistService.deleteTask = function (id, name) {
            return $http.post('/api/ecmc/system/schedule/deletetask', {
                taskId: id,
                beanName: name
            }).then(function (response) {
                if (response.data.respCode == SysCode.success) {
                    toast.success('操作成功!');
                } else {
                    toast.error('操作失败!');
                }
            });
        };

        /*
         * 获取所有任务
         * */
        tasklistService.getAllTaskList = function () {
            return $http.post('/api/ecmc/system/schedule/gettasklist', {}).then(function (response) {
                console.info(response.data.result)
                return response.data.result;
            });
        };

        tasklistService.getChartData = function (id, startTime, endTime) {
            return $http.post('/api/ecmc/system/schedule/statistics/getchartdata', {
                taskId: id,
                startTime: startTime,
                endTime: endTime
            }).then(function (response) {
                return response.data;
            });
        };
        return tasklistService;
    }])

