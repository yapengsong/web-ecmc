/**
 * Created by eayun on 2016/4/7.
 */
'use strict'

angular.module('eayun.message')
    .controller('MessageAddCtrl', ['$scope', 'MessageService', 'HomeCommonService','eayunModal', function ($scope, MessageService, HomeCommonService,eayunModal) {
        var vm = this;
        var today;

        vm.message = {
            sendPerson: '易云公有云运营团队'
        };
        HomeCommonService.getFullTime().then(function (time) {
            vm.now = time;
        });
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




        $scope.commit = function () {
            $scope.ok(vm.message);
        };



        vm.cusList=function(selectlist){

            var result = eayunModal.dialog({
                showBtn: false,
                title: '添加收件公司',
                width: '1000px',
                templateUrl: 'controllers/message/add/addcusList.html',
                controller: 'addcusListCtrl',
                controllerAs: 'addcus',
                resolve: {
                    addcusList: function () {
                   return      MessageService.getReceiveList().then(function (data) {
                            vm.sendPersonList = data.sendPerson;
                            data.customer.unshift({'cusId': 'ALL', 'cusCpname': '全部公司'});

                            return  data.customer;
                        });

                    },
                    selectistolist:function(){
                        return selectlist;
                    }
                }

            });   result.then(function (resultData) {
                vm.customerList=resultData;
                vm.message.cusLists='';
                for(var i=0;i<vm.customerList.length;i++){
                    vm.message.cusId+=vm.customerList[i].cusId+',';
                    if(i!=vm.customerList.length+1){
                        vm.message.cusLists += vm.customerList[i].cusCpname+',';
                    }else{
                        vm.message.cusLists += vm.customerList[i].cusCpname;
                    }

                }


            })




        };
    }]);