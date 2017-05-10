#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

from django.utils import timezone
from rest_framework import serializers

from .models.coupon import (User, UserProxy, Coupon, ExchangeRate, Profile, SaleCoupon, PurchaseCoupon,
                            UserGiveCouponCount, SystemGiveCouponCount, GiveCouponCount, SellPresent, MaxExchangeRate,
                            ExchangeTimes, ProtectTime)


def readonly_datetime_field():
    return DateTimeTzAwareField(format="%Y-%m-%d %H:%M:%S", read_only=True)


class DateTimeTzAwareField(serializers.DateTimeField):

    def to_representation(self, value):
        value = timezone.localtime(value)
        return super(DateTimeTzAwareField, self).to_representation(value)


def readonly_datetime_field():
    return DateTimeTzAwareField(format="%Y-%m-%d %H:%M:%S", read_only=True)


class SuperiorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class FansSerializer(serializers.ModelSerializer):
    superior = SuperiorSerializer(read_only=True)
    user = SuperiorSerializer(read_only=True)

    class Meta:
        model = Profile


class ProfileSerializer(serializers.ModelSerializer):
    superior = SuperiorSerializer(read_only=True)

    class Meta:
        model = Profile


class ProfileCreateSerializer(serializers.ModelSerializer):
    superior = SuperiorSerializer(read_only=True)

    class Meta:
        model = Profile
        fields = ("id_card", "phone_number", "superior")


class UserCreateSerializer(serializers.ModelSerializer):
    profile = ProfileCreateSerializer()

    class Meta:
        model = UserProxy

    def create(self, validated_data):
        profile_data = validated_data.pop('profile')

        user = UserProxy(**validated_data)
        user.is_staff = True
        user.is_active = True
        user.set_password(validated_data['password'])
        user.save()

        profile_data['user'] = user
        Profile.objects.create(**profile_data)

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProxy
        fields = ("id", "username", "email", "first_name", "last_name", "profile",
                  "is_superuser", "is_active", "is_staff", "date_joined", "last_login")

    date_joined = readonly_datetime_field()
    last_login = readonly_datetime_field()
    profile = ProfileSerializer()

    def update(self, instance, validated_data):

        profile_data = validated_data.pop('profile')

        instance.email = validated_data.get('email', instance.email)
        instance.save()

        profile_data['user'] = instance

        if not Profile.objects.filter(user=instance).exists():
            instance.profile = Profile.objects.create(**profile_data)
        else:
            instance.profile.phone_number = validated_data.get('phone_number', instance.profile.phone_number)
            instance.profile.save()

        return instance


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon

    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    user = UserSerializer(read_only=True)


class ExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeRate

    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)


class SaleCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = SaleCoupon

    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    user = UserSerializer(read_only=True)


class PurchaseCouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = PurchaseCoupon

    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    user = UserSerializer(read_only=True)


class SystemGiveCouponCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemGiveCouponCount
        fields = ('value',)


class UserGiveCouponCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserGiveCouponCount
        fields = ('value',)


class GiveCouponCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = GiveCouponCount
        fields = ('value',)


class SellPresentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SellPresent
        fields = ('value',)


class MaxExchangeRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaxExchangeRate
        fields = ('value',)


class ExchangeTimesSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExchangeTimes
        fields = ('value',)


class ProtectTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProtectTime
        fields = ('value',)
