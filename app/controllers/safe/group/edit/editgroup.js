/**
 * Created by ZH.F on 2016/4/14.
 */

angular.module('eayun.safe')
    .controller('SafeGroupEditCtrl', ['$scope', 'safeGroup','SafeGroupService', 'eayunModal',
        function ($scope, safeGroup, SafeGroupService, eayunModal) {
            var vm = this;
            vm.safeGroup = safeGroup;
            vm.dcList = {};
            vm.prjList = {};

            vm.getProjectListByDcId = function(_dcId){
                SafeGroupService.getProjectListByDcId(_dcId).then(function(response){
                    vm.prjList = response.data;
                    //edit用于切换项目后，默认将项目重新赋值，根据新项目查询名称唯一性；
                   /* if(null!= vm.safeGroup.prjId){
                        vm.checkSecurityGroupName(vm.safeGroup);
                    }*/
                });
            };

            SafeGroupService.getDcResourceList().then(function (response) {
                vm.dcList = response.data;
                vm.getProjectListByDcId(vm.safeGroup.dcId);
            });

            vm.checkSecurityGroupName = function (){
                SafeGroupService.checkSecurityGroupName(vm.safeGroup).then(function(response){
                    vm.checkName = response.data;
                });
            };
            //创建页面切换项目校验是否安全组重名
            vm.checkGroupName = function(prjId,sgName){
                SafeGroupService.checkGroupName(prjId,sgName).then(function(response){
                    vm.checkName = response.data;
                });
            };

            $scope.commit = function () {
                var promise;
                promise = SafeGroupService.editSecrityGroup(vm.safeGroup);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function (data) {
                    //eayunModal.error("保存失败",500);
                });
            };
        }]);