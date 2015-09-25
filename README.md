# angular-scroll-spy

A simple, lightweight scroll-spy directive for angular that was built from scratch. It broadcasts events as elements are scrolled into or out of view.

### [Try the demo](http://inorganik.github.io/angular-scroll-spy/)

## Usage

Add the `scroll-spy` attribute and an `id` on the element you want to receive a scroll event for. 

- `'elementFirstScrolledIntoView'` is fired once when the element first scrolls into view
- `'elementScrolledIntoView'` is fired every time the element scrolls into view
- `'elementScrolledOutOfView'` is fired every time the element is scrolled out of view

Then in your controller, you can respond to events like this:

```js
$scope.$on('elementFirstScrolledIntoView', function (event, data) {
  if (data === 'myElementId') {
    // do something
  }
});
```
