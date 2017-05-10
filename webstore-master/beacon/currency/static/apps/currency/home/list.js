(function(angular){
   'use strict;'

    angular.module("CurrencyApp")
        .controller('HomeController', ListController)

    function ListController($scope, $state, $modal, site_config, sprintf, Toolkit, user, exchangeRate){
        var ctrl = this;
        ctrl.user = user;
        ctrl.exchangeRate = exchangeRate.results[0];
        ctrl.language = '中文';
        ctrl.languages = ['中文'];

    }
}(angular));