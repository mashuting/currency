(function(){
   'use strict;'

    angular.module("CurrencyApp")
        .controller('FansCreateController', CreateController)

    function CreateController($state, Toolkit, User, systemGivenCoupons, userGivenCoupons){
        var self = this;
        var form = Toolkit.validate("#form", validatorConfig());

        self.systemGivenCoupons = systemGivenCoupons;
        self.userGivenCoupons = userGivenCoupons;
        self.user = {};

        self.submit = submit;

        function submit(){

            if(form.valid() == false){
                return;
            }

            User.save(self.user, function(){
                Toolkit.toastr.success();
                $state.go('all-fans');
            }, function(){
                Toolkit.toastr.error();
            });
        }

        function validatorConfig(){
            return {
                rules: {
                    username: {
                        required: true,
                        maxlength: 30,
                        minlength: 3,
                        regexp: "^[a-zA-Z][a-zA-Z0-9]*$",
                        remote: {
                            url: "/api/currency/users/unique-username-check/",
                            data: {
                                username: function(){
                                    return $("#username").val()
                                }
                            },
                            async: false
                        }
                    },
                    email: {
                        required: true,
                        regexp: "^[A-Za-z0-9]+((-|_|\.)[A-Za-z0-9]+)*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$",
                        remote: {
                            url: "/api/currency/users/unique-email-check/",
                            data: {
                                email: function(){
                                    return $("#email").val();
                                }
                            },
                            async: false
                        }
                    },
                    phone_number: {
                        required: true,
                        digits: true,
                        regexp: "^0{0,1}(13[0-9]|15[0-9]|18[0-9]|14[0-9])[0-9]{8}$",
                        remote: {
                            url: "/api/currency/users/unique-mobile-check/",
                            data: {
                                phone_number: function(){
                                    return $("#phone_number").val();
                                }
                            },
                            async: false
                        }
                    },
                    password1: {
                        required: true,
                        complexPassword: true
                    },
                    password2: {
                        required: true,
                        equalTo: "#password1"
                    },
                    id_card: {
                        required: true,
                        regexp: "^[A-Za-z0-9]+$",
                    }
                },
                messages: {
                    username: {
                        regexp: "只能使用字母数字等符号, 第一个字符必须是字母",
                        remote: "用户名已被使用"
                    },
                    email: {
                        regexp: "请使用正确的邮箱格式",
                        remote: "邮箱已被使用"
                    },
                    phone_number: {
                        regexp: "请使用正确的手机号码",
                        remote: "手机号已被使用"
                    },
                    id_card: {
                        regexp: "请使用正确的身份证号码",
                    }
                }
            };
        }
    }
}());