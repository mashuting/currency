/**
 * Created by yanjianbo
 * Author: yanshiyi1983@163.com
 * Date: 2016-07-12
 * Description: Account App
 */

'use strict';

angular.module("CurrencyApp", [
    "ui.router",
    "ui.bootstrap",
    "oc.lazyLoad",
    "ngSanitize",
    "ngTable",
    "ngResource",
    "ngCookies",
    "ngBootbox",
    "ngLodash",
    "currency.services",
    "currency.resources",
    "currency.directives"
]).config(['$resourceProvider', function ($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]).config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({});
}]).config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol("{{");
    $interpolateProvider.endSymbol("}}");
}]).config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    $httpProvider.interceptors.push('AuthInterceptor');
}]).controller('AppController', ['$scope', '$rootScope', function ($scope) {
    $scope.$on('$viewContentLoaded', function () {
        Metronic.initComponents(); 
    });
}]).controller('HeaderController', function ($scope, current_user, site_config) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initHeader(); 
    });
    $scope.current_user = current_user;
    $scope.site_config = site_config;
    $scope.is_current_app = function(name){
        return name == "currency";
    };
}).controller('SidebarController', ['$scope', 'current_user', function ($scope, current_user) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initSidebar(); 
    });
    $scope.current_user = current_user;
}]).controller('FooterController', ['$scope', 'site_config', function ($scope, site_config) {
    $scope.$on('$includeContentLoaded', function () {
        Layout.initFooter(); 
    });
    $scope.site_config = site_config;
    
}]).config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
         
        $urlRouterProvider.otherwise("/home/");

        $stateProvider
            .state('home', {
                url: "/home/",
                templateUrl: '/static/apps/currency/home/list.html',
                data: {pageTitle: '主页'},
                controller: "HomeController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/home/list.js",
                                "/static/apps/currency/home/profile.css",
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    },
                    exchangeRate: function (ExchangeRate) {
                        return ExchangeRate.get().$promise;
                    },
                }
            }).state('directly-fans', {
                url: "/directly-fans/",
                templateUrl: '/static/apps/currency/directly_fans/list.html',
                data: {pageTitle: '直属粉丝列表'},
                controller: "DirectlyFansController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/directly_fans/list.js",
                                "/static/apps/currency/all_fans/list.css",
                                "/static/apps/currency/all_fans/jsmind/style/jsmind.css",
                                "/static/apps/currency/all_fans/jsmind/js/jsmind.js",
                                "/static/apps/currency/all_fans/jsmind/js/jsmind.draggable.js",
                                "/static/apps/currency/all_fans/jsmind/js/jsmind.screenshot.js"
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    }
                }
            }).state('all-fans', {
                url: "/all-fans/",
                templateUrl: '/static/apps/currency/all_fans/list.html',
                data: {pageTitle: '全体粉丝列表'},
                controller: "AllFansController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/all_fans/list.js",
                                "/static/apps/currency/all_fans/list.css",
                                "/static/apps/currency/all_fans/d3.v3.min.js"
                            ]
                        });
                    }],
                }
            }).state('create-fans', {
                url: "/create-fans/",
                templateUrl: '/static/apps/currency/create_fans/list.html',
                data: {pageTitle: '粉丝注册／AP点转账'},
                controller: "FansCreateController as createCtrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/create_fans/list.js",
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    },
                    systemGivenCoupons: function (SystemGiveCouponCount, current_user) {
                        return SystemGiveCouponCount.get({id: current_user.id}).$promise;
                    },
                    userGivenCoupons: function (UserGiveCouponCount, current_user) {
                        return UserGiveCouponCount.get({id: current_user.id}).$promise;
                    }
                }
            }).state('personal', {
                url: "/personal/",
                templateUrl: '/static/apps/currency/personal/list.html',
                data: {pageTitle: '易物点管理'},
                controller: "PersonalController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/personal/list.js",
                                "/static/apps/currency/sale_currency/echarts.min.js",
                                "/static/apps/currency/personal/list.css",
                                "/static/apps/currency/home/profile.css",
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    },
                    exchangeRate: function (ExchangeRate) {
                        return ExchangeRate.get().$promise;
                    },
                    saleCoupon: function (Coupon) {
                        return Coupon.getSaleCoupon().$promise;
                    },
                    purchaseCoupon: function (Coupon) {
                        return Coupon.getPurchaseCoupon().$promise;
                    },
                }
            }).state('sale-currency', {
                url: "/sale-currency/",
                templateUrl: '/static/apps/currency/sale_currency/list.html',
                data: {pageTitle: '出售点管理'},
                controller: "SaleCurrencyController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/sale_currency/list.js",
                                "/static/apps/currency/sale_currency/echarts.min.js",
                                "/static/apps/currency/personal/list.css"
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    },
                    exchangeRate: function (ExchangeRate) {
                        return ExchangeRate.get().$promise;
                    },
                    saleCouponCount: function (Coupon) {
                        return Coupon.getSaleCouponCount().$promise;
                    },
                }
            }).state('purchase-currency', {
                url: "/purchase-currency/",
                templateUrl: '/static/apps/currency/purchase_currency/list.html',
                data: {pageTitle: '购买易物点'},
                controller: "PurchaseCurrencyController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/purchase_currency/list.js",
                                "/static/apps/currency/sale_currency/echarts.min.js",
                                "/static/apps/currency/personal/list.css"
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    },
                    exchangeRate: function (ExchangeRate) {
                        return ExchangeRate.get().$promise;
                    },
                }
            }).state('information', {
                url: "/information/",
                templateUrl: '/static/apps/currency/information/list.html',
                data: {pageTitle: '个人资料'},
                controller: "InformationController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/information/list.js",
                                "/static/apps/currency/information/profile.css",
                            ]
                        });
                    }],
                    user: function (User, current_user) {
                        return User.get({id: current_user.id}).$promise;
                    }
                }
            }).state('fans', {
                url: "/fans/",
                templateUrl: '/static/apps/currency/fans/list.html',
                data: {pageTitle: '粉丝管理'},
                controller: "FansController",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/fans/list.js",
                            ]
                        });
                    }]
                }
            }).state('configuration', {
                url: "/configuration/",
                templateUrl: '/static/apps/currency/configuration/list.html',
                data: {pageTitle: '配置参数'},
                controller: "ConfigurationController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/configuration/list.js",
                            ]
                        });
                    }],
                    exchangeRate: function (ExchangeRate) {
                        return ExchangeRate.get().$promise;
                    },
                    systemGiveCouponCount: function (SystemGiveCouponCount) {
                        return SystemGiveCouponCount.get().$promise;
                    },
                    userGiveCouponCount: function (UserGiveCouponCount) {
                        return UserGiveCouponCount.get().$promise;
                    },
                    giveCouponCount: function (GiveCouponCount) {
                        return GiveCouponCount.get().$promise;
                    },
                    sellPresent: function (SellPresent) {
                        return SellPresent.get().$promise;
                    },
                    maxExchangeRate: function (MaxExchangeRate) {
                        return MaxExchangeRate.get().$promise;
                    },
                    exchangeTimes: function (ExchangeTimes) {
                        return ExchangeTimes.get().$promise;
                    },
                    protectTime: function (ProtectTime) {
                        return ProtectTime.get().$promise;
                    },
                }
            }).state('credits-detail', {
                url: "/credits-detail/",
                templateUrl: '/static/apps/currency/credits/detail.html',
                data: {pageTitle: '回馈积分查询'},
                controller: "CurrencyDetailController as ctrl",
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/credits/detail.js",
                            ]
                        });
                    }]
                }
            }).state('exchange-rates', {
                url: "/exchange-rates/",
                templateUrl: '/static/apps/currency/layout/unfinished.html',
                data: {pageTitle: '汇率名单'},
                resolve: {
                    deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'CurrencyApp',
                            insertBefore: '#ng_load_plugins_before',
                            files: [
                                "/static/apps/currency/layout/error.css",
                            ]
                        });
                    }]
                }
            });
    }]
).run(["$rootScope", "settings", "$state", "$http", "$cookies", "$interval", 
    function ($rootScope, settings, $state, $http, $cookies, $interval) {

        $http.defaults.headers.common['X-CSRFToken'] = $cookies['csrftoken'];
        $rootScope.$state = $state;
        $rootScope.timer_list = [];
        var callbacks = [];

        $rootScope.executeWhenLeave = function (callback) {
            callbacks.push(callback);
        };

        $rootScope.setInterval = function (func, interval) {
            var timer = $interval(func, interval);
            $rootScope.executeWhenLeave(function () {
                $interval.cancel(timer);
            });
        };

        $rootScope.$on("$stateChangeStart", function (e, toState, toParams, fromState, fromParams) {
            while ($rootScope.timer_list.length > 0) {
                var t = $rootScope.timer_list.pop();
                $interval.cancel(t);
            }

            angular.forEach(callbacks, function (callback) {
                callback();
            });

            callbacks = [];
        });
    }]);
