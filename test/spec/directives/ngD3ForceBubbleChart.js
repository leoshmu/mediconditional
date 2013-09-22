'use strict';

describe('Directive: ngD3ForceBubbleChart', function () {

  // load the directive's module
  beforeEach(module('mediconditionalApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-d3-force-bubble-chart></ng-d3-force-bubble-chart>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngD3ForceBubbleChart directive');
  }));
});
