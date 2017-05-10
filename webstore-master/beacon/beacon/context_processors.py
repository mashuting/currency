#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals
from django.conf import settings


def site(request):
    return settings.SITE_CONFIG
