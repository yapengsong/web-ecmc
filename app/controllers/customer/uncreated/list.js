/**
 * Created by Administrator on 2016/8/22 0022.
 */
angular.module('eayun.customer')
    .controller('UncreatedCusCtrl', ['$state', 'eayunModal', 'CustomerService', 'toast', 'SysCode', function ($state, eayunModal, CustomerService, toast, SysCode) {
        var that = this;

        that.cusTable = {
            source: '/api/ecmc/customer/getuncreatedcuslist',
            api: {},
            getParams: {}
        };

        that.createCusAndPrj = function(cusId){
            var result = eayunModal.dialog({
                showBtn: false,
                title: '创建客户及项目',
                width: '710px',
                templateUrl: 'controllers/customer/manage/add/add.html',
                controller: 'CustomerManageAddCtrl',
                controllerAs:'add',
                resolve: {
                    customer:function(){
                        return CustomerService.getCusById(cusId).then(function(response){
                            return response.data;
                        });
                    },
                    dcList:function(){
                        return CustomerService.getDcList().then(function(response){
                            return response.data;
                        });
                    },
                    cusOrgList:function(){
                        return CustomerService.getAllCustomerOrg().then(function(response){
                            return response.data;
                        })
                    }
                }
            });
            result.then(function (customerInfo) {
                CustomerService.saveCustomerAndPrj(customerInfo).then(function(response){
                    if (response.respCode == SysCode.success) {
                        toast.success('创建客户'+customerInfo.cusOrg+'及项目成功!');
                    } else {
                        toast.error('创建客户'+customerInfo.cusOrg+'及项目失败!');
                    }
                    $state.go("app.customer");
                });
            });

        }
    }])