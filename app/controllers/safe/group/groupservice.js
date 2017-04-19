/**
 * Created by eayun on 2016/4/14.
 */
'use strict'

angular.module('eayun.safe')
    .service('SafeGroupService', ['$http', '$q', 'SysCode', '$state', function ($http, $q, SysCode, $state) {
        var group = this;

        group.createSecurityGroup = function (model) {
            //Tips 所有此类的调用方式，均要用var deferred = ...进行
            return $http.post('/api/ecmc/virtual/securitygroup/createsecuritygroup', model || {}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        group.editSecrityGroup = function (model) {
            group.sg = model;
            return $http.post('/api/ecmc/virtual/securitygroup/updatesecuritygroup', model || {}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(group.sg);
                    default:
                        deferred.reject();
                }
                return response;
            });

        };

        group.getProjectListByDcId = function (_dcId) {
            return $http.post('/api/ecmc/overview/getprojectlistbydcid', {dcId: _dcId});
        };

        group.checkSecurityGroupName = function (_safeGroup) {
            return $http.post('/api/ecmc/virtual/securitygroup/checksecuritygroupname', {
                dcId: _safeGroup.dcId || '',
                prjId: _safeGroup.prjId || '',
                sgName: _safeGroup.sgName || '',
                sgId: _safeGroup.sgId || ''
            });
        };
        //创建页面切换项目校验是否安全组重名
        group.checkGroupName = function(prjId,sgName){
            return $http.post('/api/ecmc/virtual/securitygroup/checksecuritygroupname', {
                prjId: prjId || '',
                sgName: sgName || ''

            });
        };

        group.goSafeGroupDetail = function (_id,cusOrg) {

            $state.go('app.safe.groupDetail', {safeGroupId: _id,cusOrg:cusOrg});
        };

        group.getSafeGroupById = function (_id) {
            return $http.post('/api/ecmc/virtual/securitygroup/getsecuritygroupbyid',{sgId: _id});
        };

        group.getDcResourceList = function () {
            return $http.post('/api/ecmc/overview/getalldclist');
        };

        group.deleteSafeGroup = function(_sg){
            return $http.post('/api/ecmc/virtual/securitygroup/deletesecuritygroup', {id:_sg.sgId, datacenterId:_sg.dcId}).then(function (response) {

                return response;
            });
        };

        group.createSecurityGroupRule = function(_sgRule){
            return $http.post('/api/ecmc/virtual/securitygrouprule/createrule', _sgRule || {}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });
        };

        group.getSecurityGroupsByIds = function(_dcId, _prjId){
            return $http.post('/api/ecmc/virtual/securitygroup/listallgroups',{datacenterId: _dcId, projectId:_prjId});
        };

        group.deleteGroupRule = function(_sgRule){
            return $http.post('/api/ecmc/virtual/securitygrouprule/deleterulebyid',{id:_sgRule.sgrId, datacenterId:_sgRule.dcId}).then(function (response) {
                var deferred = $q.defer();
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve();
                    default:
                        deferred.reject();
                }
                return deferred.promise;
            });

        };

        group.getaddcloudhostlist=function(sgid,prjid,sgname,cus){
            return $http.post('/api/ecmc/virtual/securitygrouprule/getaddcloudhostlist',{sgId: sgid, projectId:prjid,sgname:sgname,cusorg:cus});
        };

        group.addcloudhostlistsg=function(model){

            return $http.post('/api/ecmc/virtual/securitygrouprule/securitygroupaddcloudHost',{cloudhostlist:model.cloudhostlist}).then(function(response){

                return response.data;

            });
        };

        group.deletedcloudhos=function(sgId,vmid,prjid,dcid,sgname,vmname){

            return $http.post('/api/ecmc/virtual/securitygrouprule/securityGroupRemoveCloudHost',{sgId:sgId,vmid:vmid,prjid:prjid,dcid:dcid,sgname:sgname,vmname:vmname}).then(function(response){

                return response.data;

            });
        };



    }]);