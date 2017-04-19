'use strict'

angular.module('eayun.quotatemp')
    .controller('TemplateDetailCtrl', ['$scope', 'QuotaTemplateService','template', function ($scope, QuotaTemplateService, template) {
        var vm =this;
        vm.template = angular.copy(template);
    }]);