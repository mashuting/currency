(function(angular) {

    'use strict;'

    angular.module("CurrencyApp")
        .controller('SaleCurrencyController', ListController);

    function ListController($state, $modal, Toolkit, Coupon, exchangeRate, user, saleCouponCount) {
        var ctrl = this;
        var form = Toolkit.validate("#sale_form", validatorConfig(saleCouponCount['coupon_count'], exchangeRate.results[0].value));

        ctrl.user = user;
        ctrl.couponNum = null;
        ctrl.couponPrice = null;
        ctrl.exchangeRate = exchangeRate.results[0].value;
        ctrl.saleCouponCount = saleCouponCount['coupon_count'];

        ctrl.condition = {};
        ctrl.table = Toolkit.table.create({resource: Coupon, method: 'personalSaleCoupon', condition: ctrl.condition});
        ctrl.submit = submit;

        function submit() {
            if (form.valid() == false) {
                return;
            }

            openSaleModal();

        }

        function openSaleModal() {
            $modal.open({
                templateUrl: '/static/apps/currency/sale_currency/sale.html',
                controller: saleController,
                controllerAs: "saleCtrl",
                windowClass: 'row',
                backdrop: "static",
                size: 'lg',
                resolve: {
                    couponNum: function () {
                        return angular.copy(ctrl.couponNum);
                    },
                    couponPrice: function () {
                        return angular.copy(ctrl.couponPrice);
                    },
                    coinCount: function () {
                        return angular.copy(ctrl.user.profile.residue_coin_count);
                    },
                }
            }).result.then(function () {
                ctrl.table.reload();
            });
        }

        function saleController($modalInstance, Toolkit, Coupon, couponNum, couponPrice, coinCount) {
            var saleCtrl = this;

            saleCtrl.password = '';
            saleCtrl.couponNum = couponNum;
            saleCtrl.couponPrice = couponPrice;
            saleCtrl.coinCount = coinCount;
            saleCtrl.buyCouponNum = Math.round(couponNum * 0.3);
            saleCtrl.factorageCouponNum = Math.round(couponNum * 0.1);
            saleCtrl.saleCouponNum = couponNum - saleCtrl.buyCouponNum - saleCtrl.factorageCouponNum;
            saleCtrl.payCoinCount = (saleCtrl.buyCouponNum * couponPrice).toFixed(2);
            saleCtrl.saleCoinCount = (saleCtrl.saleCouponNum * couponPrice).toFixed(2);

            saleCtrl.cancel = $modalInstance.dismiss;
            saleCtrl.submitSale = submitSale;

            function submitSale() {
                var datetime = new Date();
                Coupon.saleCoupon({'saleNum': datetime.getTime(), 'saleCount': saleCtrl.saleCouponNum, 'password': saleCtrl.password,
                    'buyCount': saleCtrl.buyCouponNum, 'totalCount': couponNum, 'salePrice': couponPrice},
                    function () {
                        Toolkit.toastr.success("出售成功");
                        $modalInstance.close();
                    }, function (resp) {
                    if (resp.status == 404) {
                        Toolkit.toastr.error("密码错误");
                    } else {
                        Toolkit.toastr.error("出售失败");
                    }
                    });
            }
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

    function validatorConfig(count, changeRate) {
        return {
            rules: {
                coupon_num: {
                    required: true,
                    regexp: "^[1-9][0-9]*$",
                    max: count * 0.5
                },
                coupon_price: {
                    required: true,
                    number: true,
                    min: changeRate
                }
            },
            messages: {
                coupon_num: {
                    regexp: "只能使用大于零的整数",
                    max: "出售数量不可超过可出售点券数量的50%"
                },
                coupon_price: {
                    min: "价格不能小于当前兑换率"
                }
            }
        };
    }

}(angular));
