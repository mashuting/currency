
angular.module('currency.directives', [])
    .directive('ngSpinnerBar', ['$rootScope',
        function ($rootScope) {
            return {
                link: function (scope, element, attrs) {
                    // by defult hide the spinner bar
                    element.addClass('hide'); // hide spinner bar by default

                    // display the spinner bar whenever the route changes(the content part started loading)
                    $rootScope.$on('$stateChangeStart', function () {
                        element.removeClass('hide'); // show spinner bar
                    });

                    // hide the spinner bar on rounte change success(after the content loaded)
                    $rootScope.$on('$stateChangeSuccess', function () {
                        element.addClass('hide'); // hide spinner bar
                        $('body').removeClass('page-on-load'); // remove page loading indicator
                        Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                        // auto scorll to page top
                        setTimeout(function () {
                            Metronic.scrollTop(); // scroll to the top on content load
                        }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                    });

                    // handle errors
                    $rootScope.$on('$stateNotFound', function () {
                        element.addClass('hide'); // hide spinner bar
                    });

                    // handle errors
                    $rootScope.$on('$stateChangeError', function () {
                        element.addClass('hide'); // hide spinner bar
                    });
                }
            };
        }
    ])

// Handle global LINK click
    .directive('a', function () {
        return {
            restrict: 'E',
            link: function (scope, elem, attrs) {
                if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                    elem.on('click', function (e) {
                        e.preventDefault(); // prevent link click for above criteria
                    });
                }
            }
        };
    })

// Handle Dropdown Hover Plugin Integration
    .directive('dropdownMenuHover', function () {
        return {
            link: function (scope, elem) {
                elem.dropdownHover();
            }
        };
    })

    .directive('napAfterClick', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {

                var duration = parseInt(attrs.napAfterClick);

                if (isNaN(duration)) {
                    duration = 2;
                }

                duration *= 1000;

                elem.on('click', function () {
                    elem.addClass('disabled');
                    $timeout(function () {
                        elem.removeClass('disabled');
                    }, duration);
                });
            }
        };
    })

    .directive('eonDatePicker', function ($timeout, DatePicker) {
        return {
            link: function (scope, element, attrs) {
                $timeout(function () {
                    DatePicker.initDatePickers(element);
                });
            }
        };
    })

    .directive('eonHelp', function () {
        return {
            restrict: 'E',
            replace: true,
            template: "<a><i class=\"fa fa-question-circle eon-help\"></i></a>"
        }
    })

    .directive('eonSubmitting', function () {
        var t = "<a class=\"btn\"><img src=\"/static/assets/global/img/throbber.gif\"/></a>";
        var link = function (scope, ele, attrs) {
            scope.$watch("submitting", function (value) {
                if (value) {
                    $(ele).show()
                }
                else {
                    $(ele).hide()
                }
            });
        };

        return {
            restrict: 'E',
            replace: true,
            scope: {
                "submitting": "=submitting"
            },
            template: t,
            link: link
        }
    })

    .directive('eonCheck', function(){
        return {
            restrict: 'E',
            replace: true,
            template: '<i class="fa fa-check" style="color: green;"></i>'
        }
    })
    .directive('eonDeny', function(){
        return {
            restrict: 'E',
            replace: true,
            template: '<i class="fa fa-times" style="color: red;"></i>'
        }
    }).directive('histogram', function () {
        return {
            restrict: 'A',
            scope: {
                options: "="
            },
            link: function (scope, element) {

                var option = {
                    legend: {
                        data: [],
                        align: 'left'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: [{data: []}],
                    yAxis: {},
                    series: []
                };

                var myChart = echarts.init(element[0]);
                myChart.setOption(option);

                var series, legendNames = [];

                scope.$watch('options.datas', function (newValue) {
                    /* newValue, type: Object, content example:
                     *{
                     *   instance1: [0.1, 0.2...],
                     *   instance2: [0.03, 0.4...],
                     *   ...}
                     * */
                    myChart.showLoading({
                        color: '#1caf9a',
                        textColor: '#1caf9a'
                    });

                    if (jQuery.isEmptyObject(newValue)) {
                        return;
                    }

                    series = [];
                    for (var legendName in newValue) {
                        legendNames.push(legendName);
                        series.push({
                            name: legendName,
                            type: 'line',
                            data: newValue[legendName]
                        });
                    }

                    option.xAxis = [{data: scope.options.timeSlots}];
                    option.yAxis = {name: '单位（' + scope.options.unit + '）'};
                    option.legend = {data: legendNames};
                    option.series = series;

                    myChart.hideLoading();
                    myChart.setOption(option, true);
                });
            }
        };
    });
