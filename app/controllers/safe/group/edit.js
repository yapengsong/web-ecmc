/**
 * Created by ZH.F on 2016/4/14.
 */

angular.module('eayun.safe')
    .controller('SafeGroupSaveCtrl', ['$scope', 'safeGroup','SafeGroupService', 'eayunModal',
        function ($scope, safeGroup, SafeGroupService, eayunModal) {
            var vm = this;
            vm.safeGroup = safeGroup;

            vm.safeGroup.dcId = '';
            vm.safeGroup.prjId = '';
            vm.dcList = {};
            vm.prjList = {};

            SafeGroupService.getDcResourceList().then(function (response) {
                vm.dcList = response.data;
                //vm.safeGroup.dcId = vm.dcList[0].id;
                //vm.getProjectListByDcId(vm.dcList[0].id);
            });

            vm.getProjectListByDcId = function(_dcId){
                SafeGroupService.getProjectListByDcId(_dcId).then(function(response){
                    vm.prjList = response.data;
                    vm.safeGroup.prjId = 'null';
                });
            };



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
                promise = SafeGroupService.createSecurityGroup(vm.safeGroup);
                promise.then(function (data) {
                    $scope.ok(data);
                }, function (data) {

                });
            };
        }]);