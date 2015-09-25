(function (angular) {

	'use strict';

	// Scroll Spy Directive
	// ===============================
	//
	// * **Class:** scrollSpy
	// * **Author:** Jamie Perkins
	//
	// $broadcast an event when an element comes into or goes out of view:
	//
	// 'elementFirstScrolledIntoView' is fired once when the element first scrolls into view
	// 'elementScrolledIntoView' is fired every time the element scrolls into view
	// 'elementScrolledOutOfView' is fired every time the element is scrolled out of view

	var module = angular.module('scrollSpyModule', []);

	module.directive('scrollSpy', ['$window', '$rootScope', '$log', function ($window, $rootScope, $log) {

		return {
			restrict: 'A',
			link: function ($scope, $el, $attrs) {
				
				function ScrollSpy() {
					//$log.debug('scrollSpy set for '+$attrs.id);

					var self = this,
						initialized = false,
						viewportHeight,
						elementHeight,
						topOffset,
						elementFirstScrolledIntoView = false,
						elementScrolledIntoView = false,
						elementScrolledOutOfView = false,
						doc = document.documentElement,
						id = $attrs.id || 'unknown element',
						target = document.getElementById(id),
						viewportShorterThanElement = false,
						percentOfElementNeededInView = 1;

					// onscroll
					this.determinePosition = function() {
						if (initialized) {
							var pos = (window.pageYOffset || doc.scrollTop);
							
							// element Scrolled Out Of View
							if (!elementScrolledOutOfView) {
								if (pos + viewportHeight < topOffset || pos > topOffset + elementHeight) {
									// $log.debug('element Scrolled Out Of View '+id);
									elementScrolledOutOfView = true;
									elementScrolledIntoView = false;
									$rootScope.$broadcast('elementScrolledOutOfView', id);
								}
							}
							if ((pos + viewportHeight >= topOffset + percentOfElementNeededInView * elementHeight && topOffset > pos) || 
								(pos >= topOffset && viewportShorterThanElement)) {
								// element First Scrolled Into View
								if (!elementFirstScrolledIntoView) {
									// $log.debug('element First Scrolled Into View '+id);
									elementFirstScrolledIntoView = true;
									$rootScope.$broadcast('elementFirstScrolledIntoView', id);
								}
								// element Scrolled Into View
								if (!elementScrolledIntoView) {
									// $log.debug('element Scrolled Into View '+id);
									elementScrolledIntoView = true;
									elementScrolledOutOfView = false;
									$rootScope.$broadcast('elementScrolledIntoView', id);
								}
							}
						}
					}
					this.takeMeasurements = function() {
						viewportHeight = $window.innerHeight;
						elementHeight = target.offsetHeight;
						topOffset = target.offsetTop;
						// $log.debug('take measurements for '+$attrs.id+'- viewportHeight:'+viewportHeight+', element height: '+elementHeight+', top offset: '+topOffset);
						if (viewportHeight < elementHeight) viewportShorterThanElement = true;
						
						// determine position on page load
						initialized = true;
						self.determinePosition();
					}
					// wait for dom to render so correct measurements can be taken
					var waitForRender = setInterval(function() {
						if (target.offsetHeight > 2) { // IE11  reports 2 at times...
							clearTimeout(waitForRender);
							self.takeMeasurements();
						}
					}, 50);
				}

				var name = $attrs.id + '-scrollSpy';
				$rootScope[name] = new ScrollSpy();

				// global onscroll fns array
				if (!$rootScope.globalOnScrollFunctions) {
					$rootScope.globalOnScrollFunctions = [];
				}
				$rootScope.globalOnScrollFunctions.push($rootScope[name]);

				// set up global onscroll function that will call each fn in global onscroll fns
				if (!$rootScope.globalOnScroll) {
					$rootScope.globalOnScroll = function() {
						angular.forEach($rootScope.globalOnScrollFunctions, function (val, key) {
							val.determinePosition();
						});
					}
					// on scroll
					$window.onscroll = $rootScope.globalOnScroll;
				}
			}
		}
	}]);

})(angular);