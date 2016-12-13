Angular jStore
================

The `angular-jstore` module provides a convenient wrapper for to storing data in HTML5 localStorage, in the client browser. 

How to use angular jstore
-----

- Add `angular` and `angular-jstore` to your code:

```html
<script src="angular.js"></script>
<script src="angular-jstore.js"></script>
```

- Add a dependency to the `angular-jstore` module in your application.

```js
var app = angular.module('myApp', ['angular-jstore']);
```

- Setting a prefix for the session name (OPTIONAL)

```js
var app = angular.module('myApp', ['angular-jstore']);

// Jstore Provider
app.config(['$jstoreProvider', function ($jstoreProvider) {
    $jstoreProvider.setPrefix('appDemo');
}]);
```

- For testing follow the example:

```js
app.controller("DemoCtrl", ['$scope', '$jstore', function($scope, $jstore) {

	// Session name
	var SESSION_NAME = "SessionTest";

	// Add data in session localStorage
	$jstore.set(SESSION_NAME, { year: "2015" });

	// Display the value in the console
	console.log($jstore.get(SESSION_NAME).year);

	// Change session data
	$jstore.set(SESSION_NAME, { year: "2016" });

	// Display the value in the console
	console.log($jstore.get(SESSION_NAME).year);

	// Personal data
	var personalData = {
		"firstName": "Giovanni",
		"lastName": "Ramos",
		"age": "34",
	};

	// Add more data in session
	$jstore.set(SESSION_NAME, personalData);

	// Add Array data in session
	$jstore.set(SESSION_NAME, { magazine: [ "FORBES", "VOGUE" ] });

	// Check if you have data in session
	var hasData = $jstore.has(SESSION_NAME);

	// Recover data from session
	var data = $jstore.get(SESSION_NAME);

	// Displays the values in the console
	console.log(data.firstName);
	console.log(data.magazine[0]);

	// Count total sessions created
	var count = $jstore.count();

	// Displays data for all created sessions
	$jstore.each(function(k, v) {
		console.log(k,':',v);
	});

	// Clears data from a specific session in localStorage
	$jstore.remove(SESSION_NAME);

	// Clears all data from the localStorage
	$jstore.clear();

}]);
```

License
-----

Released under the terms of MIT License.

See [MIT license](http://opensource.org/licenses/MIT "MIT License")