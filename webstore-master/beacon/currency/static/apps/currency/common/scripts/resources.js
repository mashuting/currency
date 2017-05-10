angular.module('currency.resources', [])

.factory('User', ['$resource', function($resource){
    return $resource("/api/currency/users/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
            getFans: {isArray: true, params: {action: 'fans'}},
        });
}])
.factory('Coupon', ['$resource', function($resource){
    return $resource("/api/currency/coupon/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
            getSaleCouponCount: {isArray: false, params: {action: 'selling_coupons_count'}},
            getSaleCoupon: {isArray: true, params: {action: 'all_sale_coupon'}},
            getPurchaseCoupon: {isArray: true, params: {action: 'all_purchase_coupon'}},
            saleCoupon: {method: 'post', isArray: false, params: {action: 'sale_coupons'}},
            purchaseCoupon: {method: 'post', isArray: false, params: {action: 'purchase_coupons'}},
            personalSaleCoupon: {isArray: true, params: {action: 'personal_sale_coupon'}},
        });
}])
.factory('ExchangeRate', ['$resource', function($resource){
    return $resource("/api/currency/configParams/exchange_rate/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
            split: {isArray: false, method: 'post', params: {action: 'split'}},
        });
}]).factory('SystemGiveCouponCount', ['$resource', function($resource){
    return $resource("/api/currency/configParams/system_give_coupon_count/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('UserGiveCouponCount', ['$resource', function($resource){
    return $resource("/api/currency/configParams/user_give_coupon_count/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('GiveCouponCount', ['$resource', function($resource){
    return $resource("/api/currency/configParams/give_coupon_count/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('SellPresent', ['$resource', function($resource){
    return $resource("/api/currency/configParams/sell_present/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('MaxExchangeRate', ['$resource', function($resource){
    return $resource("/api/currency/configParams/max_exchange_rate/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('ExchangeTimes', ['$resource', function($resource){
    return $resource("/api/currency/configParams/exchange_times/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('ProtectTime', ['$resource', function($resource){
    return $resource("/api/currency/configParams/protect_time/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]).factory('MemberLevel', ['$resource', function($resource){
    return $resource("/api/currency/configParams/member_level/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
        });
}]);

/** template
.factory('Resource', ['$resource', function ($resource) {
    return $resource("/api/resources/:id/:action/", {id: '@id'},
        {
            query: {isArray: false},
            action-name: {method: 'POST', isArray:false, params: {action: 'action-name'}},
        }
    );
}]);
*/
