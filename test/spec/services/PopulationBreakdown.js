'use strict';

describe('Service: PopulationBreakdown', function () {

  // load the service's module
  beforeEach(module('mediconditionalApp'));

  // instantiate service
  var PopulationBreakdown;
  beforeEach(inject(function(_PopulationBreakdown_) {
    PopulationBreakdown = _PopulationBreakdown_;
  }));

  it('should do something', function () {
    expect(!!PopulationBreakdown).toBe(true);
  });

});
