(function(angular) {

    'use strict;'

    angular.module("CurrencyApp")
        .controller('ConfigurationController', ListController);

    function ListController($modal, $state, ExchangeRate, SystemGiveCouponCount, UserGiveCouponCount, GiveCouponCount,
                            SellPresent, MaxExchangeRate, ExchangeTimes, ProtectTime, MemberLevel, current_user,
                            exchangeRate, systemGiveCouponCount, userGiveCouponCount, giveCouponCount,
                            sellPresent, maxExchangeRate, exchangeTimes, protectTime) {
        var self = this;
        self.exchangeRate = exchangeRate.results[0].value;
        self.systemGiveCouponCount = systemGiveCouponCount.results[0].value;
        self.userGiveCouponCount = userGiveCouponCount.results[0].value;
        self.giveCouponCount = giveCouponCount.results[0].value;
        self.sellPresent = sellPresent.results[0].value;
        self.maxExchangeRate = maxExchangeRate.results[0].value;
        self.exchangeTimes = exchangeTimes.results[0].value;
        self.protectTime = protectTime.results[0].value;

        self.splitExchangeRateModal = splitExchangeRateModal;

        function splitExchangeRateModal(exchangeRate) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: splitExchangeRateController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    exchangeRate: function () {
                        return angular.copy(exchangeRate);
                    }
                }
            }).result.then(function () {
            });
        }

        function splitExchangeRateController($modalInstance, Toolkit, ExchangeRate, exchangeRate) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(exchangeRate);
            self.name = "拆分兑换率";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                ExchangeRate.split({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeExchangeRateModal = changeExchangeRateModal;

        function changeExchangeRateModal(exchangeRate) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeExchangeRateController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    exchangeRate: function () {
                        return angular.copy(exchangeRate);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeExchangeRateController($modalInstance, Toolkit, ExchangeRate, exchangeRate) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(exchangeRate);
            self.name = "兑换率";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                ExchangeRate.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeSystemGiveCouponCountModal = changeSystemGiveCouponCountModal;

        function changeSystemGiveCouponCountModal(systemGiveCouponCount) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeSystemGiveCouponCountController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    systemGiveCouponCount: function () {
                        return angular.copy(systemGiveCouponCount);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeSystemGiveCouponCountController($modalInstance, Toolkit, SystemGiveCouponCount, systemGiveCouponCount) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(systemGiveCouponCount);
            self.name = "系统增送新用户点券数";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                SystemGiveCouponCount.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeUserGiveCouponCountModal = changeUserGiveCouponCountModal;

        function changeUserGiveCouponCountModal(userGiveCouponCount) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeUserGiveCouponCountController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    userGiveCouponCount: function () {
                        return angular.copy(userGiveCouponCount);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeUserGiveCouponCountController($modalInstance, Toolkit, UserGiveCouponCount, userGiveCouponCount) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(userGiveCouponCount);
            self.name = "用户增送新粉丝点券数";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                UserGiveCouponCount.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeMaxExchangeRateModal = changeMaxExchangeRateModal;

        function changeMaxExchangeRateModal(maxExchangeRate) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeMaxExchangeRateController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    maxExchangeRate: function () {
                        return angular.copy(maxExchangeRate);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeMaxExchangeRateController($modalInstance, Toolkit, MaxExchangeRate, maxExchangeRate) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(maxExchangeRate);
            self.name = "兑换率峰值";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                MaxExchangeRate.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeSellPresentModal = changeSellPresentModal;

        function changeSellPresentModal(sellPresent) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeSellPresentController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    sellPresent: function () {
                        return angular.copy(sellPresent);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeSellPresentController($modalInstance, Toolkit, SellPresent, sellPresent) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(sellPresent);
            self.name = "出售点券占可出售部分比率";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                SystemGiveCouponCount.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeExchangeTimesModal = changeExchangeTimesModal;

        function changeExchangeTimesModal(exchangeTimes) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeExchangeTimesController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    exchangeTimes: function () {
                        return angular.copy(exchangeTimes);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeExchangeTimesController($modalInstance, Toolkit, ExchangeTimes, exchangeTimes) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(exchangeTimes);
            self.name = "最大兑换次数";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                ExchangeTimes.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }

        self.changeProtectTimeModal = changeProtectTimeModal;

        function changeProtectTimeModal(protectTime) {
            $modal.open({
                templateUrl: '/static/apps/currency/configuration/update.html',
                controller: changeProtectTimeController,
                controllerAs: "updateCtrl",
                backdrop: "static",
                size: 'lg',
                resolve: {
                    protectTime: function () {
                        return angular.copy(protectTime);
                    }
                }
            }).result.then(function () {
            });
        }

        function changeProtectTimeController($modalInstance, Toolkit, ProtectTime, protectTime) {
            var form = null;
            $modalInstance.rendered.then(function () {
                form = Toolkit.validate("#form", validatorConfig())
            });

            var self = this;
            self.cancel = $modalInstance.dismiss;

            self.value = parseFloat(protectTime);
            self.name = "系统增送新用户点券数";
            self.submit = submit;

            function submit() {
                if (form.valid() == false) {
                    return;
                }

                ProtectTime.save({value: self.value}, function (data) {
                    Toolkit.toastr.success();
                    $modalInstance.close();
                }, function () {
                    Toolkit.toastr.error();
                });
            }
        }


        function validatorConfig() {
            return {
                rules: {
                    value: {
                        required: true,
                        number: true,
                    }
                },
                messages: {
                    value: {
                    }
                }
            };
        }

    }
}(angular));
