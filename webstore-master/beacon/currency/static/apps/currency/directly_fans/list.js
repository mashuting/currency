(function(angular) {

    'use strict;'

    angular.module("CurrencyApp")
        .controller('DirectlyFansController', ListController);

    function ListController($state, User, current_user) {
        var ctrl = this;

        var _jm = null;
        var fansData = [{"id": current_user.username, "isroot": true, "topic": current_user.username}, ];
        User.getFans({user: current_user.username}, function (data) {
            data.forEach(function (user) {
                fansData.push({"id": user, "parentid": current_user.username, "topic": user})
            });
            load_jsmind();
        });

        function load_jsmind() {
            var mind = {
                meta: {
                    name: 'demo',
                    author: 'hizzgdev@163.com',
                    version: '0.2'
                },
                format: 'node_array',
                data: fansData
            };
            var options = {
                container: 'jsmind_container',
                editable: false,
                theme: 'primary',
                shortcut: {
                    mapping: {
                        test: 89
                    }
                }
            }
            _jm = jsMind.show(options, mind);
            // jm.set_readonly(true);
            // var mind_data = jm.get_data();
            // alert(mind_data);
        }
    }
}(angular));
