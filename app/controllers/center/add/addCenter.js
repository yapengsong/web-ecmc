/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.center')
    .controller('CenterAddCtrl', ['eayunModal','CenterDataService','SysCode','$scope','toast', function (eayunModal,CenterDataService,SysCode,$scope,toast) {
        var vm = this;

        vm.model={};
        /**初始为第一页*/
        vm.pagenumber=1;
        /**上一步*/
        vm.goUp= function () {
            vm.pagenumber=CenterDataService.goUp(vm.pagenumber);

        };
        /**下一步*/
        vm.goDown= function () {
            vm.pagenumber=CenterDataService.goDown(vm.pagenumber);
        };
        /**校验*/
         vm.checkDcName= function (value) {
            return CenterDataService.nameCheck(value);
        };
        /**校验Region标识*/
        vm.checkApiDcCode= function (value) {
            return CenterDataService.apiDcCodeCheck({"apiDcCode":value});
        };
        vm.checkAddress= function (value) {
                return CenterDataService.IpCheck(value);
        };
        vm.ok=function(model){
            CenterDataService.addCheck(model).then(function (data) {
                if(data.data){
                    if(data.respCode==SysCode.success){
                        toast.success('创建数据中心'+model.name+'成功!');
                    }else{
                        toast.error('添加数据中心失败!');
                    }
                    $scope.ok();
                }else{
                    eayunModal.info(data.message);
                }
            });
        };


    }]);