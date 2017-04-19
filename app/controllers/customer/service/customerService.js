/**
 * Created by eayun on 2016/3/31.
 */
'use strict'

angular.module('eayun.customer')
    .service('CustomerService', ['$http', 'eayunModal', function ($http, eayunModal) {
        var customerService = {};

        customerService.customerOverview = function () {
            return $http.post('/api/ecmc/customer/customeroverview', {}, {$showLoading : true} ).then(function(response){
                return response.data;
            });

        };

        customerService.getCusWithAdminByid = function (_cusId) {
            return $http.post('/api/ecmc/customer/getcuswithadminbyid', {cusId: _cusId}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        };
        customerService.saveCustomerAndPrj=function(customer){
            return $http.post('/api/ecmc/project/createproject',customer, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }

        customerService.editCustomer=function(customer){

            return $http.post('/api/ecmc/customer/modifycustomer',customer, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.getDcList=function(){
            return $http.post('/api/ecmc/physical/datacenter/getlistdatacenter', {}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.getAllCustomerOrg=function(){
            return $http.post('/api/ecmc/customer/getallcustomerorg', {}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.getProjectPool = function(projectId) {
            return $http.post('/api/ecmc/project/getprojectpool', {projectId: projectId}, {$showLoading : true} ).then(function (response) {
                return response.data;
            });
        };
        customerService.checkCusOrg = function(cusOrg){
            if(cusOrg==""){
                return;
            }
            return $http.post('/api/ecmc/customer/checkcusorg',{cusOrg:cusOrg}).then(function(response){
                return response.data;
            });
        }
        customerService.checkCusPhone=function(cusPhone, cusId){
            return $http.post('/api/ecmc/customer/checkcusphone',{cusPhone:cusPhone,cusId:cusId}).then(function(response){
                return response.data;
            });
        }
        customerService.checkCusEmail = function(cusEmail, cusId){
            return $http.post('/api/ecmc/customer/checkcusemail',{cusEmail:cusEmail,cusId:cusId}).then(function(response){
                return response.data;
            });
        }
        customerService.checkCusAdmin = function(cusNumber, cusId){
            return $http.post('/api/ecmc/customer/checkcusadmin',{cusNumber:cusNumber,cusId:cusId}).then(function(response){
                return response.data;
            });
        }
        customerService.checkCusCpname = function(cusCpname, cusId){
            return $http.post('/api/ecmc/customer/checkcuscpname',{cusCpname:cusCpname,cusId:cusId}).then(function(response){
                return response.data;
            });
        }

        customerService.getPrjName=function(cusOrg){
            return $http.post('/api/ecmc/project/generateprojectname',{cusOrg:cusOrg}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.getPrjByPrjId = function(prjId){
            return $http.post('/api/ecmc/project/getprojectpool',{projectId:prjId}, {$showLoading : true} ).then(function(response){
                return response.data
            });
        }
        customerService.modifyProject=function(project){
            return $http.post('/api/ecmc/project/modifyproject',project, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.createProjectOnly=function(project){
            return $http.post('/api/ecmc/project/createprojectonly',project, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.getNetResource=function(project){
            return $http.post('/api/ecmc/project/getnetresource',project, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.getResourcesForExcel=function(project){
            return $http.post('/api/ecmc/project/getresourcesforexcel',project, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.createExcel=function(project){
            return $http.post('/api/ecmc/project/createexcel',project, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.resetCusAdminPass=function(cusId){
            return $http.post('/api/ecmc/customer/resetcusadminpass',{cusId:cusId}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        };
        customerService.deleteProject=function(prjId){
            return $http.post('/api/ecmc/project/deleteproject',{projectId:prjId}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        customerService.checkPrjInDc=function(dcId,cusId){
            return $http.post('/api/ecmc/project/hasprjbycusanddc',{cusId:cusId, dcId:dcId}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        //冻结客户
        customerService.blockCustomer=function(cusId){
            return $http.post('/api/ecmc/customer/blockCustomer',{cusId:cusId}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        //解冻客户
        customerService.unblockCustomer=function(cusId){
            return $http.post('/api/ecmc/customer/unblockCustomer',{cusId:cusId}, {$showLoading : true} ).then(function(response){
                return response.data;
            });
        }
        //查询账户金额
        customerService.getAccountBalance = function(cusId){
            return $http.post('/api/ecmc/costcenter/accountoverview/getaccountbalance',{cusId:cusId}, {$showLoading : true} ).then(function(response){
                return response.data.data.money;
            });
        }

        //修改信用额度
        customerService.modifyCreditLines = function(cusId, creditLines){
            return $http.post('/api/ecmc/customer/modifycreditlines',{cusId:cusId, creditLines: creditLines}).then(function(response){
                return response;
            });
        }

        //调整账户金额
        customerService.changeBalance = function(RecordBean){
            var record = {};
            record.cusId = RecordBean.cusId;
            record.exchangeMoney = RecordBean.exchangeMoney;
            record.monContract = RecordBean.monContract;
            if(RecordBean.inout === 'income'){//收入
                record.operType='4';
                record.incomeType='1';
                if(RecordBean.rechargeType === 'recharge'){//实际充值
                    record.ecmcRemark='实际充值';
                    record.ecscRemark='系统充值';
                }else if(RecordBean.rechargeType === 'throwin'){//额外赠送
                    record.ecmcRemark='额外赠送';
                    record.ecscRemark='系统赠送';
                }else{//收入其他
                    record.ecmcRemark='others';
                    record.ecscRemark='系统充值';
                    record.inputCause=RecordBean.inputCause;
                }
            }else{//支出
                record.operType='5';
                record.incomeType='2';
                record.ecscRemark='系统扣费';
                record.inputCause=RecordBean.inputCause;
            }

            return $http.post('/api/ecmc/customer/changeBalance',  record , {$showLoading : true} ).then(function(response){
                return response.data;
            });

        }

        customerService.getUncreatedCusNum=function(){
            return $http.post('/api/ecmc/customer/getuncreatedcusnum',{}).then(function(response){
                return response.data;
            });
        }

        customerService.getCusById = function (cusId) {
            return $http.post('/api/ecmc/customer/getcustomerbyid', {cusId: cusId}).then(function (response) {
                return response.data;
            });
        }
        //配额模板列表
        customerService.getQtTemplateList = function(){
            return $http.post('/api/ecmc/quota/template/getallquotatemplate', {}).then(function (response) {
                return response.data;
            });
        }

        //根据ID获取配额模板
        customerService.getQtTemplateById = function(qtId){
            return $http.post('/api/ecmc/quota/template/getquotatemplate', {qtId:qtId}).then(function (response) {
                return response.data;
            });
        }
        //获取api类别
        customerService.getApiType=function(){
            return $http.post('/api/ecmc/customer/getapitype',{}).then(function(response){
                return response.data;
            });
        }
        //根据api类别获取相应的action
        customerService.getRestrictRequestCount=function(cusId,version,apiType){
            return $http.post('/api/ecmc/customer/getrestrictrequestcount',{cusId:cusId,version:version,apiType:apiType}).then(function(response){
                return response.data;
            });
        }
        //修改请求次数限制
        customerService.updateApiRequestCount=function(actionsList,cusId,cusOrg){
            return $http.post('/api/ecmc/customer/updateapirequestcount',{actionsList:actionsList,cusId:cusId,cusOrg:cusOrg}).then(function(response){
                return response.data;
            });
        }
        return {
            customerOverview: customerService.customerOverview,
            getCustomerById: customerService.getCusWithAdminByid,
            getProjectPool: customerService.getProjectPool,
            resetCusAdminPass:customerService.resetCusAdminPass,
            editCustomer:customerService.editCustomer,
            getDcList:customerService.getDcList,
            checkCusOrg:customerService.checkCusOrg,
            checkCusPhone:customerService.checkCusPhone,
            checkCusEmail:customerService.checkCusEmail,
            checkCusAdmin:customerService.checkCusAdmin,
            checkCusCpname:customerService.checkCusCpname,
            getPrjName:customerService.getPrjName,
            getPrjByPrjId:customerService.getPrjByPrjId,
            deleteProject:customerService.deleteProject,
            getAllCustomerOrg:customerService.getAllCustomerOrg,
            saveCustomerAndPrj:customerService.saveCustomerAndPrj,
            modifyProject:customerService.modifyProject,
            createProjectOnly:customerService.createProjectOnly,
            getNetResource:customerService.getNetResource,
            getResourcesForExcel:customerService.getResourcesForExcel,
            createExcel:customerService.createExcel,
            checkPrjInDc:customerService.checkPrjInDc,
            blockCustomer:customerService.blockCustomer,
            unblockCustomer:customerService.unblockCustomer,
            getAccountBalance:customerService.getAccountBalance,
            changeBalance:customerService.changeBalance,
            modifyCreditLines:customerService.modifyCreditLines,
            getUncreatedCusNum:customerService.getUncreatedCusNum,
            getCusById:customerService.getCusById,
            getQtTemplateList:customerService.getQtTemplateList,
            getQtTemplateById:customerService.getQtTemplateById,
            getApiType:customerService.getApiType,
            getRestrictRequestCount:customerService.getRestrictRequestCount,
            updateApiRequestCount:customerService.updateApiRequestCount
        };
    }]);