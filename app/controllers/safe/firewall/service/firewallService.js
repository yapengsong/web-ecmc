/**
 * Created by eayun on 2016/4/17.
 */
'use strict'

angular.module('eayun.safe')
    .service('FwService', ['$http', function ($http) {
        var fwService = {};

        fwService.getAllProjectList = function () {
            return $http.post('/api/ecmc/overview/getallprojectlist').then(function (response) {
                return response.data;
            });
        };

        fwService.getDcResourceList = function () {
            return $http.post('/api/ecmc/overview/getalldclist').then(function (response) {
                return response.data;
            });
        };
        
        fwService.getFwOne = function (_id) {
            return $http.post('/api/ecmc/virtual/cloudfirewall/getFwByIdDetail', {id: _id}).then(function (response) {
                return response.data;
            });
        };

        fwService.checkFireWallName = function (_fwModel) {
            return $http.post('/api/ecmc/virtual/cloudfirewall/checkFirewallName', {
                fwName: _fwModel.fwName,
                fwId: _fwModel.fwId,
                projectId: _fwModel.prjId,
                datacenterId: _fwModel.dcId
            }).then(function (response) {
                if (response.data.data == true) {
                    return false;
                } else {
                    return true;
                }
            });
        };

        fwService.addFirewall = function (_firewall) {
            return $http.post('/api/ecmc/virtual/cloudfirewall/createFwAndPoliyAndRule', _firewall).then(function (response) {
                return response.data;
            });
        };

        fwService.editFirewall = function (_firewall) {
            return $http.post('/api/ecmc/virtual/cloudfirewall/updateFireWall', _firewall).then(function (response) {
                return response.data;
            });
        };

        fwService.deleteFirewall = function (_ids) {
            return $http.post('/api/ecmc/virtual/cloudfirewall/deleteFwAndPoliyAndRule', _ids).then(function (response) {
                return response.data;
            });
        };

        fwService.getFwPolicyList = function (fwModel) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/getFwpListByPrjId', {dcId:fwModel.dcId,prjId: fwModel.prjId}).then(function (response) {
                return response.data;
            });
        };
        fwService.getPolicyListByDcIdPrjId = function (fwModel) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/getPolicyListByDcIdPrjId', {dcId:fwModel.dcId,prjId: fwModel.prjId}).then(function (response) {
                return response.data;
            });
        };

        fwService.transferDataForCommit = function (_data) {
            var data = {
                id: _data.fwId != undefined ? _data.fwId : '',
                name: _data.fwName,
                policy: _data.fwpId,
                description: _data.description,
                datacenterId: _data.dcId,
                projectId: _data.prjId
            };
            return data;
        };
        fwService.transferDataForCommitFPR = function (_data) {
            var data = {
                id: _data.fwId != undefined ? _data.fwId : '',
                name: _data.fwName,
                fwname: _data.fwName,
                rulename: _data.fwrName,
                policy: _data.fwpId,
                description: _data.description,
                datacenterId: _data.dcId,
                projectId: _data.prjId,
                protocol:_data.protocol,
                source_port:_data.sourcePort,
                source_ip_address:_data.sourceIpaddress,
                destination_port:_data.destinationPort,
                destination_ip_address:_data.destinationIpaddress,
                ip_version:'4',
                action: _data.fwrAction
            };
            return data;
        };

        fwService.checkFwpName = function (_policyModel) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/checkFwPolicyName', {
                fwpName: _policyModel.fwpName,
                fwpId: _policyModel.fwpId,
                projectId:_policyModel.prjId,
                datacenterId: _policyModel.dcId
            }).then(function (response) {
                if (true == response.data.data) {
                    return false;
                } else {
                    return true;
                }
            });
        };

        fwService.getRuleListIsSelected = function (_fwpId) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/getByFwrId', {fwpid: _fwpId}).then(function (response) {
                return response.data;
            });
        };

        fwService.getRuleListToSelect = function (_prjId) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/getByFwrIdList', {projectId: _prjId}).then(function (response) {
                return response.data;
            });
        };

        fwService.addFirewallPolicy = function (_policy) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/createPolicy', _policy).then(function (response) {
                return response.data;
            });
        };

        fwService.editFirewallPolicy = function (_policy) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/updatePolicy', _policy).then(function (response) {
                return response.data;
            });
        };

        fwService.manageRuleForFirePolicy = function (_policy) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/editFwRule', _policy).then(function (response) {
                return response.data;
            })
        };

        fwService.deleteFirewallPolicy = function (_ids) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/deletePolicy', _ids).then(function (response) {
                return response.data;
            });
        };
        
        fwService.queryById = function (_id) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/queryById', {id:_id}).then(function (response) {
                return response.data;
            });
        };

        fwService.transferDataForPolicyCommit = function (_data) {
            var data = {
                id: _data.fwpId != undefined ? _data.fwpId : '',
                name: _data.fwpName,
                projectId: _data.prjId,
                datacenterId: _data.dcId,
                audited: _data.audited,
                description: _data.description
            };
            return data;
        };

        fwService.checkFwrName = function (_ruleModel) {
            return $http.post('/api/ecmc/virtual/cloudfwrule/checkFwRuleName', {
                fwrName: _ruleModel.fwrName,
                id: _ruleModel.fwrId,
                datacenterId: _ruleModel.dcId,
                projectId: _ruleModel.prjId
            }).then(function (response) {
                if (response.data.data) {
                    return false;
                } else {
                    return true;
                }
            });
        };

        fwService.checkIp = function (fwrCtrl, value, _flagName) {
            fwrCtrl[_flagName] = false;
            if ('' == value || null == value) {
                return true;
            }
            var str = new RegExp("^(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])\\.(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])$");
            var str2 = new RegExp("^\\d+$");
            var dipAdd = value;
            if (dipAdd == null || dipAdd == "" || dipAdd == undefined) {
                fwrCtrl[_flagName] = false;
            }
            else {
                if (dipAdd.indexOf("/") != -1) {
                    var strs = dipAdd.split("/");
                    if (strs.length > 2) {
                        fwrCtrl[_flagName] = true;
                        return false;
                    } else if (str.test(strs[0]) && str2.test(strs[1]) && strs[1] >= 1 && strs[1] <= 32) {
                        fwrCtrl[_flagName] = false;
                        return true;

                    } else if (str.test(strs[0]) && str2.test(strs[1]) && strs[1] == 0 && strs[0] == "0.0.0.0") {
                        //用于判断0.0.0.0/0过滤
                        fwrCtrl[_flagName] = false;
                        return true;
                    } else {
                        fwrCtrl[_flagName] = true;
                        return false;
                    }
                } else {
                    if (str.test(dipAdd)) {
                        fwrCtrl[_flagName] = false;
                        return true;
                    } else {
                        fwrCtrl[_flagName] = true;
                        return false;
                    }
                }
            }
        };

        fwService.checkPort = function (fwrCtrl, value, _flagName) {
            //源端口
            fwrCtrl[_flagName] = false;
            if ('' == value || null == value) {
                return true;
            }
            var str = new RegExp("^(^[1-9]\\d{0,3}$)|(^[1-5]\\d{4}$)|(^6[0-4]\\d{3}$)|(^65[0-4]\\d{2}$)|(^655[0-2]\\d$)|(^6553[0-5]$)$");
            var sourceport = value;
            if (sourceport == null || sourceport == "" || sourceport == undefined) {
                fwrCtrl[_flagName] = false;
            }
            else {
                if (sourceport.indexOf(":") != -1) {
                    var strs = sourceport.split(":");
                    if (strs.length > 2) {
                        fwrCtrl[_flagName] = true;
                        return false;
                    } else if (str.test(strs[0]) && str.test(strs[1])) {
                    	if(strs[0]*1<strs[1]*1){
                    		fwrCtrl[_flagName] = false;
                            return true;
                    	}else{
                    		fwrCtrl[_flagName] = true;
                            return false;
                    	}
                        
                    } else {
                        fwrCtrl[_flagName] = true;
                        return false;
                    }
                } else {
                    if (str.test(sourceport)) {
                        fwrCtrl[_flagName] = false;
                        return true;
                    } else {
                        fwrCtrl[_flagName] = true;
                        return false;
                    }
                }
            }
        };

        fwService.addFirewallRule = function (_rule) {
            return $http.post('/api/ecmc/virtual/cloudfwrule/createfwRule', _rule).then(function (response) {
                return response.data;
            });
        };

        fwService.editFirewallRule = function (_rule) {
            return $http.post('/api/ecmc/virtual/cloudfwrule/updatefwRule', _rule).then(function (response) {
                return response.data;
            });
        };

        fwService.deleteFirewallRule = function (_ids) {
            return $http.post('/api/ecmc/virtual/cloudfwrule/deletefwRule', _ids).then(function (response) {
                return response.data;
            });
        };

        fwService.getRuleModelById = function (_id) {
            return $http.post('/api/ecmc/virtual/cloudfwrule/getOne', {id: _id}).then(function (response) {
                return response.data;
            });
        };
        
        fwService.updateRuleSequence = function (_resultData) {
            return $http.post('/api/ecmc/virtual/cloudfwpoliy/updateRuleSequence', _resultData).then(function (response) {
                return response.data;
            });
        };
        
        fwService.isEnabled = function (_rule) {
            return $http.post('/api/ecmc/virtual/cloudfwrule/updateIsEnabled', _rule).then(function (response) {
                return response.data;
            });
        };

        fwService.transferDataForRuleCommit = function (_data) {
            var data = {
                name: _data.fwrName,
                protocol: _data.protocol,
                source_port: _data.sourcePort,
                source_ip_address: _data.sourceIpaddress,
                destination_port: _data.destinationPort,
                destination_ip_address: _data.destinationIpaddress,
                ip_version: '4',
                action: _data.fwrAction,
                //enabled: _data.fwrEnabled,
               //description: _data.description,
                datacenterId: _data.dcId,
                projectId: _data.prjId
            };
            return data;
        };

        return {
            getAllProjectList: fwService.getAllProjectList,
            getDcResourceList: fwService.getDcResourceList,
            checkFireWallName: fwService.checkFireWallName,
            addFirewall: fwService.addFirewall,
            editFirewall: fwService.editFirewall,
            deleteFirewall: fwService.deleteFirewall,
            getFwPolicyList: fwService.getFwPolicyList,
            getPolicyListByDcIdPrjId:fwService.getPolicyListByDcIdPrjId,
            transferDataForCommit: fwService.transferDataForCommit,
            checkFwpName: fwService.checkFwpName,
            getRuleListToSelect: fwService.getRuleListToSelect,
            getRuleListIsSelected: fwService.getRuleListIsSelected,
            addFirewallPolicy: fwService.addFirewallPolicy,
            editFirewallPolicy: fwService.editFirewallPolicy,
            manageRuleForFirePolicy: fwService.manageRuleForFirePolicy,
            deleteFirewallPolicy: fwService.deleteFirewallPolicy,
            transferDataForPolicyCommit: fwService.transferDataForPolicyCommit,
            checkFwrName: fwService.checkFwrName,
            checkIp: fwService.checkIp,
            checkPort: fwService.checkPort,
            addFirewallRule: fwService.addFirewallRule,
            editFirewallRule: fwService.editFirewallRule,
            deleteFirewallRule: fwService.deleteFirewallRule,
            getRuleModelById: fwService.getRuleModelById,
            transferDataForRuleCommit: fwService.transferDataForRuleCommit,
            getFwOne:fwService.getFwOne,
            transferDataForCommitFPR:fwService.transferDataForCommitFPR,
            updateRuleSequence:fwService.updateRuleSequence,
            queryById:fwService.queryById,
            isEnabled:fwService.isEnabled
        };
    }]);