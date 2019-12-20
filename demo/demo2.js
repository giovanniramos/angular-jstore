
var app = angular.module('myAppDemo', ['angular-jstore']);

// JStore provider
app.config(['$jstoreProvider', function ($jstoreProvider) {
    $jstoreProvider.setDebug(false);
    $jstoreProvider.setTabStatus(true);
}]);

// Tools provider
app.provider('$tools', [function $toolsProvider() {
    this.$get = function () {
        return {
            pad: function (x, n) {
                while (x.toString().length < n)
                    x = '0'+x;
                return x;
            },
            now: function () {
                var p = this.pad;
                var d = new Date();
                return  p(d.getHours(), 2) + ':' +
                        p(d.getMinutes(), 2) + ':' +
                        p(d.getSeconds(), 2) + ':' +
                        p(d.getMilliseconds(), 3);

            },
            log: function (str) {
                var now = this.now();
                var row = document.createElement('p');
                var log = document.querySelector('#console');
                row.appendChild(document.createTextNode(now + ' - ' + str));
                log.insertBefore(row, log.childNodes[0] || null);
            }
        };
    };
}]);

// Demo2Ctrl
app.controller('Demo2Ctrl', ['$scope', '$window', '$tools', '$jstore', function($scope, $window, $tools, $jstore) {

    var vm = $scope;

    // Check browser support for localStorage
    if (!$jstore.isSupported) {
        alert('Your browser does not support HTML5 Web Storage. Please upgrade to a modern browser.');
        angular.element('body').empty();
        return;
    }


    // Functions
    var Reload = function () {
        setTimeout(function() {
            window.location.reload();
        }, 3000);

        $tools.log('Reload in 3 seconds');
    };

    var Purchase = function () {
        if (!$jstore.check('purchase'))
            return;

        var btn = document.querySelector('#btn-purchase');
        btn.setAttribute('disabled', 'disabled');

        setTimeout(function() {
            if (btn.classList.contains('mui-btn--success')) {
                btn.classList.remove('mui-btn--success');
                btn.classList.add('mui-btn--danger');
            }

            btn.removeAttribute('disabled');

            $jstore.close('purchase');
        }, 3000);

        $tools.log('Purchase made!');
    };

    var LogOnOff = function () {
        var btn = document.querySelector('#btn-logonoff');
        if (btn.classList.contains('mui-btn--primary')) {
            btn.classList.remove('mui-btn--primary');
            btn.classList.add('mui-btn--dark');

            btn.querySelector('span').innerHTML = 'Logoff';

            $tools.log('Logoff');
        } else {
            btn.classList.remove('mui-btn--dark');
            btn.classList.add('mui-btn--primary');

            btn.querySelector('span').innerHTML = 'Login';

            $tools.log('Login');
        }
    };


    // Watchers for others tab
    $jstore.watch('reload', function () {
        Reload();
    });

    $jstore.watch('purchase', function (ev) {
        Purchase();
    });

    $jstore.watch('logonoff', function (ev) {
        LogOnOff();
    });


    // Triggers for current tab
    vm.fireReload = function () {
        Reload();
        $jstore.fire({ command: 'reload' });
    };

    vm.fireLogOnOff = function () {
        LogOnOff();
        $jstore.fire({ command: 'logonoff' });
    };

    vm.firePurchase = function () {
        Purchase();
        $jstore.fire({ command: 'purchase' });
    };

}]);