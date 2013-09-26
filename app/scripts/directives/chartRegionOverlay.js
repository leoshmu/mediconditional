'use strict';

angular.module('mediconditionalApp')
  .directive('chartRegionOverlay', function () {
    return {
      restrict: 'EA',
      template:"<div ng-transclude></div>",
      transclude: true,
      link: function postLink(scope, element, attrs) {
        element.bind('mouseenter', function(){
        	element.addClass('partial-opacity')
        })
        element.bind('mouseleave', function(){
        	element.removeClass('partial-opacity')
        })
      }
    };
  });
