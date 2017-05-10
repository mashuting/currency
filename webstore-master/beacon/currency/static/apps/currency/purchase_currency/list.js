(function(angular) {

    'use strict;'

    angular.module("CurrencyApp")
        .controller('PurchaseCurrencyController', ListController);

        function ListController($modal, Toolkit, User, exchangeRate, Coupon, user) {
            var ctrl = this;
            ctrl.user = user;
            ctrl.exchangeRate = exchangeRate.results[0].value;

            ctrl.condition = {};
            ctrl.table = Toolkit.table.create({resource: Coupon, method: 'getSaleCoupon', condition: ctrl.condition});
            ctrl.logTable = Toolkit.table.create({resource: Coupon, method: 'getPurchaseCoupon', condition: ctrl.condition});
            ctrl.openPurchaseModal = openPurchaseModal;


        function openPurchaseModal(coupon) {
            $modal.open({
                templateUrl: '/static/apps/currency/purchase_currency/password.html',
                controller: purchaseController,
                controllerAs: "purchaseCtrl",
                windowClass: 'row',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    coupon: function () {
                        return angular.copy(coupon);
                    },
                    user: function () {
                        return angular.copy(user);
                    },
                }
            }).result.then(function () {
                ctrl.table.reload();
                ctrl.logTable.reload();
            });
        }

        function purchaseController($modalInstance, Toolkit, Coupon, coupon, user) {
            var purchaseCtrl = this;

            purchaseCtrl.password = '';
            purchaseCtrl.couponNum = coupon.sale_num;
            purchaseCtrl.sellCount = coupon.sell_count;
            purchaseCtrl.exchange_rate = coupon.exchange_rate;
            purchaseCtrl.payCoinCount = (coupon.sell_count * coupon.exchange_rate).toFixed(2);

            purchaseCtrl.cancel = $modalInstance.dismiss;
            purchaseCtrl.submitSale = submitSale;

            function submitSale() {
                var totalPrice = coupon.sell_count * coupon.exchange_rate;
                if (user.residue_coin_count < totalPrice) {
                    Toolkit.toastr.error("账户金币不足！");
                    return;
                }

                Coupon.purchaseCoupon({'purchaseCoupon': coupon.id, 'password': purchaseCtrl.password}, function () {
                    Toolkit.toastr.success("购买成功");
                    $modalInstance.close();
                }, function (resp) {
                    if (resp.status == 404) {
                        Toolkit.toastr.error("密码错误");
                    } else {
                        Toolkit.toastr.error("购买失败");
                    }
                })
            }
        }
            
            function purchaseCoupon(coupon) {


            }

            // 基于准备好的dom，初始化echarts实例
            var rates = [];
            for (var i = 6; i >= 0; i--) {
                if (exchangeRate.results.length > i) {
                    rates.push(exchangeRate.results[i].value)
                } else {
                    rates.push(0);
                }
            }
            var myChart = echarts.init(document.getElementById('rate'));

            // 指定图表的配置项和数据
            var option = {
                title: {},
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: []
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                toolbox: {
                    feature: {}
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '兑换率',
                        type: 'line',
                        stack: '平均',
                        data: rates
                    }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }
}(angular));
