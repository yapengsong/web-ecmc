/**
 * Created by ZHL on 2016/4/7.
 */
'use strict';

angular.module('eayun.net')
    .service('NetPrivate', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var netPrivate = this;
        netPrivate.add = function (net) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/addnetwork', net, {$showLoading: true}).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        netPrivate.edit = function (net) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/modnetwork', net, {$showLoading: true}).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        netPrivate.delete = function (net) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/deletenetwork', {
                dcId: net.dcId,
                prjId: net.prjId,
                netId: net.netId,
                netName: net.netName,
                routeId: net.routeId,
                routeName: net.routeName,
                payType: net.payType
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        netPrivate.checkDelete = function (_netId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/checkfordel', {networkId: _netId})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        // TODO 清除网关的判断
        netPrivate.checkClearNet = function (_routeId) {
            var deferred = $q.defer();
            //deferred.reject("");
            $http.post('/api/ecmc/virtual/route/checkforclear', _routeId)
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        netPrivate.checkName = function (_prjId, _netName, _netId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/checknetworkname', {
                prjId: _prjId,
                netName: _netName,
                netId: _netId
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(!resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        netPrivate.getById = function (_netId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/getnetworkbyid', {netId: _netId}).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        netPrivate.querySubnetByNetId = function (_netId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/getsubnetlistbynetid', {netId: _netId})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        netPrivate.queryNotBindRouteNetwork = function (_prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/network/getnotbindroutenetwork', {prjId: _prjId})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
    }])
    .service('NetRouter', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var router = this;
        router.getById = function (_routeId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/getroutedetailbyid', {routeId: _routeId}).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        router.setGateway = function (route) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/setgateway', {
                    routeId: route.routeId,
                    routeName: route.routeName,
                    netId: route.netId,
                    dcId: route.dcId,
                    prjId: route.prjId
                }, {$showLoading: true})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        router.clearGateway = function (_routeId, _routeName, _dcId, _prjId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/removegateway', {
                routeId: _routeId,
                routeName: _routeName,
                dcId: _dcId,
                prjId: _prjId
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        router.querySubnetByRouterId = function (_routerId, _dcId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/queryroutesubnetwork', {
                    routeId: _routerId,
                    dcId: _dcId
                })
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        router.queryPMByRouterId = function (_routerId, _dcId,_prjId) {
            var deferred = $q.defer();
            var params = {};
            params['routeId'] = _routerId;
            params['dcId'] = _dcId;
            params['prjId'] = _prjId;
            //分页参数
            params['pageNumber'] = 0;
            params['pageSize'] = 10;
            $http.post('/api/ecmc/cloud/netWork/portmapping/list', {
                routeId : _routerId, dcId : _dcId, prjId : _prjId
                })
                .then(function (resp) {
                    deferred.resolve(resp.data.data);
                });
            return deferred.promise;
        };
        router.getSubnetList = function (dcId, prjId, routeId) {
            var deferred = $q.defer();
            $http.post('/api/cloud/subnetwork/getSubnetWorksByRouteId', {
                dcId: dcId,
                prjId: prjId,
                routeId: routeId
            }).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };
        router.getVmListBySubnetId = function (subnetId) {
            var deferred = $q.defer();
            $http.post('/api/cloud/vm/queryVmListBySubnetId', subnetId).then(function (response) {
                deferred.resolve(response.data);
            });
            return deferred.promise;
        };
        router.addPortMapping = function (_portMapping) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/netWork/portmapping/add', _portMapping).then(function (response) {
                if (response.data.code != SysCode.error) {
                    deferred.resolve(response.data);
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        };
        router.updatePortMapping = function (_portMapping) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/netWork/portmapping/update', _portMapping).then(function (response) {
                deferred.resolve(response.data)
            });
            return deferred.promise;
        };
        router.deletePortMapping = function (_dcId, _prjId, _portMapping) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/cloud/netWork/portmapping/delete', {
                dcId: _dcId,
                prjId: _prjId,
                portMappingId: _portMapping.pmId,
                resourceIp : _portMapping.resourceIp,
                resourcePort : _portMapping.resourcePort,
                destinyIp : _portMapping.destinyIp,
                destinyPort : _portMapping.destinyPort
            }).then(function (response) {
                deferred.resolve(response);
            });
            return deferred.promise;
        };
        router.checkName = function (_dcId, _prjId, name, id) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/checkroutename', {
                dcId: _dcId,
                prjId: _prjId,
                routeName: name,
                routeId: id
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(!resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        router.add = function (router) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/addroute', router, {$showLoading: true}).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        router.edit = function (router) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/updateroute', router, {$showLoading: true}).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        router.delete = function (route) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/deleteroute', {
                    dcId: route.dcId,
                    prjId: route.prjId,
                    routeId: route.routeId,
                    routeName: route.routeName
                })
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        router.detachSubnet = function (subnet, route) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/detachsubnet', {
                    routeId: route.routeId,
                    routeName: route.routeName,
                    subNetworkId: subnet.subnetId,
                    dcId: route.dcId,
                    prjId: route.prjId
                })
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        router.attachSubnet = function (route, subnetId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/attachsubnet', {
                    routeId: route.routeId,
                    routeName: route.routeName,
                    subNetworkId: subnetId,
                    dcId: route.dcId,
                    prjId: route.prjId
                }, {$showLoading: true})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        router.canAttachSubnet = function (_dcId, _prjId, _netWorkId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/getnotbinroutesubnetlist', {
                    dcId: _dcId,
                    prjId: _prjId,
                    netWorkId: _netWorkId
                })
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        router.checkResourcePort = function ( _routeId, _resourcePort, _protocol, _pmId){
            return $http.post('/api/ecmc/cloud/netWork/portmapping/checkresourceport', {
                routeId: _routeId,
                protocol: _protocol,
                pmId: _pmId,
                resourcePort: _resourcePort
            }).then(function (response) {
                return response.data;
            });
        };
        router.checkDetachSubnet = function (_subnetId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/checkDetachSubnet', _subnetId).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        // TODO 清除网管的判断
        router.checkClearNet = function (_routeId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/route/checkforclear', _routeId)
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
    }])
    .service('NetSubnet', ['$http', '$q', 'SysCode', function ($http, $q, SysCode) {
        var subnet = this;
        subnet.checkName = function (_dcId, _prjId, name, id) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/checksubnetworkname', {
                dcId: _dcId,
                prjId: _prjId,
                subnetName: name,
                subnetId: id
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(!resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        subnet.add = function (_dcId, _prjId, name, cidr, networkId, _subnetType, _dns) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/addsubnetwork', {
                    dcId: _dcId,
                    prjId: _prjId,
                    subnetName: name,
                    cidr: cidr,
                    netId: networkId,
                    dns: _dns,
                    subnetType: _subnetType
                }, {$showLoading: true})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                }, function(response){
                    deferred.reject(response.data.code);
                });
            return deferred.promise;
        };
        subnet.edit = function (_dcId, _prjId, name, id, _dns, _subnetType) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/updatesubnetwork', {
                    dcId: _dcId,
                    prjId: _prjId,
                    subnetName: name,
                    subnetId: id,
                    dns: _dns || undefined,
                    subnetType: _subnetType
                }, {$showLoading: true})
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                },function (response) {
                    deferred.reject(response.data.code);
                });
            return deferred.promise;
        };
        subnet.delete = function (subnet) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/deletesubnetwork', {
                dcId: subnet.dcId,
                prjId: subnet.prjId,
                subnetId: subnet.subnetId,
                subnetName: subnet.subnetName,
                subnetType: subnet.subnetType
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        subnet.checkForDel = function (subnet) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/checkfordel', {
                subnetId : subnet.subnetId,
                subnetType : subnet.subnetType
            }).then(function (resp) {
                switch (resp.data.respCode) {
                    case SysCode.error:
                        deferred.reject(resp.data.message);
                        break;
                    case  SysCode.success:
                        deferred.resolve(resp.data.data);
                        break;
                    default:
                        deferred.reject();
                        break;
                }
            });
            return deferred.promise;
        };
        subnet.checkCidrByNetworkId = function (cidr, networkId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/checksubnetipbynet', {
                    subnetIP: cidr,
                    netId: networkId
                })
                .then(function (resp) {
                    switch (resp.data.respCode) {
                        case SysCode.error:
                            deferred.reject(resp.data.message);
                            break;
                        case  SysCode.success:
                            deferred.resolve(resp.data.data);
                            break;
                        default:
                            deferred.reject();
                            break;
                    }
                });
            return deferred.promise;
        };
        subnet.getDnsByDcId = function (_dcId) {
            var deferred = $q.defer();
            $http.post('/api/ecmc/virtual/subnetwork/getdatacenter', {
                dcId: _dcId
            }).then(function(response){
                deferred.resolve(response.data.datacenter.dcDns);
            });
            return deferred.promise;
        };
    }]);