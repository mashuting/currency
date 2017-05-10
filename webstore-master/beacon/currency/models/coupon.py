#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from base import BaseModel


class NormalUserManager(models.Manager):
    def get_queryset(self):
        return super(NormalUserManager, self).get_queryset().filter(is_superuser=False, is_active=True)


class SuperUserManager(models.Manager):
    def get_queryset(self):
        return super(SuperUserManager, self).get_queryset().filter(is_superuser=True, is_active=True)


class UserProxy(User):

    class Meta:
        proxy = True

    normal_users = NormalUserManager()
    super_users = SuperUserManager()


class Profile(BaseModel):
    user = models.OneToOneField(User, related_name="profile")
    real_name = models.CharField("真实姓名", max_length=20)
    sex = models.CharField("性别", max_length=20)
    country = models.CharField("国家", max_length=50)
    id_card = models.CharField("身份证号码", max_length=20)
    phone_number = models.CharField("手机号码", max_length=20)
    credit_card_number = models.CharField("银行卡号", max_length=30)
    credit_card_name = models.CharField("银行户名", max_length=30)
    bank_name = models.CharField("银行名", max_length=30)
    superior = models.ForeignKey(User, related_name="user_proxy", null=True)
    total_coupon_count = models.PositiveIntegerField("金币兑换点券总量", default=0)
    sale_coupon_count = models.PositiveIntegerField("点券售卖量", default=0)
    residue_coupon_count = models.PositiveIntegerField("点券余额量", default=0)
    selling_number = models.PositiveIntegerField("销售次数", default=0)
    total_coin_count = models.PositiveIntegerField("金币总额", default=0)
    residue_coin_count = models.PositiveIntegerField("金币余额", default=0)
    member_level = models.PositiveIntegerField("会员级别", default=1)

    def __unicode__(self):
        return u'<Profile ID:%s User:%s>' % (self.id, self.user.username)

    class Meta:
        db_table = "coupon_user_profile"
        verbose_name = "用户信息"
        verbose_name_plural = "用户信息"


class Coupon(BaseModel):
    user = models.ForeignKey(User, related_name="user_superior", db_constraint=False)
    total_count = models.PositiveIntegerField("点券总量", default=0)
    sell_count = models.PositiveIntegerField("销售数量", default=0)
    residue_count = models.PositiveIntegerField("剩余数量", default=0)

    def __unicode__(self):
        return u'<Coupon ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']
        db_table = "coupon_info"
        verbose_name = "点券"
        verbose_name_plural = "点券"


class SaleCoupon(BaseModel):
    user = models.ForeignKey(User, related_name="user_saler")
    sale_num = models.CharField("出售编号", max_length=30)
    sell_count = models.PositiveIntegerField("出售数量", default=0)
    exchange_rate = models.CharField("兑换率", max_length=20)

    def __unicode__(self):
        return u'<SaleCoupon ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']
        db_table = "sale_coupon"
        verbose_name = "出售点券"
        verbose_name_plural = "出售点券"


class PurchaseCoupon(BaseModel):
    user = models.ForeignKey(User, related_name="user_purchaser")
    purchase_num = models.CharField("购买编号", max_length=30)
    purchase_count = models.PositiveIntegerField("购买数量", default=0)
    exchange_rate = models.CharField("兑换率", max_length=20)
    sale_count = models.PositiveIntegerField("可出售数量", default=0)
    can_sale = models.BooleanField("可出售", default=False)

    def __unicode__(self):
        return u'<PurchaseCoupon ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']
        db_table = "purchase_coupon"
        verbose_name = "购买点券"
        verbose_name_plural = "购买点券"


class ExchangeRate(BaseModel):
    value = models.CharField("点券兑换率", max_length=20)

    def __unicode__(self):
        return u'<ExchangeRate ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class SystemGiveCouponCount(BaseModel):
    value = models.PositiveIntegerField("系统赠送点券数")

    def __unicode__(self):
        return u'<SystemGiveCouponCount ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class UserGiveCouponCount(BaseModel):
    value = models.PositiveIntegerField("用户赠送点券数")

    def __unicode__(self):
        return u'<UserGiveCouponCount ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class GiveCouponCount(BaseModel):
    value = models.PositiveIntegerField("卖出回购率")

    def __unicode__(self):
        return u'<GiveCouponCount ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class SellPresent(BaseModel):
    value = models.CharField("售卖最高率", max_length=20)

    def __unicode__(self):
        return u'<SellPresent ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class MaxExchangeRate(BaseModel):
    value = models.CharField("最大兑换率", max_length=20)

    def __unicode__(self):
        return u'<MaxExchangeRate ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class ExchangeTimes(BaseModel):
    value = models.PositiveIntegerField("最大兑换次数")

    def __unicode__(self):
        return u'<ExchangeTimes ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class ProtectTime(BaseModel):
    value = models.PositiveIntegerField("点券保护秒")

    def __unicode__(self):
        return u'<ProtectTime ID:%d>' % (self.id,)

    class Meta:
        ordering = ['-id']


class MemberLevel(BaseModel):
    name = models.CharField("等级称为", max_length=20)
    coupon_count = models.PositiveIntegerField("点券最低总量")

