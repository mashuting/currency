#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals
import logging
import datetime

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import Http404
from django.db.models import Q
from django.contrib.auth import authenticate

from common.pagination import PagePagination
from common.decorators import require_GET, require_PUT, require_POST
from common import utils

from ..models import Coupon, ProtectTime, SaleCoupon, PurchaseCoupon, UserProxy, Profile
from  ..serializers import SaleCouponSerializer, PurchaseCouponSerializer
from ..settings import FORBIDDEN_NAMES

LOG = logging.getLogger(__name__)


@require_GET
def get_total_coupons(request):
    user = request.user
    coupons = Coupon.objects.filter(user__name=user.username)
    total_coupons = 0
    for coupon in coupons:
        total_coupons = total_coupons + coupon.total_count


@require_GET
def get_sale_coupons(request):
    user = request.user
    coupons = Coupon.objects.filter(user__name=user.username)
    sale_coupons = 0
    for coupon in coupons:
        sale_coupons = sale_coupons + coupon.sell_count


@require_GET
def get_residue_coupons(request):
    user = request.user
    coupons = Coupon.objects.filter(user__name=user.username)
    residue_coupons = 0
    for coupon in coupons:
        residue_coupons = residue_coupons + coupon.residue_count


@require_GET
def get_selling_coupons(request):
    coupon_count = 0
    try:
        coupons = PurchaseCoupon.living.filter(user=request.user, can_sale=True).values_list("sale_count")
        for index, item in enumerate(coupons):
            coupon_count += item[0]
    except Exception as e:
        raise e
    return Response(data={'coupon_count': coupon_count})


@require_POST
def sale_coupons(request):
    password = request.data['password']
    sale_num = request.data['saleNum']
    sale_count = int(request.data['saleCount'])
    total_count = int(request.data['totalCount'])
    buy_count = int(request.data['buyCount'])
    sale_price = request.data['salePrice']

    auth = authenticate(username=request.user.username, password=password)

    if auth is None:
        raise Http404

    try:
        coupon_count = 0
        coupons = PurchaseCoupon.living.filter(user=request.user, can_sale=True)
        for index, item in enumerate(coupons.values_list("sale_count")):
            coupon_count += item[0]
        if total_count > coupon_count * 0.5:
            return Response(status=status.HTTP_412_PRECONDITION_FAILED, data={
                "code": "HTTP_{0}".format(status.HTTP_412_PRECONDITION_FAILED),
                "message": unicode("请求参数不合格"),
                "detail": unicode("请求参数不合格")
            })

        profile = Profile.living.get(user__username=request.user.username)
        profile.total_coupon_count -= total_count - buy_count
        profile.sale_coupon_count += sale_count
        profile.residue_coupon_count -= total_count - buy_count
        profile.save()

        PurchaseCoupon.objects.create(
            user=profile.user,
            purchase_num=0,
            purchase_count=buy_count,
            exchange_rate=sale_price,
        )

        SaleCoupon.objects.create(
            user=profile.user,
            sale_num=sale_num,
            sell_count=sale_count,
            exchange_rate=sale_price,
        )

        for index, item in enumerate(coupons):
            if int(item.sale_count) < total_count:
                item.sale_count = 0
                item.save()
                item.fake_delete()
                total_count -= int(item.sale_count)
            else:
                item.sale_count -= total_count
                item.save()

    except Exception as e:
        raise e
    return Response(status=status.HTTP_201_CREATED)


@require_POST
def create_coupons(request):
    user = request.user
    coupons = request.data['coupon']
    try:
        Coupon.objects.create(user=user, total_count=coupons, residue_count=coupons, sell_count=0)
    except Exception as e:
        raise e

    return Response(status=status.HTTP_201_CREATED)


@require_GET
def get_personal_sale_coupon(request):
    try:
        sale_coupon = SaleCoupon.objects.filter(user__username=request.user.username)
        result = SaleCouponSerializer(sale_coupon, many=True)
    except Exception as e:
        raise e
    return Response(data=result.data)


@require_GET
def get_sale_coupon(request):
    try:
        sale_coupon = SaleCoupon.living.all().order_by("exchange_rate")
        result = SaleCouponSerializer(sale_coupon, many=True)
    except Exception as e:
        raise e
    return Response(data=result.data)


@require_GET
def get_purchase_coupon(request):
    user = request.user
    try:
        purchase_coupon = PurchaseCoupon.objects.filter(user__username=user)
        result = PurchaseCouponSerializer(purchase_coupon, many=True)
    except Exception as e:
        raise e
    return Response(data=result.data)


@require_POST
def purchase_coupons(request):
    password = request.data['password']
    auth = authenticate(username=request.user.username, password=password)

    if auth is None:
        raise Http404

    try:
        selling_coupon = SaleCoupon.living.get(pk=request.data['purchaseCoupon'])
        buyer = Profile.living.get(user__username=request.user.username)
        seller = Profile.living.get(user__username=selling_coupon.user.username)
        PurchaseCoupon.objects.create(
            user=buyer.user,
            purchase_num=selling_coupon.sale_num,
            purchase_count=selling_coupon.sell_count,
            exchange_rate=selling_coupon.exchange_rate,
            sale_count=selling_coupon.sell_count
        )
        # 金币消费数量
        total_price = int(selling_coupon.sell_count) * float(selling_coupon.exchange_rate)
        buyer.residue_coupon_count += selling_coupon.sell_count
        buyer.residue_coin_count -= total_price
        buyer.save()
        seller.residue_coin_count += total_price
        seller.save()

        selling_coupon.fake_delete()

    except Exception as e:
        raise e
    return Response(status=status.HTTP_201_CREATED)

