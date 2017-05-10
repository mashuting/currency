#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals
from django.conf.urls import url, include

from .views import login
from .views import user, coupon, config_params

login_patterns = [
    url(r'^$', login.index, name="auth_index"),
    url(r'^login/$', login.LoginView.as_view(), name="auth_login"),
    url(r'^logout/$', login.logout, name="auth_logout"),
]

user_patterns = [
    url(r'^$', user.ListView.as_view(), name="currency_user_list"),
    url(r'^(?P<pk>[0-9]+)/$', user.DetailView.as_view(), name="currency_user_detail"),
    url(r'^(?P<pk>[0-9]+)/password-change/$', user.change_password, name="currency_password_change"),
    url(r'^(?P<pk>[0-9]+)/activation/$', user.activate_user, name="currency_activate_user"),
    url(r'^(?P<pk>[0-9]+)/deactivation/$', user.deactivate_user, name="currency_deactivate_user"),
    url(r'^fans/$', user.get_user_fans, name="currency_fans"),

    url(r'^unique-username-check/$', user.is_username_unique),
    url(r'^unique-mobile-check/$', user.is_phone_number_unique),
    url(r'^unique-email-check/$', user.is_email_unique),
]

coupon_patterns = [
    url(r'^total_coupons/$', coupon.get_total_coupons, name="total_coupons"),
    url(r'^residue_coupons/$', coupon.get_residue_coupons, name="residue_coupons"),
    url(r'^selling_coupons_count/$', coupon.get_selling_coupons, name="selling_coupons"),
    url(r'^sale_coupons/$', coupon.sale_coupons, name="sale_coupons"),
    url(r'^purchase_coupons/$', coupon.purchase_coupons, name="purchase_coupons"),
    url(r'^create_coupons/$', coupon.create_coupons, name="create_coupons"),
    url(r'^personal_sale_coupon/$', coupon.get_personal_sale_coupon, name="get_personal_sale_coupon"),
    url(r'^all_sale_coupon/$', coupon.get_sale_coupon, name="get_sale_coupon"),
    url(r'^all_purchase_coupon/$', coupon.get_purchase_coupon, name="get_purchase_coupon"),
]

configParams_patterns = [
    url(r'^exchange_rate/$', config_params.ExchangeRateListView.as_view()),
    url(r'^exchange_rate/split/$', config_params.ExchangeRateSplitView.as_view()),
    url(r'^system_give_coupon_count/$', config_params.SystemGiveCouponCountListView.as_view()),
    url(r'^system_give_coupon_count/(?P<pk>[0-9]+)/$', config_params.SystemGiveCouponCountDetailView.as_view()),
    url(r'^user_give_coupon_count/$', config_params.UserGiveCouponCountListView.as_view()),
    url(r'^user_give_coupon_count/(?P<pk>[0-9]+)/$', config_params.UserGiveCouponCountDetailView.as_view()),
    url(r'^give_coupon_count/$', config_params.GiveCouponCountListView.as_view()),
    url(r'^give_coupon_count/(?P<pk>[0-9]+)/$', config_params.GiveCouponCountDetailView.as_view()),
    url(r'^sell_present/$', config_params.SellPresentListView.as_view()),
    url(r'^sell_present/(?P<pk>[0-9]+)/$', config_params.SellPresentDetailView.as_view()),
    url(r'^max_exchange_rate/$', config_params.MaxExchangeRateListView.as_view()),
    url(r'^max_exchange_rate/(?P<pk>[0-9]+)/$', config_params.MaxExchangeRateDetailView.as_view()),
    url(r'^exchange_times/$', config_params.ExchangeTimesListView.as_view()),
    url(r'^exchange_times/(?P<pk>[0-9]+)/$', config_params.ExchangeTimesDetailView.as_view()),
    url(r'^protect_time/$', config_params.ProtectTimeListView.as_view()),
    url(r'^protect_time/(?P<pk>[0-9]+)/$', config_params.ProtectTimeDetailView.as_view()),
    url(r'^member_level/$', config_params.get_member_level),
]

api_patterns = [
    url(r'^currency/users/', include(user_patterns)),
    url(r'^currency/coupon/', include(coupon_patterns)),
    url(r'^currency/configParams/', include(configParams_patterns)),
]

urlpatterns = [
    url(r'^currency/', include(login_patterns)),
    url(r'^api/', include(api_patterns)),
]
