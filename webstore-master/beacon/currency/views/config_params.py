#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals
import logging

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q

from common.pagination import PagePagination
from common.decorators import require_GET, require_PUT
from common import utils

from . import generics
from ..models import ExchangeRate, SystemGiveCouponCount, UserGiveCouponCount, GiveCouponCount, SellPresent, \
    MemberLevel, MaxExchangeRate, ExchangeTimes, ProtectTime, Profile, PurchaseCoupon
from ..serializers import ExchangeRateSerializer, GiveCouponCountSerializer, SellPresentSerializer, MaxExchangeRateSerializer,\
    SystemGiveCouponCountSerializer, UserGiveCouponCountSerializer, ExchangeTimesSerializer, ProtectTimeSerializer

LOG = logging.getLogger(__name__)


class ExchangeRateListView(generics.ListCreateAPIView):
    serializer_class = ExchangeRateSerializer
    queryset = ExchangeRate.objects.all()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class ExchangeRateSplitView(generics.ListCreateAPIView):
    permission_classes = (generics.IsSuperUser,)

    queryset = ExchangeRate.living.all()
    serializer_class = ExchangeRateSerializer

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        value = float(request.data['value'])
        all_values = ExchangeRate.living.all()
        old_value = float(all_values[0].value)

        profiles = Profile.objects.all()
        purchase_coupons = PurchaseCoupon.living.filter(can_sale=False)

        def change_residue_coupon_count(profile):
            profile.residue_coupon_count = profile.residue_coupon_count * old_value / value
            profile.save()
        try:
            map(change_residue_coupon_count, profiles)
            for index, item in enumerate(purchase_coupons):
                item.can_sale = True
                item.save()
        except Exception as e:
            raise e
        return self.create(request, *args, **kwargs)


class SystemGiveCouponCountListView(generics.ListCreateAPIView):
    serializer_class = SystemGiveCouponCountSerializer
    queryset = SystemGiveCouponCount.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class SystemGiveCouponCountDetailView(generics.RetrieveAPIView):

    queryset = SystemGiveCouponCount.living.all()
    serializer_class = SystemGiveCouponCountSerializer

    def get(self, request, *args, **kwargs):
        data = SystemGiveCouponCount.living.all()
        return Response(SystemGiveCouponCountSerializer(data[0]).data)


class UserGiveCouponCountListView(generics.ListCreateAPIView):
    serializer_class = UserGiveCouponCountSerializer
    queryset = UserGiveCouponCount.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class UserGiveCouponCountDetailView(generics.RetrieveAPIView):

    queryset = UserGiveCouponCount.living.all()
    serializer_class = UserGiveCouponCountSerializer

    def get(self, request, *args, **kwargs):
        data = UserGiveCouponCount.living.all()
        return Response(UserGiveCouponCountSerializer(data[0]).data)


class GiveCouponCountListView(generics.ListCreateAPIView):
    serializer_class = GiveCouponCountSerializer
    queryset = GiveCouponCount.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class GiveCouponCountDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (generics.IsSuperUser,)

    queryset = GiveCouponCount.living.all()
    serializer_class = GiveCouponCountSerializer


class SellPresentListView(generics.ListCreateAPIView):
    serializer_class = SellPresentSerializer
    queryset = SellPresent.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class SellPresentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (generics.IsSuperUser,)

    queryset = SellPresent.living.all()
    serializer_class = SellPresentSerializer


class MaxExchangeRateListView(generics.ListCreateAPIView):
    serializer_class = MaxExchangeRateSerializer
    queryset = MaxExchangeRate.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class MaxExchangeRateDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (generics.IsSuperUser,)

    queryset = MaxExchangeRate.living.all()
    serializer_class = MaxExchangeRateSerializer


class ExchangeTimesListView(generics.ListCreateAPIView):
    serializer_class = ExchangeTimesSerializer
    queryset = ExchangeTimes.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class ExchangeTimesDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (generics.IsSuperUser,)

    queryset = ExchangeTimes.living.all()
    serializer_class = ExchangeTimesSerializer


class ProtectTimeListView(generics.ListCreateAPIView):
    serializer_class = ProtectTimeSerializer
    queryset = ProtectTime.objects.order_by('id').reverse()

    def post(self, request, *args, **kwargs):
        self.permission_classes = (generics.IsSuperUser,)
        return self.create(request, *args, **kwargs)


class ProtectTimeDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (generics.IsSuperUser,)

    queryset = ProtectTime.living.all()
    serializer_class = ProtectTimeSerializer


@require_GET
def get_member_level(request):
    coupon = request.data['coupon']
    levels = MemberLevel.objects.order_by('value').reverse()
    for level in levels:
        if coupon >= level.value:
            return Response(level)