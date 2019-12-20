
var app = angular.module('myAppDemo', ['angular-jstore']);

// JStore provider
app.config(['$jstoreProvider', function ($jstoreProvider) {
    $jstoreProvider.setPrefix('MyAppDemo_');
}]);

// Demo1Ctrl
app.controller('Demo1Ctrl', ['$scope', '$window', '$jstore', function($scope, $window, $jstore) {

    var vm = $scope;

    // Check browser support for localStorage
    if (!$jstore.isSupported) {
        alert('Your browser does not support HTML5 Web Storage. Please upgrade to a modern browser.');
        angular.element('body').empty();
        return;
    }

    // Add data in session localStorage
    $jstore.set('MySessionName', { year: '2016' });

    // Display the value in the console
    console.log($jstore.get('MySessionName').year);

    // Change session data
    $jstore.set('MySessionName', { year: '2017' });

    // Display the value in the console
    console.log($jstore.get('MySessionName').year);

    // Personal data
    var personalData = {
        'firstName': 'John',
        'lastName': 'Doe',
        'age': '35',
        'gender': 'male',
        'profession': 'Programmer'
    };

    // Add more data in session
    $jstore.set('MySessionName', personalData);

    // Add Array data in session
    $jstore.set('MySessionName', { magazine: ['FORBES', 'VOGUE'] });

    // Deletes from the session the pair-value by the keys
    $jstore.del('MySessionName', 'profession', 'gender');

    // Deletes from session all pairs-value except for the keys
    $jstore.omit('MySessionName', 'firstName', 'year', 'magazine');

    // Check if you have data in session
    var hasData = $jstore.has('MySessionName');

    // Recover data from session
    var data = $jstore.get('MySessionName');

    // Displays the values in the console
    console.log(data.firstName);
    console.log(data.magazine[0]);

    // Count total sessions created
    var count = $jstore.count();

    // Displays data for all created sessions
    $jstore.each(function (k, v) {
        console.log(k, ':', v);
    });

    // Clears data from a specific session in localStorage
    $jstore.remove('MySessionName');

    // Clears all data from the localStorage
    $jstore.clear();

}]);