/**
 * Created by ZHL on 2017/1/18.
 */
'use strict';

angular.module('eayun.ui.components')
/**
 * @ngdoc directive
 * @name eayunApp.directive:wysiwyg
 * @description
 * 所见即所得--富文本编辑器
 */
    .directive('wysiwyg', [function () {
        return {
            restrict: 'E',
            template: '<div class="wysiwyg"></div>',
            scope: {
                content: '='
            },
            link: function postLink(scope, element) {
                var trumbowyg = $(element.find('.wysiwyg')).trumbowyg({
                    lang: 'zh_cn',
                    btns: [
                        ['viewHTML'],
                        ['formatting'],
                        'btnGrp-semantic',
                        ['superscript', 'subscript'],
                        ['link'],
                        ['insertImage'],
                        'btnGrp-justify',
                        'btnGrp-lists',
                        ['horizontalRule'],
                        ['removeformat']
                    ]
                });
                trumbowyg.on('tbwblur',function() {
                    scope.$apply(function () {
                        scope.content = trumbowyg.trumbowyg('html');
                    });
                });
                trumbowyg.trumbowyg('html',scope.content);
            }
        };
    }])
    .run(function () {
        $.trumbowyg.svgPath = '/images/trumbowyg/icons.svg';
    });
