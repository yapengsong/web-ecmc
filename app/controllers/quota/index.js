'use strict'

angular.module('eayun.quotatemp', [])
    .controller('QuotaTemplateCtrl',['QuotaTemplateService','$state', 'eayunModal', 'SysCode', 'toast',function(QuotaTemplateService, $state, eayunModal, SysCode, toast){
        var vm = this;

        vm.templateName = '';
        vm.options = {
            placeholder: "请输入模板名称搜索",
            searchFn: function () {
                vm.table.api.draw();
            }
        };
        vm.table = {
            source: '/api/ecmc/quota/template/getquotatemplatelist',
            api: {},
            getParams: function () {
                return {
                    templateName: vm.templateName
                };
            }
        };
        vm.change = function(){
            vm.table.api.draw();
        };
        vm.createTemplate = function () {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建配额模板',
                width: '710px',
                templateUrl: 'controllers/quota/template.html',
                controller: 'TemplateSaveCtrl',
                controllerAs: 'save',
                resolve: {
                    template:{}
                }
            })
            result.then(function (template) {
                QuotaTemplateService.createTemplate(template).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("配额模板创建失败");
                            return;
                        case SysCode.success:
                            toast.success("配额模板创建成功");
                            vm.table.api.draw();
                            return;
                        default:
                            vm.table.api.draw();
                            return;
                    }
                });
            });
        };

        vm.edit = function (_template) {
            var result = eayunModal.dialog({
                showBtn: false,
                title: '修改配额模板',
                width: '710px',
                templateUrl: 'controllers/quota/template.html',
                controller: 'TemplateSaveCtrl',
                controllerAs: 'save',
                resolve: {
                    template: function(){
                        return _template;
                    }
                }
            })
            result.then(function (template) {
                QuotaTemplateService.updateTemplate(template).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("编辑配额模板失败");
                            return;
                        case SysCode.success:
                            toast.success("编辑配额模板成功");
                            vm.table.api.draw();
                            return;
                        default:
                            vm.table.api.draw();
                            return;
                    }
                });
            });
        };
        vm.del = function(_id, _qtName){
            var result = eayunModal.confirm("确定删除该模板？").then(function(){
                QuotaTemplateService.deleteTemplate(_id).then(function(response){
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error("删除配额模板失败");
                            return;
                        case SysCode.success:
                            toast.success("删除配额模板成功");
                            vm.table.api.draw();
                            return;
                        default:
                            vm.table.api.draw();
                            return;
                    }
                });
            });
        };
        vm.detail = function(_template){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '配额模板详情',
                width: '710px',
                templateUrl: 'controllers/quota/detail.html',
                controller: 'TemplateSaveCtrl',
                controllerAs: 'detail',
                resolve: {
                    template: function(){
                        return _template;
                    }
                }
            })
        }
    }]);