#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

from django.conf import settings

FORBIDDEN_NAMES = getattr(settings, "AUTH_FORBIDDEN_NAMES", ["default", "system"])
LOGIN_URL = getattr(settings, "LOGIN_URL", "/currency/login/")
LOGOUT_URL = getattr(settings, "LOGOUT_URL", "/currency/logout/")
LOGIN_REDIRECT_URL = getattr(settings, "LOGIN_REDIRECT_URL", "/currency/")
REDIRECT_AFTER_LOGIN = getattr(settings, "AUTH_REDIRECT_AFTER_LOGIN", "auth_index")

__SITE_CONFIG = {
    "BRAND": "",
    "ICP_NUMBER": "",
    "COPY_RIGHT": "",
    "THEME": "darkblue",
    "APPS": [{
        "url": "/currency/",
        "name": "currency",
        "text": "点券管理"
    }]
}

SITE_CONFIG = getattr(settings, "SITE_CONFIG", __SITE_CONFIG)
