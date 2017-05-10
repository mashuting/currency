#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals
import logging

from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.db.models import Q

from common.pagination import PagePagination
from common.decorators import require_GET, require_PUT
from common import utils

from ..models import UserProxy, Profile, UserGiveCouponCount, SystemGiveCouponCount
from ..serializers import UserSerializer, UserCreateSerializer, FansSerializer
from ..settings import FORBIDDEN_NAMES

LOG = logging.getLogger(__name__)


class ListView(generics.ListCreateAPIView):
    queryset = UserProxy.normal_users.all()
    serializer_class = UserSerializer
    pagination_class = PagePagination

    def create(self, request, *args, **kwargs):
        user_given_coupons = UserGiveCouponCount.living.all()
        user_given_coupon = int(user_given_coupons[0].value)

        system_given_coupons = SystemGiveCouponCount.living.all()
        system_given_coupon = int(system_given_coupons[0].value)
        current_user = Profile.objects.get(user_id=request.user.id)
        current_user.residue_coupon_count -= user_given_coupon
        current_user.save()

        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)

        user = Profile.objects.get(user_id=serializer.data['id'])
        user.superior = request.user
        user.residue_coupon_count = user_given_coupon + system_given_coupon
        user.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def get_queryset(self):
        keyword = self.request.query_params.get('keyword', '').strip()
        queryset = super(ListView, self).get_queryset()

        if keyword:
            queryset = queryset.filter(Q(username__startswith=keyword) |
                                       Q(email__startswith=keyword) |
                                       Q(profile__phone_number__startswith=keyword))

        return queryset.order_by('id')


class DetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserProxy.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        return self.update(request, *args, **kwargs)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


@api_view(["POST", "PUT"])
def change_password(request, pk):
    user = request.user
    old_password = request.data['old_password']
    new_password = request.data['new_password']
    confirm_password = request.data['confirm_password']

    if new_password != confirm_password:
        return utils.error(msg="密码不相同")

    if not user.check_password(old_password):
        return utils.error(msg="原密码不对")

    user.set_password(new_password)
    user.save()

    return utils.success()


@require_PUT
def activate_user(request, pk):
    UserProxy.normal_users.filter(pk=pk).update(is_staff=True)
    return utils.success()


@require_PUT
def deactivate_user(request, pk):
    UserProxy.normal_users.filter(pk=pk).update(is_staff=False)
    return utils.success()


def generate_is_unique(queryset, key):
    @require_GET
    def func(request):
        value = request.GET[key]
        pk = request.GET.get('id', None)
        query = queryset.filter(**{key: value})

        if pk:
            query = query.exclude(pk=pk)

        return Response(not query.exists())

    return func


is_email_unique = generate_is_unique(UserProxy.objects, 'email')
is_phone_number_unique = generate_is_unique(Profile.objects, 'phone_number')


@require_GET
def is_username_unique(request):
    username = request.GET["username"]
    pk = request.GET.get('id', None)

    if username in FORBIDDEN_NAMES:
        return Response(False)

    query = UserProxy.objects.filter(username=username)
    if pk:
        query = query.exclude(pk=pk)

    return Response(not query.exists())


@require_GET
def get_user_fans(request):
    try:
        queryset = Profile.living.filter(superior__username=request.query_params.get('user'))
        fans = FansSerializer(queryset, many=True)
    except Exception as e:
        raise e
    return Response(fans.data)
