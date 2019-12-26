# Angular jStore

The `angular-jstore` module provides a convenient wrapper for to storing JSON objects in the client browser with HTML5 localStorage.

And now it has Broadcast Channel support for sending data between different browser tabs.


## Install with package managers

#### via bower:
```
$ bower install angular-jstore --save
```
#### via npm:
```
$ npm install angular-jstore --save
```


## How to use angular jstore

* Add `angular.min.js` and `angular-jstore.min.js`(from the [dist](https://github.com/giovanniramos/angular-jstore/tree/master/dist) directory) to your code:

```html
<script src="//ajax.googleapis.com/ajax/libs/angularjs/1.7.9/angular.min.js"></script>
<script src="angular-jstore.min.js"></script>
```

* Add a dependency to the `angular-jstore` module in your application.

```js
var app = angular.module('myAppDemo', ['angular-jstore']);
```

* Setting a prefix for the session name (OPTIONAL)

```js
// Jstore Provider
app.config(['$jstoreProvider', function ($jstoreProvider) {
    $jstoreProvider.setPrefix('MyDemo_');
}]);
```

* To test see the example below:

```js
app.controller('Demo1Ctrl', ['$scope', '$window', '$jstore', function($scope, $window, $jstore) {

    var vm = $scope;

    // Check browser support for localStorage
    if (!$jstore.isSupported) {
        $window.alert('Your browser does not support HTML5 Web Storage. Please upgrade to a modern browser.');
        angular.element('body').empty();
        return;
    }

    // Personal data
    var personalData = {
        'firstName': 'John',
        'lastName': 'Doe',
        'age': '35',
        'gender': 'male',
        'profession': 'Programmer'
    };

    // Add data to session localStorage
    $jstore.set('MySessionName', personalData);

    // Add more data in the same session
    $jstore.set('MySessionName', { year: '2016' });

    // Change data in session
    $jstore.set('MySessionName', { year: '2017' });

    // Add data from an array to the session
    $jstore.set('MySessionName', { magazine: ['FORBES', 'VOGUE'] });

    // Deletes from the session the pair-value by the keys
    $jstore.del('MySessionName', 'profession', 'gender');

    // Deletes from the session all pair values except those with the following keys
    $jstore.omit('MySessionName', 'firstName', 'year', 'magazine');

    // Recover data from session
    var data = $jstore.get('MySessionName');

    // Stores the recovered session data
    vm.localStorageData = data;

    // View the values in the console
    console.log($jstore.get('MySessionName').year);
    console.log(data.firstName);
    console.log(data.magazine[0]);

    // Checks if you have data in session
    //var hasData = $jstore.has('MySessionName');

    // Counts the total sessions created
    //var totalSessions = $jstore.count();

    // Displays data of created sessions
    $jstore.each(function (k, v) {
        console.log(k, ':', v);
    });

    // Deletes a specific session from localStorage
    $jstore.remove('MySessionName');

    // Deletes all sessions created in localStorage
    //$jstore.remove();

}]);
```

### Broadcast Channel Support

Tested in Chrome and Firefox.


### Console Output

![Console](http://i.imgur.com/9jixWRT.png)


## License

Released under the terms of MIT License.

See [MIT license](http://opensource.org/licenses/MIT "MIT License")