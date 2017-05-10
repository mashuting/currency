(function(angular) {

    'use strict;'

    angular.module("CurrencyApp")
        .controller('PersonalController', ListController);

    function ListController(Toolkit, Coupon, exchangeRate, user, saleCoupon, purchaseCoupon) {
        var ctrl = this;
        ctrl.user = user;
        ctrl.exchangeRate = exchangeRate.results[0].value;
        ctrl.saleCoupon = saleCoupon.results;
        ctrl.purchaseCoupon = purchaseCoupon.results;

        ctrl.condition = {};
        ctrl.personal_sale_table = Toolkit.table.create({resource: Coupon, method: 'personalSaleCoupon', condition: ctrl.condition});
        ctrl.purchase_table = Toolkit.table.create({resource: Coupon, method: 'getPurchaseCoupon', condition: ctrl.condition});

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
