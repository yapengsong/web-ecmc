/**
 * Created by eayun on 2016/4/13.
 */
'use strict'

angular.module('eayun.message')
    .controller('MessageEditCtrl', ['$scope', 'message', 'MessageService', 'HomeCommonService','eayunModal','cusLists', function ($scope, _message, MessageService, HomeCommonService,eayunModal,cusLists) {
        var vm = this;
        vm.cusLists=cusLists;
        vm.cusListsId=_message.cusId;
        vm.cusListobj =[];
        vm.numfag=0;
        var today;
        vm.message = angular.copy(_message, {});
        HomeCommonService.getFullTime().then(function (time) {
            vm.now = time;
        });
        vm.endDate = vm.message.sendDate + 2592000000;
        vm.hasNotSended = true;

        vm.checkSendDate = function () {
            HomeCommonService.getFullTime().then(function (time) {
                today = time;
                vm.hasNotSended = today < vm.message.sendDate;
            });
        };

        vm.getEndDate = function () {
            vm.endDate = vm.message.sendDate.getTime() + 2592000000;
        };

        MessageService.getReceiveList().then(function (data) {
            vm.sendPersonList = data.sendPerson;
            data.customer.unshift({'cusId': 'ALL', 'cusCpname': '全部公司'});
            vm.customerList = data.customer;

            vm.cusListsId = vm.cusListsId.substring(0,vm.cusListsId.length-1);

            vm.cuss = vm.cusListsId.split(",");

            for (var i = 0; i < data.customer.length; i++) {
                for (var j = 0; j < vm.cuss.length; j++) {
                    if (vm.cuss[j] == data.customer[i].cusId) {

                        vm.cusListobj.push(data.customer[i]);
                        data.customer.splice(i, 1);
                    }
                }
            }
        });
        vm.cusList=function(selectlist){

            vm.numfag= vm.numfag+1;

            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加收件公司',
                width: '1000px',
                templateUrl: 'controllers/message/edit/addcusList.html',
                controller: 'editcusListCtrl',
                controllerAs: 'addcus',
                resolve: {
                    addcusList: function () {
                        return  vm.customerList;
                    },
                    selectistolist:function(){
                        return vm.cusListobj;
                    },vmlist:function(){
                        return vm;
                    }
                }

            });   result.then(function (resultData) {

                vm.cusListobj=resultData;
                vm.cusLists='';
                vm.message.cusId='';
                vm.message.cusCpname='';
                vm.message.cusName='';
                for(var i=0;i<vm.cusListobj.length;i++){
                    vm.message.cusId+=vm.cusListobj[i].cusId+',';
                    vm.message.cusName+=vm.cusListobj[i].cusName+',';

                    if(i!=vm.cusListobj.length+1){
                        vm.cusLists += vm.cusListobj[i].cusCpname+',';

                    }else{
                        vm.cusLists += vm.cusListobj[i].cusCpname;
                    }


                }

                vm.message.cusCpname= vm.cusLists;
            })




        };



        $scope.commit = function () {
            $scope.ok(vm.message);
        }
    }]);