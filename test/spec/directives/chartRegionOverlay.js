'use strict';

describe('Directive: chartRegionOverlay', function () {

  // load the directive's module
  beforeEach(module('mediconditionalApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<chart-region-overlay></chart-region-overlay>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the chartRegionOverlay directive');
  }));
});
