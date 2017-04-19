'use strict';

angular.module('eayun.ecmc')
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.when('', ['$state', function ($state) {
            if (sessionStorage.login) {
                $state.go('app');
            } else {
                $state.go('login');
            }
        }]);
        $urlRouterProvider.when('/overview', '/overview/res');
        $urlRouterProvider.when('/customer', '/customer/manage');
        $urlRouterProvider.when('/customer/detail/:cusId/cusreport',
            ['$state', function ($state) {
                $state.go("app.customer.detail.cusreport.postpaid");
            }]);
        $urlRouterProvider.when('/workorder', '/workorder/unfinished');
        $urlRouterProvider.when('/workorder/star', '/workorder/star/operation');
        $urlRouterProvider.when('/center', '/center/datacenter');
        $urlRouterProvider.when('/server', '/server/physicalserver/');
        $urlRouterProvider.when('/cabinet', '/cabinet/physicalcabinet/');
        $urlRouterProvider.when('/switch', '/switch/physicalswitch/');
        $urlRouterProvider.when('/storage', '/storage/physicalstorage/');
        $urlRouterProvider.when('/firewall', '/firewall/physicalfirewall/');
        $urlRouterProvider.when('/model', '/model/physicalmodel');
        $urlRouterProvider.when('/ip', '/ip/physicalip');
        $urlRouterProvider.when('/obs', '/obs/obsoverview');
        $urlRouterProvider.when('/monitor', '/monitor/cloudhost');
        $urlRouterProvider.when('/warning', '/warning/message');
        $urlRouterProvider.when('/contacts', '/contacts/person');
        $urlRouterProvider.when('/cloudhost', '/cloudhost/host');
        $urlRouterProvider.when('/cloudhost/image', '/cloudhost/image/global');
        $urlRouterProvider.when('/cloudhost/volume', '/cloudhost/volume/cloudvolume');
        $urlRouterProvider.when('/log', '/log/ecmc');
        $urlRouterProvider.when('/net', '/net/private');
        $urlRouterProvider.when('/net/private', '/net/private/list');
        $urlRouterProvider.when('/net/balance', '/net/balance/lb');
        $urlRouterProvider.when('/recycle', '/recycle/host');


        $urlRouterProvider.when('/task', '/task/list');
        $urlRouterProvider.when('/order', '/order/list');
        $urlRouterProvider.when('/price', '/price/basics');
        $urlRouterProvider.when('/price/image', '/price/image/public');
        $urlRouterProvider.when('/unit', '/unit/unitlist');

        //$urlRouterProvider.when('/safe', '/safe/firewall');
        $urlRouterProvider.when('/safe', ['loginInfo', function (loginInfo) {
            if (loginInfo.hasUIPermission('firewall_query')) {
                return '/safe/firewall';
            } else if (loginInfo.hasUIPermission('securitygroup_qurey')) {
                return '/safe/group/list';
            }
        }]);
        $urlRouterProvider.when('/safe/firewall', '/safe/firewall/list');
        $urlRouterProvider.when('/sysdatatree', '/sysdatatree/sysdatatree');
        $urlRouterProvider.when('/authority', ['MenuService', '$state', function (MenuService, $state) {
            MenuService.getTree().then(function (data) {
                $state.go('app.authority.menu', {menu: data[0].id});
            });
        }]);
        $urlRouterProvider.when('/user', ['DepartmentService', '$state', function (DepartmentService, $state) {
            DepartmentService.getTree().then(function (data) {
                $state.go('app.user.department', {department: data[0].children[0].id});
            });
        }]);
        $urlRouterProvider.when('/menu', ['MenuService', '$state', function (MenuService, $state) {
            MenuService.getTree().then(function (data) {
                $state.go('app.menu.menulist', {menu: data[0].id});
            });
        }]);
        $urlRouterProvider.when('/mailsms', '/mailsms/mail');
		
        $stateProvider.state('app', {
                templateUrl: 'controllers/home/home.html',
                resolve: {
                    session: ['loginInfo', function (loginInfo) {
                        return loginInfo.getSessionInfo();
                    }]
                }
            })
            .state('app.overview', {
                url: '/overview',
                templateUrl: 'controllers/overview/index.html'
            })
            /*云主机管理一级页面*/
            .state('app.cloudhost', {
                url: '/cloudhost',
                template: '<div ui-view></div>'
            })
            .state('app.obs', {
                url: '/obs',
                templateUrl: 'controllers/obs/index.html'
            })
            /*回收站一级页面*/
            .state('app.recycle', {
                url: '/recycle',
                templateUrl: 'controllers/recycle/index.html'
            })
            /*客户管理一级页面*/
            .state('app.customer', {
                url: '/customer',
                templateUrl: 'controllers/customer/index.html'
            })
            /*工单管理一级页面*/
            .state('app.workorder', {
                url: '/workorder',
                templateUrl: 'controllers/workorder/index.html'
            })
            /*消息管理一级页面*/
            .state('app.message', {
                url: '/message',
                templateUrl: 'controllers/message/message.html',
                controller: 'MessageCtrl',
                controllerAs: 'message'
            })
            /*公告管理一级页面*/
            .state('app.notice', {
                url: '/notice',
                templateUrl: 'controllers/notice/notice.html',
                controller: 'NoticeCtrl',
                controllerAs: 'notice'
            })
            /*价格配置一级页面*/
            .state('app.price', {
                url: '/price',
                templateUrl: 'controllers/price/index.html'
            })
            /*配额模板页面*/
            .state('app.quotatemp', {
                url: '/quota',
                templateUrl: 'controllers/quota/index.html',
                controller: 'QuotaTemplateCtrl',
                controllerAs: 'quota'
            })
            /*任务管理一级页面*/
            .state('app.task', {
                url: '/task',
                templateUrl: 'controllers/task/index.html',

            })

            /*备案管理一级页面*/
            .state('app.unit', {
                url: '/unit',
                templateUrl: 'controllers/unit/index.html',

            })


            .state('app.center', {
                url: '/center',
                templateUrl: 'controllers/center/index.html'
            })
            .state('app.server', {
                url: '/server',
                templateUrl: 'controllers/server/index.html'
            })
            .state('app.cabinet', {
                url: '/cabinet',
                templateUrl: 'controllers/cabinet/index.html'
            })
            .state('app.switch', {
                url: '/switch',
                templateUrl: 'controllers/switch/index.html'
            })
            .state('app.storage', {
                url: '/storage',
                templateUrl: 'controllers/storage/index.html'
            })
            .state('app.firewall', {
                url: '/firewall',
                templateUrl: 'controllers/firewall/index.html'
            })
            .state('app.model', {
                url: '/model',
                templateUrl: 'controllers/model/index.html'
            })
            .state('app.ip', {
                url: '/ip',
                templateUrl: 'controllers/ip/index.html'
            })
            /*监控管理第一级页面*/
            .state('app.monitor', {
                url: '/monitor',
                templateUrl: 'controllers/monitor/index.html'
            })
            /*报警管理一级页面*/
            .state('app.warning', {
                url: '/warning',
                templateUrl: 'controllers/warning/index.html'
            })
            /*联系人管理第一级页面*/
            .state('app.contacts', {
                url: '/contacts',
                templateUrl: 'controllers/contacts/index.html'
            })
            .state('app.net', {
                url: '/net',
                template: '<div ui-view></div>'
            })
            /*部门管理第一级页面*/
            .state('app.department', {
                url: '/department',
                templateUrl: 'controllers/department/list.html',
                controller: 'DepartmentCtrl',
                controllerAs: 'department'
            })
            /*菜单管理第一级页面*/
            .state('app.menu', {
                url: '/menu',
                templateUrl: 'controllers/menu/index.html'
            })
            /*角色管理第一级页面*/
            .state('app.role', {
                url: '/role',
                templateUrl: 'controllers/role/list.html',
                controller: 'RoleCtrl',
                controllerAs: 'role'
            })
            /*权限管理第一级页面*/
            .state('app.authority', {
                url: '/authority',
                templateUrl: 'controllers/authority/index.html'
            })
            /*用户管理第一级页面*/
            .state('app.user', {
                url: '/user',
                templateUrl: 'controllers/user/index.html',
                controller: 'UserCtrl',
                controllerAs: 'user'
            })
            .state('app.safe', {
                url: '/safe',
                template: '<div ui-view></div>'
            })
            /*日志管理第一级页面*/
            .state('app.log', {
                url: '/log',
                templateUrl: 'controllers/log/index.html'
            })
            /*订单管理第一级页面*/
            .state('app.order', {
                url: '/order',
                templateUrl: 'controllers/order/index.html'
            })
            /*在线统计*/
            .state('app.cusonline', {
                url: '/cusonline',
                templateUrl: 'controllers/cusonline/cusonline.html',
                controller: 'CusonlineCtrl',
                controllerAs: 'cusonline'
            })
            .state('app.sysdatatree', {
                url: '/sysdatatree',
                templateUrl: 'controllers/sysdatatree/index.html',
            })
            /*邮件短信管理第一级页面*/
            .state('app.mailsms', {
                url: '/mailsms',
                templateUrl: 'controllers/mail/index.html',
            })
            /*API概览页面*/
            .state('app.apioverview', {
                url: '/apioverview',
                templateUrl: 'controllers/api/overview/index.html',
                controller: 'ApiOverviewCtrl',
                controllerAs: 'apioverview'
            })
            /*API限制管理页面*/
            .state('app.apilimit', {
                url: '/apilimit',
                templateUrl: 'controllers/api/limitmanage/limitmanage.html',
                controller: 'ApiLimitCtrl',
                controllerAs: 'limit'
            })
            /*API管理开关总权限页面*/
            .state('app.apimanage', {
                url: '/apimanage',
                templateUrl: 'controllers/api/apimanage/index.html',
                controller: 'ApiManageCtrl',
                controllerAs: 'apimanage'
            });

        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'controllers/home/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'
        });

        $stateProvider.state('app.overview.res', {
                url: '/res',
                templateUrl: 'controllers/overview/res.html',
                controller: 'OverviewResCtrl',
                controllerAs: 'res'
            })
            .state('app.overview.project', {
                url: '/project',
                templateUrl: 'controllers/overview/project.html',
                controller: 'OverviewProjectCtrl',
                controllerAs: 'project'
            })
            .state('app.overview.customer',{
            	url: '/customer',
                templateUrl: 'controllers/overview/customer.html',
                controller: 'OverviewCustomerCtrl',
                controllerAs: 'customer'
            });
        $stateProvider.state('app.cloudhost.tab', {
                templateUrl: 'controllers/cloudhost/index.html'
            })
            .state('app.cloudhost.tab.host', {
                url: '/host',
                templateUrl: 'controllers/cloudhost/host.html',
                controller: 'CloudhostHostCtrl',
                controllerAs: 'host'
            })
            .state('app.cloudhost.vmdetail', {
                url: '/host/:vmId',
                templateUrl: 'controllers/cloudhost/detail.html',
                controller: 'CloudhostHostDetailCtrl',
                controllerAs: 'vmDetail'
            })
            .state('app.cloudhost.guide', {
                url: '/host/:vmId',
                templateUrl: 'controllers/cloudhost/guide.html',
                controller: 'CloudhostHostDetailGuideCtrl',
                controllerAs: 'guide'
            })
            .state('app.cloudhost.guide.monitor', {
                url: '/monitor',
                templateUrl: 'controllers/monitor/detail/cloudhostDetail.html',
                controller: 'MonitorCloudHostDetailCtrl',
                controllerAs: 'cloudhostDetail'
            })
            .state('app.cloudhost.tab.volume', {
                url: '/volume',
                templateUrl: 'controllers/cloudhost/cloudvolume/volumeindex.html'
            });

        /*云主机-镜像二级页面*/
        $stateProvider.state('app.cloudhost.tab.image', {
            url: '/image',
            templateUrl: 'controllers/images/imagesindex.html',
            controller: '',//xxxxxx
            controllerAs: 'image'
        }).state('app.cloudhost.tab.image.globalimage', {
            url: '/global',
            templateUrl: 'controllers/images/globalimage.html',
            controller: 'GlobalImageCtrl',//xxxxxx
            controllerAs: 'global'
        }).state('app.cloudhost.tab.image.customimage', {
            url: '/custom',
            templateUrl: 'controllers/images/customimage.html',
            controller: 'CustomImageCtrl',
            controllerAs: 'custom'
        }).state('app.cloudhost.tab.image.marketimage', {
            url: '/market',
            templateUrl: 'controllers/images/marketimage.html',
            controller: 'MarketImageCtrl',
            controllerAs: 'market'
        }) .state('app.cloudhost.marketimagedetail', {
            url: '/market/:imageId',
            templateUrl:  'controllers/images/marketimage/detail.html',
            controller: 'MarketImageDetailCtrl',
            controllerAs: 'marketImageDetail'
        }).state('app.cloudhost.tab.image.unclassifiedimage', {
            url: '/unclassified',
            templateUrl: 'controllers/images/unclassifiedimage.html',
            controller: 'UnclassifiedImageCtrl',
            controllerAs: 'unclassified'
        });
        /*云主机-云硬盘二级页面*/
        $stateProvider.state('app.cloudhost.tab.volume.volume', {
                url: '/cloudvolume',
                templateUrl: 'controllers/cloudhost/cloudvolume/volumeList.html',
                controller: 'CloudhostVolumeCtrl',
                controllerAs: 'volume'
            })
            .state('app.cloudhost.volumedetail', {
                url: '/cloudvolume/:volId',
                templateUrl: 'controllers/cloudhost/cloudvolume/volumedetail.html',
                controller: 'CloudhostVolumeDetailCtrl',
                controllerAs: 'volumeDetail'
            });
        /*云主机-云硬盘快照二级页面*/
        $stateProvider.state('app.cloudhost.tab.volume.snapshot', {
            url: '/cloudsnapshot',
            templateUrl: 'controllers/cloudhost/cloudsnapshot/snapshotList.html',
            controller: 'CloudhostSnapshotCtrl',
            controllerAs: 'snapshot'
        });

        $stateProvider.state('app.obs.obsoverview', {
                url: '/obsoverview',
                templateUrl: 'controllers/obs/obsOverview/obsOverview.html',
                controller: 'ObsOverviewCtrl',
                controllerAs: 'obsOverview'
            })
            .state('app.obs.obscusoverview', {
                url: '/obscusoverview/:cusId/:bucketName/:type',
                templateUrl: 'controllers/obs/cusDetail/obsCusOverview.html',
                controller: 'ObsCusOverviewCtrl',
                controllerAs: 'obsCusOverview',
                resolve: {
                    obsCustomers: function ($http) {
                        return $http.post('/api/ecmc/obs/obscustomer/getObsCustomer', {}).then(function (response) {
                            return response.data;
                        });
                    }
                }
            })
            .state('app.obs.cdn', {
                url: '/cdn',
                templateUrl: 'controllers/obs/cdn/cdnmng.html',
                controller: 'cdnCtrl',
                controllerAs: 'cdn',
                resolve: {
                    cdnCustomers: function ($http) {
                        return $http.post('/api/ecmc/obs/cdn/getobscdncustomer', {}).then(function (response) {
                            return response.data.data;
                        });
                    }
                }
            });
        /*客户管理二级页面*/
        $stateProvider.state('app.customer.manage', {
                url: '/manage',
                templateUrl: 'controllers/customer/manage/manage.html',
                controller: 'CustomerManageCtrl',
                controllerAs: 'manage'
            })
            .state('app.customer.uncreatedcus', {
                url: '/uncreated',
                templateUrl: 'controllers/customer/uncreated/list.html',
                controller: 'UncreatedCusCtrl',
                controllerAs: 'uncreatedCusMng'
            })
            .state('app.customer.detail', {
                url: '/detail/:cusId',
                templateUrl: 'controllers/customer/detail/detail.html',
                controller: 'CusDetailCtrl',
                controllerAs: 'detailMng'
            })
            .state('app.customer.statistic', {
                url: '/statistic/:prjId/:dcId/:cusId',
                templateUrl: 'controllers/customer/statistic/statistic.html',
                controller: 'CustomerStatisticCtrl',
                controllerAs: 'statistic'
            });
        /*客户管理三级页面*/
        $stateProvider.state('app.customer.detail.cusandprojects', {
                url: '/cusandprojects',
                templateUrl: 'controllers/customer/detail/tab/cusandprojects.html',
                controller: 'CustomerDetailCtrl',
                controllerAs: 'detail'
            })
            .state('app.customer.detail.cusreport', {
                url: '/cusreport',
                templateUrl: 'controllers/customer/detail/tab/cusreport.html',
                controller: 'CusReportCtrl',
                controllerAs: 'cusReport'
            })
            .state('app.customer.detail.cusrecords', {
                url: '/cusrecords',
                templateUrl: 'controllers/customer/detail/tab/cusrecords.html',
                controller: 'CusRecordCtrl',
                controllerAs: 'cusRecords'
            });

        /*客户管理四级页面*/
        $stateProvider.state('app.customer.detail.cusreport.prepaid', {
                url: '/prepaid',
                templateUrl: 'controllers/customer/detail/tab/report/prepaid.html',
                controller: 'CusPrePaidCtrl',
                controllerAs: 'prepaid'
            })
            .state('app.customer.detail.cusreport.postpaid', {
                url: '/postpaid',
                templateUrl: 'controllers/customer/detail/tab/report/postpaid.html',
                controller: 'CusPostPaidCtrl',
                controllerAs: 'postpaid'
            });

        /*客户-费用报表详情*/
        $stateProvider.state('app.customer.postpaidreportdetail', {
                url: '/postpaiddetail/:cusId/:id',
                templateUrl: 'controllers/customer/detail/tab/report/postpaiddetail.html',
                controller: 'CusPostPaidDetailCtrl',
                controllerAs: 'postpaidDetail'
            })
            .state('app.customer.prepaidreportdetail', {
                url: '/prepaiddetail/:cusId/:orderNo',
                templateUrl: 'controllers/customer/detail/tab/report/prepaiddetail.html',
                controller: 'CusPrePaidDetailCtrl',
                controllerAs: 'prepaidDetail'
            })
        /*工单管理二级页面*/
        $stateProvider.state('app.workorder.tab', {
                templateUrl: 'controllers/workorder/workorder.html',
                controller: 'WorkorderTabCtrl'
            })
            .state('app.workorder.tab.unfinished', {
                url: '/unfinished?applyCustomer&workorderFlag',
                templateUrl: 'controllers/workorder/unfinished/unfinished.html',
                controller: 'WorkorderUnfinishedCtrl',
                controllerAs: 'unfinished',
                resolve: {
                    parentId: ['loginInfo', function (loginInfo) {
                        return loginInfo.getSessionInfo().then(function () {
                            if (loginInfo.hasUIPermission("workorder_find_all")) {//查看全部
                                return '0007001003,0007001002';
                            } else if (loginInfo.hasUIPermission("workorder_find_special")) {//查看特殊
                                return '0007001003';
                            } else if (loginInfo.hasUIPermission("workorder_find_common")) {//查看普通
                                return '0007001002';
                            }
                        })

                    }]
                }
            })
            .state('app.workorder.tab.finished', {
                url: '/finished',
                templateUrl: 'controllers/workorder/finished/finished.html',
                controller: 'WorkorderFinishedCtrl',
                controllerAs: 'finished',
                resolve: {
                    parentId: ['loginInfo', function (loginInfo) {
                        return loginInfo.getSessionInfo().then(function () {
                            if (loginInfo.hasUIPermission("workorder_find_all")) {//查看全部
                                return '0007001003,0007001002';
                            } else if (loginInfo.hasUIPermission("workorder_find_special")) {//查看特殊
                                return '0007001003';
                            } else if (loginInfo.hasUIPermission("workorder_find_common")) {//查看普通
                                return '0007001002';
                            }
                        })

                    }]
                }
            })
            .state('app.workorder.tab.star', {
                url: '/star',
                templateUrl: 'controllers/workorder/operation/star.html'
            })
            .state('app.workorder.tab.star.operation', {
                url: '/operation',
                templateUrl: 'controllers/workorder/operation/operation.html',
                controller: 'WorkorderOperationCtrl',
                controllerAs: 'operation'
            })

            .state('app.workorder.tab.star.personal', {
                url: '/personal/:headUser',
                templateUrl: 'controllers/workorder/operation/personal.html',
                controller: 'WorkorderOperationPersonalCtrl',
                controllerAs: 'personal'
            })

            .state('app.workorder.detail', {
                url: '/detail/:workId',
                templateUrl: 'controllers/workorder/detail/detail.html',
                controller: 'WorkorderDetailCtrl',
                controllerAs: 'detail',
                resolve: {
                    workorder: ['$stateParams', 'WorkorderService', function ($stateParams, WorkorderService) {
                        return WorkorderService.findWorkOrderByWorkId($stateParams.workId).then(function (resp) {
                            return resp.data;
                        });
                    }]
                }
            })
            .state('app.workorder.register', {
                url: '/register/:workId/:cusId',
                templateUrl: 'controllers/workorder/detail/registerDetail.html',
                controller: 'WorkorderRegisterDetailCtrl',
                controllerAs: 'registerDetail'
            })
            .state('app.workorder.add', {
                url: '/add',
                templateUrl: 'controllers/workorder/add/add.html',
                controller: 'WorkorderAddCtrl',
                controllerAs: 'add'
            })
            .state('app.workorder.edit', {
                url: '/edit/:workId',
                templateUrl: 'controllers/workorder/edit/edit.html',
                controller: 'WorkorderEditCtrl',
                controllerAs: 'edit'
            }) // 订单列表
            .state('app.order.list', {
                url: '/list',
                templateUrl: 'controllers/order/list.html',
                controller: 'OrderMngCtrl',
                controllerAs: 'orderMng'
            })// 订单详情
            .state('app.order.detail', {
                url: '/detail/:orderId',
                templateUrl: 'controllers/order/detail/detail.html',
                controller: 'OrderDetailCtrl',
                controllerAs: 'detailMng'
            });

        $stateProvider.state('app.center.datacenter', {
            url: '/datacenter',
            templateUrl: 'controllers/center/dataCenter.html',
            controller: 'CenterDataCtrl',
            controllerAs: 'dataCenter'
        });


        //*任务管理二级页面*/
        $stateProvider.state('app.task.tasklist', {
            url: '/list',
            templateUrl: 'controllers/task/TaskIndex.html',
            controller: 'taskListCtrl',
            controllerAs: 'tasklist'
        });

        //*备案管理二级页面*/
        $stateProvider.state('app.unit.unitlist', {
            url: '/unitlist',
            templateUrl: 'controllers/unit/unitIndex.html',
            controller: 'unitListCtrl',
            controllerAs: 'unitlist'
        });

        //*任务管理二级页面*/
        $stateProvider.state('app.task.log', {
            url: '/log?triggerName&jobName',
            templateUrl: 'controllers/task/history/history.html',
            controller: 'historyCtrl',
            controllerAs: 'history'
        });

        //*任务管理二级页面*/
        $stateProvider.state('app.task.schedulelost', {
            url: '/schedulelost',
            templateUrl: 'controllers/task/schedule_lost/schedule_lost.html',
            controller: 'scheduleLostCtrl',
            controllerAs: 'scheduleLost'
        });

        //*任务管理二级页面*/
        $stateProvider.state('app.task.data', {
            url: '/querySatatistics/:taskid',
            templateUrl: 'controllers/task/statistics/data.html',
            controller: 'dataCrtl',
            controllerAs: 'data'
        });


        $stateProvider.state('app.server.physicalserver', {
            url: '/physicalserver/:dcId',
            templateUrl: 'controllers/server/physicalServer.html',
            controller: 'ServerPhysicalCtrl',
            controllerAs: 'physicalServer'
        });

        $stateProvider.state('app.cabinet.physicalcabinet', {
            url: '/physicalcabinet/:dcId',
            templateUrl: 'controllers/cabinet/physicalCabinet.html',
            controller: 'CabinetPhysicalCtrl',
            controllerAs: 'physicalCabinet'
        });

        $stateProvider.state('app.switch.physicalswitch', {
            url: '/physicalswitch/:dcId',
            templateUrl: 'controllers/switch/physicalSwitch.html',
            controller: 'SwitchPhysicalCtrl',
            controllerAs: 'physicalSwitch'
        });

        $stateProvider.state('app.storage.physicalstorage', {
            url: '/physicalstorage/:dcId',
            templateUrl: 'controllers/storage/physicalStorage.html',
            controller: 'StoragePhysicalCtrl',
            controllerAs: 'physicalStorage'
        });

        $stateProvider.state('app.firewall.physicalfirewall', {
            url: '/physicalfirewall/:dcId',
            templateUrl: 'controllers/firewall/physicalFirewall.html',
            controller: 'FirewallPhysicalCtrl',
            controllerAs: 'physicalFirewall'
        });

        $stateProvider.state('app.model.physicalmodel', {
            url: '/physicalmodel',
            templateUrl: 'controllers/model/physicalModel.html',
            controller: 'ModelPhysicalCtrl',
            controllerAs: 'physicalModel'
        });

        $stateProvider.state('app.ip.physicalip', {
            url: '/physicalip',
            templateUrl: 'controllers/ip/physicalIp.html',
            controller: 'IpPhysicalCtrl',
            controllerAs: 'physicalIp'
        });
        /*资源监控第二级页面*/
        $stateProvider.state('app.monitor.tab', {
                templateUrl: 'controllers/monitor/monitorTab.html',
                controller: 'MonitorTabCtrl'
            })
            .state('app.monitor.tab.cloudhost', {
                url: '/cloudhost',
                templateUrl: 'controllers/monitor/cloudhost/cloudhost.html',
                controller: 'MonitorCloudHostCtrl',
                controllerAs: 'cloudhost'
            })
            .state('app.monitor.tab.apiservice', {
                url: '/apiservice',
                templateUrl: 'controllers/monitor/apiservice/apiservice.html',
                controller: 'ApiServiceCtrl',
                controllerAs: 'apiservice'
            })
            .state('app.monitor.tab.server', {
                url: '/server',
                templateUrl: 'controllers/monitor/server/server.html',
                controller: 'MonitorServerCtrl',
                controllerAs: 'server'
            })
            .state('app.monitor.guide', {
                url: '/detail',
                templateUrl: 'controllers/monitor/detail/detailIndex.html'
            })
            .state('app.monitor.guide.detail', {
                url: '/:vmId',
                templateUrl: 'controllers/monitor/detail/cloudhostDetail.html',
                controller: 'MonitorCloudHostDetailCtrl',
                controllerAs: 'cloudhostDetail'
            });
        /*报警管理第二级页面*/
        $stateProvider.state('app.warning.tab', {
                templateUrl: 'controllers/warning/warningTab.html',
                controller: 'WarningTabCtrl'
            })
            .state('app.warning.tab.message', {
                url: '/message',
                templateUrl: 'controllers/warning/message/message.html',
                controller: 'WarningMessageCtrl',
                controllerAs: 'message'
            })
            .state('app.warning.tab.rule', {
                url: '/rule',
                templateUrl: 'controllers/warning/rule/rule.html',
                controller: 'WarningRuleCtrl',
                controllerAs: 'rule'
            })
            .state('app.warning.detail', {
                url: '/detail/:alarmRuleId',
                templateUrl: 'controllers/warning/detail/ruleDetail.html',
                controller: 'WarningRuleDetailCtrl',
                controllerAs: 'ruleDetail'
            });
        /*联系人管理第二级页面*/
        $stateProvider.state('app.contacts.tab', {
                templateUrl: 'controllers/contacts/contactsTab.html',
                controller: 'ContactsTabCtrl'
            })
            .state('app.contacts.tab.person', {
                url: '/person',
                templateUrl: 'controllers/contacts/person/person.html',
                controller: 'ContactsPersonCtrl',
                controllerAs: 'person'
            })
            .state('app.contacts.tab.group', {
                url: '/group',
                templateUrl: 'controllers/contacts/group/group.html',
                controller: 'ContactsGroupCtrl',
                controllerAs: 'group'
            });
        /*日志管理第二级页面*/
        $stateProvider.state('app.log.ecsc', {
                url: '/ecsc',
                templateUrl: 'controllers/log/ecsc.html',
                controller: 'LogEcscCtrl',
                controllerAs: 'ecsc'
            })
            .state('app.log.ecmc', {
                url: '/ecmc',
                templateUrl: 'controllers/log/ecmc.html',
                controller: 'LogEcmcCtrl',
                controllerAs: 'ecmc'
            })
            .state('app.log.api', {
                url: '/api/:cusId/:startTime/:endTime/:status',
                templateUrl: 'controllers/log/apilog.html',
                controller: 'LogApiCtrl',
                controllerAs: 'api'
            })
            .state('app.sysdatatree.sysdatatree', {
                url: '/sysdatatree',
                templateUrl: 'controllers/sysdatatree/sysdatatree.html',
                controller: 'SysDataTreeCtrl',
                controllerAs: 'dataTree'
            })
            .state('app.sysdatatree.sync', {
                url: '/sync',
                templateUrl: 'controllers/sysdatatree/sync.html',
                controller: 'SyncCtrl',
                controllerAs: 'syncTree'
            });

        $stateProvider.state('app.net.tabs', {
                abstract: true,
                templateUrl: 'controllers/net/index.html'
            })
            .state('app.net.tabs.private', {
                url: '/private',
                templateUrl: 'controllers/net/private/index.html'
            })
            .state('app.net.tabs.private.list', {
                url: '/list',
                templateUrl: 'controllers/net/private/list.html',
                controller: 'NetPrivateListCtrl',
                controllerAs: 'net'
            })
            .state('app.net.tabs.private.router', {
                url: '/router',
                templateUrl: 'controllers/net/private/router.html',
                controller: 'NetPrivateRouterCtrl',
                controllerAs: 'router'
            })
            .state('app.net.privateDetail', {
                url: '/private/:netId',
                templateUrl: 'controllers/net/private/detail.html',
                controller: 'NetPrivateDetailCtrl',
                controllerAs: 'detail'
            })
            .state('app.net.routerDetail', {
                url: '/router/:routerId',
                templateUrl: 'controllers/net/private/detailRouter.html',
                controller: 'NetPrivateRouterDetailCtrl',
                controllerAs: 'detail',
                resolve: {
                    baseInfo: ['$stateParams', '$http', function ($stateParams, $http) {
                        return $http.post('/api/ecmc/virtual/route/getroutedetailbyid', {routeId : $stateParams.routerId}).then(function (response) {
                                return response.data.data;
                            });
                    }]
                }
            })
            .state('app.net.tabs.external', {
                url: '/external',
                templateUrl: 'controllers/net/external/list.html',
                controller: 'NetExternalListCtrl',
                controllerAs: 'external'
            })
            .state('app.net.externalDetail', {
                url: '/external/:netId',
                templateUrl: 'controllers/net/external/detail.html',
                controller: 'NetExternalDetailCtrl',
                controllerAs: 'detail'
            })
            .state('app.net.tabs.float', {
                url: '/float',
                templateUrl: 'controllers/net/float/list.html',
                controller: 'NetFloatListCtrl',
                controllerAs: 'float'
            })
            .state('app.net.tabs.balance', {
                url: '/balance',
                templateUrl: 'controllers/net/balance/index.html'
            })
            .state('app.net.tabs.vpn', {
                url: '/vpn',
                templateUrl: 'controllers/net/vpn/list.html',
                controller: 'VpnListCtrl',
                controllerAs: 'vpn'
            })
            .state('app.net.detailvpn', {
                url: '/vpn/detail/:vpnId',
                templateUrl: 'controllers/net/vpn/detail.html',
                controller: 'DetailVpnCtrl',
                controllerAs: 'detail'
            })
            .state('app.net.tabs.balance.pool', {
                url: '/pool',
                templateUrl: 'controllers/net/balance/pool/pool.html',
                controller: 'NetBalancePoolCtrl',
                controllerAs: 'pool'
            })
            .state('app.net.tabs.balance.load', {
                url: '/lb',
                templateUrl: 'controllers/net/balance/loadbalancer/loadmng.html',
                controller: 'LoadBalancerCtrl',
                controllerAs: 'lb'
            })
            .state('app.net.loadDetail', {
                url: '/lb/detail/:poolId',
                templateUrl: 'controllers/net/balance/loadbalancer/detail.html',
                controller: 'LoadBalancerDetailCtrl',
                controllerAs: 'lbDetail'
            })
            .state('app.net.tabs.balance.member', {
                url: '/member',
                templateUrl: 'controllers/net/balance/member/member.html',
                controller: 'NetBalanceMemberCtrl',
                controllerAs: 'member'
            })
            .state('app.net.tabs.balance.monitor', {
                url: '/monitor',
                templateUrl: 'controllers/net/balance/health/monitor.html',
                controller: 'NetBalanceMonitorCtrl',
                controllerAs: 'monitor'
            })
            .state('app.net.tabs.balance.vip', {
                url: '/vip',
                templateUrl: 'controllers/net/balance/vip/vip.html',
                controller: 'NetBalanceVipCtrl',
                controllerAs: 'vip'
            });

        $stateProvider.state('app.safe.tabs', {
                abstract: true,
                templateUrl: 'controllers/safe/index.html',
                controller: 'SafeCtrl'
            })
            .state('app.safe.tabs.firewall', {
                url: '/firewall',
                templateUrl: 'controllers/safe/firewall/index.html'
            })
            .state('app.safe.tabs.firewall.list', {
                url: '/list',
                templateUrl: 'controllers/safe/firewall/list.html',
                controller: 'SafeFirewallListCtrl',
                controllerAs: 'list'
            })
            .state('app.safe.tabs.firewall.policy', {
                url: '/policy',
                templateUrl: 'controllers/safe/firewall/policy/policy.html',
                controller: 'SafeFirewallPolicyCtrl',
                controllerAs: 'policy'
            })
            .state('app.safe.rule', {
                url: '/rule/:fwModel',
                templateUrl: 'controllers/safe/firewall/rule/rule.html',
                controller: 'SafeFirewallRuleCtrl',
                controllerAs: 'rule'
            })
            .state('app.safe.tabs.group', {
                url: '/group/list',
                templateUrl: 'controllers/safe/group/list.html',
                controller: 'SafeGroupListCtrl',
                controllerAs: 'group'
            })
            .state('app.safe.groupDetail', {
                url: '/group/detail/:safeGroupId/:cusOrg',
                templateUrl: 'controllers/safe/group/detail.html',
                controller: 'SafeGroupDetailCtrl',
                controllerAs: 'detail'
            });

        $stateProvider.state('app.user.department', {
            url: '/:department',
            templateUrl: 'controllers/user/list.html',
            controller: 'UserListCtrl',
            controllerAs: 'list'
        });
        $stateProvider.state('app.authority.menu', {
            url: '/:menu',
            templateUrl: 'controllers/authority/list.html',
            controller: 'AuthorityListCtrl',
            controllerAs: 'list'
        });
        $stateProvider.state('app.menu.menulist', {
            url: '/:menu',
            templateUrl: 'controllers/menu/list.html',
            controller: 'MenuListCtrl',
            controllerAs: 'menu'
        });
        /*价格配置二级页面*/
        $stateProvider.state('app.price.basics', {
                url: '/basics',
                templateUrl: 'controllers/price/basicsprice.html',
                controller: 'PriceCtrl',
                controllerAs: 'price'
            })
            .state('app.price.image', {
                url: '/image',
                templateUrl: 'controllers/price/imageprice/imageprice.html',
            })
            .state('app.price.image.public', {
                url: '/public',
                templateUrl: 'controllers/price/imageprice/public/publicprice.html',
                controller: 'PublicPriceCtrl',
                controllerAs: 'publicprice'
            })
            .state('app.price.image.market', {
                url: '/market',
                templateUrl: 'controllers/price/imageprice/market/marketprice.html',
                controller: 'MarketPriceCtrl',
                controllerAs: 'marketprice'
            });
        /*邮件短信管理第二级页面*/
        $stateProvider.state('app.mailsms.tab', {
                templateUrl: 'controllers/mail/mailsmsTab.html',
                controller: 'MailSmsTabCtrl'
            })
            .state('app.mailsms.tab.mail', {
                url: '/mail',
                templateUrl: 'controllers/mail/mail_list.html',
                controller: 'MailListCtrl',
                controllerAs: 'mails'
            })
            .state('app.mailsms.tab.sms', {
                url: '/sms',
                templateUrl: 'controllers/sms/sms.html',
                controller: 'SmsCtrl',
                controllerAs: 'sms'
            }).state('app.recycle.host', {
                url: '/host',
                templateUrl: 'controllers/recycle/host/host.html',
                controller: 'RecycleHostCtrl',
                controllerAs: 'recycleHost'
            })
            .state('app.recycle.volume', {
                url: '/volume',
                templateUrl: 'controllers/recycle/cloudvolume/volume.html',
                controller: 'RecycleVolumeCtrl',
                controllerAs: 'recycleVolume'
            })
            .state('app.recycle.snapshot', {
                url: '/snapshot',
                templateUrl: 'controllers/recycle/cloudsnapshot/snapshot.html',
                controller: 'RecycleSnapshotCtrl',
                controllerAs: 'recycleSnapshot'
            });
        $urlRouterProvider.otherwise('/notFound');
    }]);
