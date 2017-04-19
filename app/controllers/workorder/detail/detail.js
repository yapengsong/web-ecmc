/**
 * Created by eayun on 2016/3/25.
 */
'use strict'

angular.module('eayun.workorder')
    .controller('WorkorderDetailCtrl', ['$stateParams', 'toast', 'SysCode', 'CustomerService', 'WorkorderService',
        'eayunModal', 'loginInfo', '$timeout', 'workorder','$state',
        function ($stateParams, toast, SysCode, CustomerService, WorkorderService, eayunModal, loginInfo, $timeout, workorder,$state) {
            var vm = this;
            vm.workorder = workorder;
            vm.queryWorkorderList = {};
            vm.showReply=false;
            vm.showSelect=true;
            loginInfo.getSessionInfo().then(function (session) {
                vm.user = session.user;
                vm.selectOrReply();
            });
            vm.selectOrReply = function(){
                if(loginInfo.hasUIPermission("workorder_cancel")){//客服
                    if(workorder.workCreRole=="2"){//ecsc创建
                        vm.showSelect=false;
                        vm.showReply=true;
                    }else if(workorder.workCreUser!=vm.user.id){
                        vm.showSelect=true;
                        vm.showReply=true;
                    }
                }else if(loginInfo.hasUIPermission("workorder_find_special")){//商务
                    if((workorder.workHeadUser !=vm.user.id && !loginInfo.hasUIPermission("workorder_find_all")) || workorder.workFalg=='0'){//非管理员，也不是负责人
                        vm.showSelect=false;
                        vm.showReply=true;
                    }
                }else{
                    if(workorder.workFalg=='0' || (workorder.workHeadUser !=vm.user.id && !loginInfo.hasUIPermission("workorder_find_all"))){
                        vm.showSelect=false;
                        vm.showReply=true;
                    }
                }
                if(workorder.workFalg=='3'|| workorder.workFalg=='4'){
                    vm.showSelect=false;
                    vm.showReply=true;
                }
            }
            vm.changeShowReply=function(){
                //vm.getWorkFlag();
                vm.showReply=false;
                //清空回复内容
                vm.workorder.opinionContent = null;
                if(loginInfo.hasUIPermission("workorder_cancel") &&(vm.workOrderStatus!='4' && vm.workOrderStatus!='3' && vm.user.id!=workorder.workCreUser)){
                    vm.showReply=true;
                }
                if(loginInfo.hasUIPermission("workorder_cancel") && vm.workOrderStatus == '1' && vm.workorder.workFalg=='2'){
                    vm.showReply = false;
                }
            }
            //工单详情
            if ('3' == vm.workorder.workFalg || '4' == vm.workorder.workFalg || '5' == vm.workorder.workFalg) {
                vm.isShow = false;
            } else if ('0' == vm.workorder.workFalg) {
                vm.isShow = true;
            } else {
                vm.isShow = true;
            }
            vm.workOrderStatus = workorder.workFalg;
            //获取未完成状态
            vm.getWorkFlag=function(){
                if (loginInfo.hasUIPermission("workorder_cancel")) {//客服
                    WorkorderService.getWorkFlagList(vm.workorder.workFalg).then(function (response) {
                        vm.queryWorkorderList.workFalgList=[];
                        var data = response.data;
                        for(var i=0;i<data.length;i++){
                            if((workorder.workFalg=='0' || workorder.workFalg=='1') && data[i].nodeId>=vm.workOrderStatus && data[i].nodeId!='3'){
                                vm.queryWorkorderList.workFalgList.push(data[i]);
                            }else if(workorder.workFalg=='2' && (data[i].nodeId>=vm.workOrderStatus || data[i].nodeId=='1')){
                                vm.queryWorkorderList.workFalgList.push(data[i]);
                            }
                        }
                    });
                } else{
                    WorkorderService.getNoDoneFlaglist().then(function (response) {
                        vm.queryWorkorderList.workFalgList=[];
                        var data = response.data;
                        for(var i=0;i<data.length;i++){
                            if(data[i].nodeId >= vm.workOrderStatus){
                                vm.queryWorkorderList.workFalgList.push(data[i]);
                            }
                        }
                    });
                };
            }
            vm.getWorkFlag();
            if(workorder.workType=="0007001003001"){
                //得到项目信息
                CustomerService.getPrjByPrjId(workorder.prjId).then(function(response){
                    vm.prj=response.data;
                });
            }
            //根据工单ID获取该工单的回复
            vm.getWorkOpinionList=function(){
                WorkorderService.getWorkOpinionsByWorkId($stateParams.workId).then(function (response) {
                    vm.WorkOpinions = response.data;
                    var obj = vm.WorkOpinions[0].workQuota;
                    if (vm.WorkOpinions.length > 1 && obj == null) {
                        obj = vm.WorkOpinions[1].workQuota;
                    }

                    if (obj != null) {
                        var names = [];

                        for (var name in obj) {
                            if (name != "prjId" && name != "quotaId" && name != "workId" && obj[name] != 0) {
                                names.push(name); //有多少个配额有值。
                            }
                        }
                        var i = 0;
                        for (var name in obj) {

                            if (name != "prjId" && name != "quotaId" && name != "workId" && obj[name] != 0) {
                                i++;
                                if (names.length > 1 && i != names.length) {
                                    obj[name] = obj[name] + ",";
                                } else {
                                    obj[name] = obj[name] + "。";
                                }
                            }

                        }
                    }
                });
            }
            vm.getWorkOpinionList();
            //获取级别
            WorkorderService.getDataTree("0007001001").then(function (response) {
                vm.queryWorkorderList.workLevelList = response.data;
            });


            vm.isOpen = false;
            vm.showTime=true;

            //回复工单
            vm.replyWorkorder = function (workorder) {
                vm.showTime=false;
                if ((workorder.flowRespondFalg == "0" && vm.workOrderStatus != vm.workorder.workFalg) && vm.workOrderStatus != "4") {
                    eayunModal.warning("响应工单后,才能更改工单为其他状态!");
                    vm.workOrderStatus = vm.workorder.workFalg;
                    vm.getWorkFlag();
                    vm.workorder.opinionContent = null;
                    return;
                } else if ((workorder.workState == '0' || workorder.workState == null) && vm.workOrderStatus != vm.workorder.workFalg && workorder.workType == '0007001003001') {
                    eayunModal.warning("审核工单后才能解决工单");
                    vm.getWorkFlag();
                    return;
                } else if (vm.workOrderStatus != vm.workorder.workFalg && vm.workorder.workFalg!='3' && workorder.workState == '1' && workorder.workType == '0007001003001') {
                    eayunModal.confirm("请确认项目配额已修改成功！").then(function () {
                        addWorkopinion(workorder);
                    });
                } else {
                    addWorkopinion(workorder);
                }


            };
            function addWorkopinion(workorder) {
                var workOpinion = new Object();
                if (workorder.workFalg == '2' && vm.workOrderStatus == '1') {
                    workOpinion.opinionState = '1';//打回
                } else {
                    workOpinion.opinionState = null;
                }
                workorder.workFalg = vm.workOrderStatus;
                workOpinion.workId = workorder.workId;
                workOpinion.opinionContent = workorder.opinionContent;
                workOpinion.flag = workorder.workFalg;
                workOpinion.ecmcCre = '0';
                workOpinion.workEcscFalg = workorder.workEcscFalg;
                workOpinion.creUser = vm.user.id;//当前登录人
                workOpinion.creUserName = vm.user.name;
                workOpinion.workTitle = workorder.workTitle;
                //ecmc工单当前状态:0待处理1:处理中2:已解决3:已完结 4:已取消 5:已删除
                if(vm.workOrderStatus == '1'){
                    workOpinion.logName = '处理工单';
                }
                else if(vm.workOrderStatus == '2'){
                    workOpinion.logName = '解决工单';
                }
                else if(vm.workOrderStatus == '4'){
                    workOpinion.logName = '取消工单';
                }
                else if(vm.workOrderStatus == '3'){
                    workOpinion.logName = '完成工单';
                }
                WorkorderService.addWorkOpinion(workOpinion).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error(response.message);
                            return;
                        case SysCode.success:
                            WorkorderService.getWorkOpinionsByWorkId(workorder.workId).then(function (response) {
                                vm.WorkOpinions = response.data;
                            });
                            WorkorderService.findWorkOrderByWorkId(workorder.workId).then(function (response) {
                                if(response.data.workFalg=='3' ||response.data.workFalg=='4' ){
                                    $state.go("app.workorder.tab.finished");
                                }
                                vm.workOrderStatus = response.data.workFalg;
                                vm.workorder = response.data;
                                vm.showTime=true;
                                vm.getWorkFlag();
                            });
                            return;
                        case SysCode.warning:
                            eayunModal.warning(response.message);
                            return;
                        default:
                            WorkorderService.getWorkOpinionsByWorkId(workorder.workId).then(function (response) {
                                vm.WorkOpinions = response.data;
                            });
                            WorkorderService.findWorkOrderByWorkId(workorder.workId).then(function (response) {
                                vm.workOrderStatus = response.data.workFalg;
                                vm.workorder = response.data;
                            });
                            return;
                    }
                });
            }

            //更改工单级别为可下拉选择
            vm.changeLevel = function () {
                vm.isOpen = true;
            };

            //更改工单级别
            vm.submitLevel = function (workorder) {
                workorder.userId = vm.user.id;
                workorder.userName = vm.user.name;
                WorkorderService.changeWorkLevel(workorder).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('更改工单级别成功!');
                        WorkorderService.findWorkOrderByWorkId(workorder.workId).then(function (response) {
                            vm.workorder = response.data;
                            vm.workorder.listTimerDiff=vm.workorder.newDate-vm.workorder.flowBeginTime;
                        });
                        vm.isOpen = false;
                        WorkorderService.getWorkOpinionsByWorkId(workorder.workId).then(function (response) {
                            vm.WorkOpinions = response.data;
                        });
                    } else {
                        toast.error('更改工单级别失败!');
                    }
                });
            };

            //受理工单
            vm.accept = function (workorder) {
                workorder.userId = vm.user.id;
                workorder.workHeadUser=vm.user.id;
                workorder.workHeadUserName=vm.user.name;
                WorkorderService.acceptWorkOrder(workorder).then(function (response) {
                    switch (response.respCode) {
                        case SysCode.error:
                            eayunModal.error(response.message);
                            return;
                        case SysCode.success:
                            toast.success('受理工单成功!');
                            WorkorderService.findWorkOrderByWorkId(workorder.workId).then(function (response) {
                                vm.workorder = response.data;
                                vm.workOrderStatus = response.data.workFalg;
                                vm.changeShowReply();
                                vm.getWorkFlag();
                                vm.showSelect=true;
                            });
                            WorkorderService.getWorkOpinionsByWorkId(workorder.workId).then(function (response) {
                                vm.WorkOpinions = response.data;
                            });

                            return;
                        case SysCode.warning:
                            eayunModal.warning(response.message);
                            return;
                        default:
                            toast.success("受理工单成功!");
                            return;
                    }
                });
            };

            //审核通过
            vm.auditPassWork = function (workorder) {
                workorder.userId = vm.user.id;
                WorkorderService.auditPassWork(workorder).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('工单审核通过!');
                        vm.getWorkOpinionList();
                        vm.workorder = response.data;
                        vm.workorder.listTimerDiff=vm.workorder.newDate-vm.workorder.flowBeginTime;
                    } else {
                        toast.error('');
                    }
                });
            };

            //审核不通过
            vm.auditNotPassWork = function (workorder) {
                workorder.userId = vm.user.id;
                WorkorderService.auditNotPassWork(workorder).then(function (response) {
                    if (response.respCode == SysCode.success) {
                        toast.success('工单审核未通过!');
                        vm.getWorkOpinionList();
                        vm.workorder = response.data;
                        vm.workorder.listTimerDiff=vm.workorder.newDate-vm.workorder.flowBeginTime;
                    } else {
                        toast.error('');
                    }
                });
            };
            vm.shortName = function (name) {
                if (name && name.length > 2)
                    return name.substring(0, 2) + '...';
                return name;
            };
            //附件下载
            var explorer = navigator.userAgent;
            var browser = 'ie';
            if (explorer.indexOf("MSIE") >= 0) {
                browser = "ie";
            } else if (explorer.indexOf("Firefox") >= 0) {
                browser = "Firefox";
            } else if (explorer.indexOf("Chrome") >= 0) {
                browser = "Chrome";
            } else if (explorer.indexOf("Opera") >= 0) {
                browser = "Opera";
            } else if (explorer.indexOf("Safari") >= 0) {
                browser = "Safari";
            } else if (explorer.indexOf("Netscape") >= 0) {
                browser = 'Netscape';
            }
            vm.down = function (fileId) {
                vm.downSrc = "/api/file/down.do?fileId=" + fileId + "&browser=" + browser;
            };
            //更改配额
            vm.changeQuota = function (workorder) {
                var result = eayunModal.dialog({
                    showBtn: false,
                    title: '修改项目',
                    width: '800px',
                    templateUrl: 'controllers/customer/project/project.html',
                    controller: 'CustomerProjectCtrl',
                    controllerAs: 'prj',
                    resolve: {
                        project: function () {

                            return CustomerService.getPrjByPrjId(workorder.prjId).then(function (response) {
                                return response.data;
                            });
                        },
                        dcList: function () {
                            return CustomerService.getDcList().then(function (response) {
                                return response.data;
                            });
                        }
                    }
                });
                result.then(function (project) {
                    CustomerService.modifyProject(project).then(function (response) {
                        if (response.respCode == SysCode.success) {
                            toast.success('修改配额成功!');
                        } else {
                            toast.error('修改配额失败');
                        }
                    });
                })
            };

            //转办工单
            vm.turnToOtherUser = function (_workorder) {
                var result = eayunModal.dialog({
                    showBtn: true,
                    title: '求助其他工程师',
                    width: '600px',
                    templateUrl: 'controllers/workorder/transfer/transfer.html',
                    controller: 'WorkorderDetailTurnToOtherCtrl',
                    controllerAs: 'transfer',
                    resolve: {
                        order: function () {
                            return _workorder;
                        }
                    }
                })
                result.then(function (work) {
                    work.userId=vm.user.id;
                    work.userName = vm.user.name;
                    vm.showTime=false;
                    WorkorderService.truntootheruser(work).then(function (response) {
                        vm.showTime=true;
                        if (response.respCode == SysCode.success) {
                            toast.success('工单转办成功!');
                            WorkorderService.findWorkOrderByWorkId(_workorder.workId).then(function (response) {
                                vm.workorder = response.data;
                                workorder = vm.workorder;
                                vm.workorder.listTimerDiff=vm.workorder.newDate-vm.workorder.flowBeginTime;
                                vm.selectOrReply();
                            });
                            WorkorderService.getWorkOpinionsByWorkId(_workorder.workId).then(function (response) {
                                vm.WorkOpinions = response.data;
                            });
                        } else {
                            toast.error('工单转办失败');
                        }
                    });
                });
            };

        }]);