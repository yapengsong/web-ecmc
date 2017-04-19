/**
 * Created by Administrator on 2016/8/18 0018.
 */

angular.module('eayun.customer')
    .controller('CusPostPaidDetailCtrl', ['eayunModal', '$state', '$stateParams', '$http',
        function (eayunModal, $state, $stateParams, $http) {
            var that = this;

            that.cusId = $stateParams.cusId;

            //var list = eayunStorage.get('navLists');
            //list.length=0;
            //list.push({route:'app.costcenter.guidebar.report.postpay',name:'费用中心'});
            //list.push({route:'app.costcenter.guidebar.report.postpay',name:'费用报表详情'});

            $http.post("/api/ecmc/customer/getpostpaydetail", {"id": $stateParams.id}).then(function (data) {
                that.model = data.data;
            });
        }])
