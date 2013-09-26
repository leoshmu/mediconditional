
// inject ability to use html in popovers
// code taken from https://github.com/angular-ui/bootstrap/pull/641/files
// and added manually
angular.module( 'ui.bootstrap.popover', [ 'ui.bootstrap.tooltip' ] )
.directive( 'popoverHtmlUnsafePopup', function () {
  return {
    restrict: 'E',
    replace: true,
    scope: { title: '@', content: '@', placement: '@', animation: '&', isOpen: '&' },
    templateUrl: 'template/popover/popover-html-unsafe-popup.html'
  };
})
.directive( 'popoverHtmlUnsafe', [ '$tooltip', function ( $tooltip ) {
  return $tooltip( 'popoverHtmlUnsafe', 'popover', 'click' );
}]);

angular.module("template/popover/popover-html-unsafe-popup.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/popover/popover-html-unsafe-popup.html",
    "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
    "  <div class=\"arrow\"></div>\n" +
    "\n" +
    "  <div class=\"popover-inner\">\n" +
    "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
    "      <div class=\"popover-content\" ng-bind-html-unsafe=\"content\"></div>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("ui.bootstrap.tpls", ["template/popover/popover-html-unsafe-popup.html"]);