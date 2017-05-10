#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

from common import *

SECRET_KEY = 'r27s7l1w4yrr#4h#sso0dnxam@5-atru$rt=bvh47n9kyx7g(n'
DEBUG = True

STATIC_URL = '/static/'
LOGIN_URL = "/currency/login/"
LOGOUT_URL = "/currency/logout/"
LOGIN_REDIRECT_URL = "/currency/"

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        "verbose": {
            'format': '%(asctime)s %(levelname)s [Line: %(lineno)s] -- %(message)s',
            "datefmt": "%Y-%m-%d %H:%M:%S"
        }
    },
    'handlers': {
        'console': {
            'level': 'DEBUG',
            'class': 'logging.StreamHandler',
        },
        'mail_admin': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'include_html': False,
        },
    },
    'loggers': {
        'root': {
            'handlers': ['console'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

from local_settings import *
