(function(angular){
   'use strict;'

    angular.module("CurrencyApp")
        .controller('InformationController', ListController)

    function ListController($scope, $state, $modal, site_config, sprintf, Toolkit, user){
        var ctrl = this;
        ctrl.user = user;
    }
}(angular));