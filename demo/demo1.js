/*jshint strict:false, node:true */

var app = angular.module('myAppDemo', ['angular-jstore']);

// JStore provider
app.config(['$jstoreProvider', function ($jstoreProvider) {
    $jstoreProvider.setPrefix('MyDemo_');
}]);

// Demo1Ctrl
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