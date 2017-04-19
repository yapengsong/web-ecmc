/**
 * Created by chenglong on 2016/6/20 0020.
 */
'use strict';

angular.module('eayun.task')
    .controller('taskListCtrl', ['ServicetaskService', 'eayunModal', 'toast', '$state', 'SysCode', 'eayunStorage',
        function (ServicetaskService, eayunModal, toast, $state, SysCode, eayunStorage) {
            var tasklist = this;

            tasklist.myTable = {
                source: '/api/ecmc/system/schedule/gettasklist',
                api: {},
                getParams: function () {
                    return {
                        queryName: tasklist.queryName,
                        state: tasklist.state
                    };
                }
            };

            /*
             * 添加任務
             * */
            tasklist.add = function () {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '添加任务',
                    width: '600px',
                    templateUrl: 'controllers/task/add/add.html',
                    controller: 'TaskAddCtrl',
                    controllerAs: 'model'
                });
                result.then(function (model) {
                    ServicetaskService.add(model).then(function () {
                        tasklist.myTable.api.draw();
                    });
                });

            };
            /**编辑*/
            tasklist.editModel = function (id, name) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '编辑任务',
                    width: '600px',
                    templateUrl: 'controllers/task/edit/taskedit.html',
                    controller: 'TaskEditCtrl',
                    controllerAs: 'model',
                    resolve: {
                        model: function () {
                            return ServicetaskService.detail(id, name).then(function (data) {

                                return data;
                            });
                        }
                    }
                });
                result.then(function (model) {
                    ServicetaskService.editModel(model).then(function () {
                        tasklist.myTable.api.draw();
                    });
                });
            };

            /**
             * 任务详情
             * */
            tasklist.detail = function (id, name) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '任务详情',
                    width: '800px',
                    templateUrl: 'controllers/task/detail/taskdetail.html',
                    controller: 'TaskDetailCtrl',
                    controllerAs: 'model',
                    resolve: {
                        model: function () {
                            return ServicetaskService.detail(id, name).then(function (data) {
                                return data;
                            });
                        }
                    }
                });
            };

            /**
             * 触发
             * */
            tasklist.triggertask = function (id, name) {
                eayunModal.confirm('确定触发任务吗？').then(function () {
                    ServicetaskService.triggertask(id, name).then(function (data) {
                    });
                });
            };
            /**
             * 暂停
             * */
            tasklist.pausetask = function (id) {
                eayunModal.confirm('确定暂停任务吗？').then(function () {
                    ServicetaskService.pausetask(id).then(function (data) {
                        tasklist.myTable.api.draw();
                    });
                });
            };
            /*
             * 恢复
             * */
            tasklist.resumeTask = function (id) {
                eayunModal.confirm('确定恢复任务吗？').then(function () {
                    ServicetaskService.resumeTask(id).then(function (data) {
                        tasklist.myTable.api.draw();
                    });
                });
            };

            /*
             * 删除
             * */
            tasklist.deleteTask = function (id, name) {

                eayunModal.confirm('确定删除任务吗？').then(
                    function () {
                        ServicetaskService.deleteTask(id, name).then(function (data) {
                            tasklist.myTable.api.draw();
                        });
                    });
            }

            tasklist.doSearch = function () {
                tasklist.myTable.api.draw();
            };

            tasklist.history = function (triggerName, jobName) {
                $state.go('app.task.log', {triggerName: triggerName, jobName: jobName});
            };

            tasklist.data = function (value) {
                $state.go('app.task.data', {taskid: value});
            };

            tasklist.states = [{
                id: 'DELETED',
                name: 'DELETED'
            }, {
                id: 'COMPLETE',
                name: 'COMPLETE'
            }, {
                id: 'PAUSED',
                name: 'PAUSED'
            }, {
                id: 'PAUSED_BLOCKED',
                name: 'PAUSED_BLOCKED'
            }, {
                id: 'ERROR',
                name: 'ERROR'
            }, {
                id: 'BLOCKED',
                name: 'BLOCKED'
            }, {
                id: 'WAITING',
                name: 'WAITING'
            }, {
                id: 'ACQUIRED',
                name: 'ACQUIRED'
            }, {
                id: 'EXECUTING',
                name: 'EXECUTING'
            }];

            tasklist.changeState = function () {
                tasklist.myTable.api.draw();
            }
        }]);