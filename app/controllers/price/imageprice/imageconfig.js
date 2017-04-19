/**
 * Created by ZHL on 2016/4/5.
 */
'use strict';
angular.module('eayun.price')
    .controller('ImageConfigCtrl', ['$scope','SysCode','eayunModal','toast','item','payType','priceService',
        function ($scope,SysCode,eayunModal,toast,item,payType,priceService) {
            var vm = this;
            vm.item = item;
            vm.params = {
                dcId : vm.item.dcId,
                payType : payType,
                resourcesType : 'IMAGE',
                billingUnit : vm.item.imageId
            };
            vm.addItem= {
                dcId : vm.item.dcId,
                payType : payType,
                resourcesType : 'IMAGE',
                factorUnit : vm.item.imageId,
                unitName : vm.item.imageName
            };
            vm.addItem.unitName = vm.item.imageName;
            vm.getList = function(){
                vm.isAdd = false;
                vm.isEdit = false;
                priceService.getPricesByPayType(vm.params).then(function (data) {
                    if(data.respCode == SysCode.success){
                        vm.priceList = data.data;
                    }
                });
            };
            vm.getList();
            //添加按钮
            vm.add = function(){
                vm.start = '';
                vm.end = '';
                vm.price = '';
                vm.isCheck = false;
                vm.isAdd = true;
                vm.noAddRange = true;
                vm.noAddEndRange = true;
                vm.noAddPrice = true;
            };
            //确定添加
            vm.addPrice = function(){
                vm.addItem.startNum = vm.start;
                if(vm.isCheck){
                    vm.addItem.endNum = '-1';
                }else{
                    vm.addItem.endNum = vm.end;
                }
                vm.addItem.price = vm.price;
                if(vm.checkInput(vm.start,vm.end,vm.isCheck,vm.price)){
                    priceService.addFactorPrice(vm.addItem).then(function (data) {
                        if(data.respCode == SysCode.success){
                            toast.success('计费区间添加成功');
                        }
                        vm.getList();
                        vm.isAdd = false;
                    });
                }
            };
            //取消添加操作
            vm.cancelAdd = function () {
                vm.isAdd = false;
            };
            //删除计费因子价格
            vm.deletePrice = function (id) {
                eayunModal.confirm('确定要删除计费区间吗？').then(function () {
                    priceService.deleteFactorPrice({'id':id,'factorName':vm.item.imageName,'payType':payType,'imageId':vm.item.imageId}).then(function (data) {
                        if(data.respCode == SysCode.success){
                            toast.success('计费区间删除成功');
                        }
                        vm.getList();
                    });
                });
            };
            vm.editItem = {};
            //编辑按钮
            vm.edit = function (priceItem) {
                vm.isEdit = true;
                vm.noEdit = false;
                vm.noEditRange = false;
                vm.noEditEndRange = false;
                vm.noEditPrice = false;
                vm.editParam = {
                    start : priceItem.startNum,
                    end : '-1'==priceItem.endNum?'':priceItem.endNum,
                    price : priceItem.price,
                    isCheck : '-1'==priceItem.endNum?true:false
                };
                vm.editItem=angular.copy(priceItem, {});
                priceItem.haveShow = true;
            };
            //确认编辑
            vm.editPrice = function (priceItem) {
                vm.editItem.startNum = vm.editParam.start;
                if(vm.editParam.isCheck){
                    vm.editItem.endNum = '-1';
                }else{
                    vm.editItem.endNum = vm.editParam.end;
                }
                vm.editItem.price = vm.editParam.price;
                vm.editItem.unitName = vm.item.imageName;
                if(vm.checkInput(vm.editParam.start,vm.editParam.end,vm.editParam.isCheck,vm.editParam.price)){
                    priceService.editFactorPrice(vm.editItem).then(function (data) {
                        if(data.respCode == SysCode.success){
                            toast.success('修改计费区间成功');
                        }
                        vm.getList();
                        vm.isEdit = false;
                        priceItem.haveShow = false;
                    });
                }
            };
            //取消编辑
            vm.cancelEdit = function (priceItem) {
                vm.isEdit = false;
                priceItem.haveShow = false;
            };
            /**确认后校验输入框*/
            vm.checkInput = function(start,end,check,price){
                if(null === start || start === ''){
                    eayunModal.error("请输入合法的计费区间");
                    return false;
                }
                if((null === end || end === '') && !check){
                    eayunModal.error("请输入合法的计费区间");
                    return false;
                }
                if((Number(start) > Number(end)) && !check){
                    eayunModal.error("请输入合法的计费区间");
                    return false;
                }
                if(null === price || price === ''){
                    eayunModal.error("请输入合法的计费价格");
                    return false;
                }
                return true;
            };
            /***************添加校验***********************/
            /*校验区间，只能为0或正整数*/
            vm.inputCheckNum = function(){
                vm.inputFormat=/^(0|[1-9][0-9]*)$/;
                if(null === vm.start || vm.start === ''){
                    vm.noAddRange = true;
                }else{
                    if(vm.inputFormat.test(vm.start)){
                        vm.noAddRange = false;
                    }else{
                        vm.noAddRange = true;
                    }
                }
            };
            /*校验区间结束值*/
            vm.inputCheckEndNum = function(){
                vm.inputFormat=/^(0|[1-9][0-9]*)$/;
                if(vm.isCheck){
                    vm.noAddEndRange = false;
                }else{
                    if(null === vm.end || vm.end === ''){
                        vm.noAddEndRange = true;
                    }else{
                        if(vm.inputFormat.test(vm.end)){
                            vm.noAddEndRange = false;
                        }else{
                            vm.noAddEndRange = true;
                        }
                    }
                }
            };
            /*无上限选项*/
            vm.doAddCheck = function(){
                if(vm.isCheck){
                    vm.noAddEndRange = false;
                }else{
                    vm.inputCheckEndNum(vm.end,vm.end);
                }
            };
            /*校验价钱，只能为0或正实数，且最多只能有三位小数*/
            vm.inputCheckPrice = function(oldVal,newVal){
                vm.inputPrice=/^\d*\.?\d{1,3}$/;
                vm.firstZero=/^0[0-9]$/;
                vm.checkPoint=/^\d*\.?\d{1,4}$/;
                if((null === newVal || newVal === '') && (null != oldVal || oldVal != '')){
                    vm.noAddPrice = true;
                }else{
                    if(vm.firstZero.test(newVal)){
                        vm.noAddPrice = true;
                    }else{
                        if(vm.inputPrice.test(newVal)){
                            vm.noAddPrice = false;
                        }else{
                            if(vm.checkPoint.test(newVal)){
                                vm.noAddPrice = false;
                                return oldVal;
                            }
                            vm.noAddPrice = true;
                        }
                    }
                }
                return newVal;
            };
            /*******************编辑校验********************/
            /*校验区间，只能为0或正整数*/
            vm.inputCheckEditNum = function(){
                vm.inputFormat=/^(0|[1-9][0-9]*)$/;
                if(null === vm.editParam.start || vm.editParam.start === ''){
                    vm.noEditRange = true;
                }else{
                    if(vm.inputFormat.test(vm.editParam.start)){
                        vm.noEditRange = false;
                    }else{
                        vm.noEditRange = true;
                    }
                }
            };
            /*校验区间结束值*/
            vm.inputCheckEndEditNum = function(){
                vm.inputFormat=/^(0|[1-9][0-9]*)$/;
                if(vm.editParam.isCheck){
                    vm.noEditEndRange = false;
                }else{
                    if(null === vm.editParam.end || vm.editParam.end === ''){
                        vm.noEditEndRange = true;
                    }else{
                        if(vm.inputFormat.test(vm.editParam.end)){
                            vm.noEditEndRange = false;
                        }else{
                            vm.noEditEndRange = true;
                        }
                    }
                }
            };
            /*校验价格*/
            vm.inputCheckEditPrice = function(oldVal,newVal){
                vm.inputPrice=/^\d*\.?\d{1,3}$/;
                vm.firstZero=/^0[0-9]$/;
                vm.checkPoint=/^\d*\.?\d{1,4}$/;
                if((null === newVal || newVal === '') && (null != oldVal || oldVal != '')){
                    vm.noEditPrice = true;
                }else{
                    if(vm.firstZero.test(newVal)){
                        vm.noEditPrice = true;
                    }else{
                        if(vm.inputPrice.test(newVal)){
                            vm.noEditPrice = false;
                        }else{
                            if(vm.checkPoint.test(newVal)){
                                vm.noEditPrice = false;
                                return oldVal;
                            }
                            vm.noEditPrice = true;
                        }
                    }
                }
                return newVal;
            };
            vm.doEditCheck = function(){
                if(vm.editParam.isCheck){
                    vm.noEditEndRange = false;
                }else{
                    vm.inputCheckEndEditNum(vm.editParam.end,vm.editParam.end);
                }
            };
            $scope.commit = function () {
                $scope.ok();
            };
        }]);