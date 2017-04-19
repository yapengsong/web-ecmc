'use strict'

angular.module('eayun.quotatemp')
    .controller('TemplateSaveCtrl', ['$scope', 'QuotaTemplateService','template', function ($scope, QuotaTemplateService, template) {
        var vm =this;
        vm.template = angular.copy(template);

        $scope.commit = function (){
            $scope.ok(vm.template);
        };

        vm.checkName = function(qtId, qtName){
           return QuotaTemplateService.checkQuotaTemplateName(qtId, qtName);
        };
        
        vm.checkSGNum = function () {
            if(vm.template.safeGroup<3){
                vm.template.safeGroup = 3;
            }
        }
    }]);