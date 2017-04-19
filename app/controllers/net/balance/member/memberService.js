/**
 * Created by liyanchao on 2016/4/19.
 */

angular.module('eayun.net')
    .service('NetMemberService', ['$http', '$q', 'SysCode', '$state', function ($http,$q, SysCode, $state) {
        var member = this;
        /**获取数据中心**/
        member.getDcResourceList = function () {
            return $http.post('/api/ecmc/overview/getalldclist');
        };

        /**获取项目**/
        member.getProjectListByDcId = function (dcId) {
            return $http.post('/api/ecmc/overview/getprojectlistbydcid', {dcId: dcId});
        };
        /**根据项目查找资源池**/
        member.getPoolListByPrjId = function (member) {

            return $http.post('/api/ecmc/virtual/loadbalance/pool/getpoollistbyprjid', {dcId:member.dcId,prjId:member.prjId});

        };
        /**根据资源池查找拥有该子网的VM**/
        member.getVmListBySubnetId = function(subnetId){
            return $http.post('/api/ecmc/virtual/loadbalance/member/getmemeberlistbysubnet',{subnetId:subnetId});
        };

        /**编辑成员**/
        member.editMember = function(member){
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/loadbalance/member/updatemember',{poolId:member.poolId,weight:member.memberWeight,adminStateUp:'1',memberId:member.memberId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                    default:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        member.addMember = function(_member){
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/loadbalance/member/createmember',_member).then(function (response) {
                console.info(response);
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                    default:
                        deferred.reject();
                }
            });
            return deferred.promise;
        };

        /**删除成员**/
        member.deleteMember = function(member){

            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/loadbalance/member/deletemember',{memberId:member.memberId}).then(function (response) {
                switch (response.data.respCode) {
                    case SysCode.error:
                        deferred.reject();
                    case  SysCode.success:
                        deferred.resolve(response.data.data);
                    default:
                        deferred.reject();
                }
            });
            return deferred.promise;

        };













    }]);
