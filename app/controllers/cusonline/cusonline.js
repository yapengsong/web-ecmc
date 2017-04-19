angular.module('eayun.cusonline')
    .controller('CusonlineCtrl', ['cusonlineService', 'eayunModal','toast', function (cusonlineService, eayunModal,toast) {
        var vm = this;
        vm.cusCount = {};

        cusonlineService.getNowTime().then(function(time){
            vm.nowtime = time;
        });
        cusonlineService.getOLCusAmount().then(function (data) {
            vm.cusCount = data.data;
        });
        vm.cusonlineTable = {
            source: '/api/ecmc/syssetup/ol/getpagedolcuslist',
            api: {},
            getParams: function () {
                return {
                };
            }
        };
        vm.refreshData = function () {
            cusonlineService.getNowTime().then(function(time){
                vm.nowtime = time;
            });
            vm.cusonlineTable.api.draw();
            cusonlineService.getOLCusAmount().then(function (data) {
                vm.cusCount = data.data;
            });
        }
        vm.exportCusExcel = function () {
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
            $("#file-export-iframe").attr("src", "/api/ecmc/syssetup/ol/exportolstatistics2excel.do?browser=" + browser);
        };
    }]);