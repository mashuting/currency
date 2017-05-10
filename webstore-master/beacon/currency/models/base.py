#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

from django.db import models
from django.utils import timezone


class LivingQuerySet(models.QuerySet):
    pass


class LivingManager(models.Manager):

    def get_queryset(self):
        return LivingQuerySet(self.model, using=self._db).filter(deleted=0)

    def get_or_none(self, *args, **kwargs):
        try:
            obj = self.get_queryset().get(*args, **kwargs)
        except models.ObjectDoesNotExist:
            return None

        return obj


class DeletedManager(models.Manager):

    def get_queryset(self):
        return super(DeletedManager, self).get_queryset().filter(deleted=True)


class BaseModel(models.Model):
    deleted = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField("创建日期", auto_now_add=True)
    updated_at = models.DateTimeField("更新日期", auto_now=True)
    deleted_at = models.DateTimeField(null=True)

    objects = models.Manager()
    living = LivingManager()
    dead = DeletedManager()

    class Meta:
        abstract = True

    def fake_delete(self):
        self.deleted = self.pk
        self.deleted_at = timezone.now()
        self.save()
