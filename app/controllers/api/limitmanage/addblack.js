/**
 * Created by Administrator on 2016/4/1.
 */
angular.module('eayun.api')
    .controller('AddBlackCtrl', ['eayunModal','ApiLimitService','$scope','cusOrgList', function (eayunModal,ApiLimitService,$scope,cusOrgList) {
        var vm = this;
        vm.model={};

        /**更改下拉框客户名称*/
        vm.noCus = false;//用于客户的提交按钮置灰
        vm.cusOrgList = cusOrgList;

        //选择单选按钮
        vm.model.apiType = 'blackCus';

        vm.checkType = function(){
            console.info('value='+vm.model.apiType);
            if(vm.model.apiType == 'blackCus'){
                vm.model.ipPartOne = '';//切换到客户时 清空ip栏的数据 下同
                vm.model.ipPartTwo = '';
                vm.model.ipPartThree = '';
                vm.model.ipPartFour = '';

                vm.cidrError = false;
                vm.a1Error = false;//为了从ip切换到cus后 ip输入框红色消失
                vm.a2Error = false;//为了从ip切换到cus后 ip输入框红色消失
                vm.a3Error = false;//为了从ip切换到cus后 ip输入框红色消失
                vm.a4Error = false;//为了从ip切换到cus后 ip输入框红色消失
                console.info('vm.model.ipPartOne='+vm.model.ipPartOne);
                vm.ipCheck = false;//判断IP地址是否重复
            }else if(vm.model.apiType == 'blackIp'){
                vm.model.cusOrg = null;
                //切换为Ip的时候 校验是否存在不合法的ip地址 并提示
                if(null != vm.model.ipPartOne && vm.model.ipPartOne!= ''){
                    vm.checkTypeCidr('a1',null);
                }
                if(null != vm.model.ipPartTwo && vm.model.ipPartTwo!= ''){
                    vm.checkTypeCidr('a2',null);
                }
                if(null != vm.model.ipPartThree && vm.model.ipPartThree!= ''){
                    vm.checkTypeCidr('a3',null);
                }
                if(null != vm.model.ipPartFour  && vm.model.ipPartFour!= ''){
                    vm.checkTypeCidr('a4',null);
                }
            }

        }
        //增加黑名单IP 校验IP地址
        vm.cidrError = false;
        vm.checkTypeCidr = function(position,fromFunc) {
            if (position == '' || position == null) {
                vm.a1Error = false;
                vm.a2Error = false;
                vm.a3Error = false;
                vm.a4Error = false;
                return;
            };
            if (position == 'a1') {
                vm.a1Error = checkCidr0_255(vm.model.ipPartOne, fromFunc);
            } else if (position == 'a2') {
                vm.a2Error = checkCidr0_255(vm.model.ipPartTwo, fromFunc);
            } else if (position == 'a3') {
                vm.a3Error = checkCidr0_255(vm.model.ipPartThree, fromFunc);
            } else if (position == 'a4') {
                vm.a4Error = checkCidr0_255(vm.model.ipPartFour, fromFunc);
            }

            if (vm.a1Error || vm.a2Error || vm.a3Error || vm.a4Error ) {
                vm.cidrError = true;
                vm.ipCheck = false;
            } else {
                vm.cidrError = false;
                vm.checkIpExist();
            }

        };
        //判断IP地址是否重复
        vm.ipCheck = false;
        vm.checkIpExist = function(){
            if(vm.model.ipPartOne != null &&vm.model.ipPartOne != null && vm.model.ipPartThree != null && vm.model.ipPartFour != null){
                if(!vm.cidrError){
                    //校验IP重复
                    ApiLimitService.checkBlackIpExist(vm.model).then(function (data) {
                        if(data.data.respCode == '000000'){
                           console.info('有相同的IP地址存在');
                            vm.ipCheck = true;
                        }else{
                            vm.ipCheck = false;
                            console.info('IP不存在');
                        }
                    });
                }else{
                    vm.ipCheck = false;
                }
            }
        };

        var regx=/^(0|[1-9]\d*)$/;
        vm.sourrange = "IP地址每个文本框规范必须是数字整型，范围：0-255。";
        function checkCidr0_255(val,fromFunc) {
            console.info('value为'+val  +'   ；鼠标事件为'+fromFunc);
            if (val >= 0 && val <= 255 && regx.test(val)) {
                return false;
            } else {
                return true;
            }
        };

        $scope.commit = function (){
            $scope.ok(vm.model);
        };



    }]);