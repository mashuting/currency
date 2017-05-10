#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': "beacon",
        'USER': "root",
        'PASSWORD': "malele",
        'HOST': "127.0.0.1",
        'PORT': "3306",
        'TEST_CHARSET': 'utf8',
        'OPTIONS': {
            'init_command': 'SET default_storage_engine=INNODB',
        }
    }
}

BRAND = "Eonboard default"
ICP_NUMBER = "京- default"
COPY_RIGHT = "2015 © default"
THEME_NAME = 'darkblue'
EXTERNAL_URL = 'http://mashuting.com:8000/'

STATIC_ROOT = os.path.join(BASE_DIR, "static")
STATIC_URL = '/static/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'currency/static/apps/../media')
MEDIA_URL = '/media/'

LOGIN_URL = "/currency/login/"


SITE_CONFIG = {
    "BRAND": "Eonboard default",
    "ICP_NUMBER": "京- default",
    "COPY_RIGHT": "2015 © default",
    "THEME": "darkblue",
    "APPS": [{
        "url": "/currency/",
        "name": "currency",
        "text": "点券管理"
    }]
}

TEST = {
    "LAYER1": {
        "LAYER2-1": "local",
    },
    "LAYER-2": {
        "LAYER2-2": "local",
    }
}
