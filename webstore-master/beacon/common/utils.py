#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

import re
import imp
import sys
from importlib import import_module

from django.conf import settings

from rest_framework.response import Response
from rest_framework import status


def retrieve_params(data, *keys):
    return tuple(data[key] for key in keys)


def retrieve_list_params(data, *keys):
    return tuple(data.getlist(key) for key in keys)


def json(data):
    return Response(data, status=status.HTTP_200_OK)


def success(msg='操作成功！', status=status.HTTP_200_OK):
    return Response({'success': True, 'msg': msg}, status=status)


def error(msg='未知错误导致操作失败！', status=status.HTTP_500_INTERNAL_SERVER_ERROR):
    return Response({'success': False, 'msg': msg}, status=status)


def generic_autodiscover(module_name):
    """
    I have copy/pasted this code too many times...Dynamically autodiscover a
    particular module_name in a django project's INSTALLED_APPS directories,
    a-la django admin's autodiscover() method.

    Usage:
        generic_autodiscover('commands') <-- find all commands.py and load 'em
    """

    for app in settings.INSTALLED_APPS:
        try:
            import_module(app)
            app_path = sys.modules[app].__path__
        except AttributeError:
            continue

        try:
            imp.find_module(module_name, app_path)
        except ImportError:
            continue
        import_module('%s.%s' % (app, module_name))


FIRST_CAP_RE = re.compile('(.)([A-Z][a-z]+)')
ALL_CAP_RE = re.compile('([a-z0-9])([A-Z])')
SERVICE_DICTIONARY = {
    "State": "status",
    "MySQL": "mysql"
}


def underscore(name):
    s1 = FIRST_CAP_RE.sub(r'\1_\2', name)
    return ALL_CAP_RE.sub(r'\1_\2', s1).lower()


def underscore_keys(d, dictionary=SERVICE_DICTIONARY):
    """ 非通用，仅限于dock_client.get_app返回的结果 """

    result = {}

    if dictionary is None:
        dictionary = {}

    assert isinstance(dictionary, dict)

    if isinstance(d, basestring):
        return d
    elif isinstance(d, (list, tuple)):
        return map(underscore_keys, d)

    for key, value in d.items():

        if key in dictionary:
            key = dictionary[key]
        else:
            key = underscore(key)

        if isinstance(value, (list, tuple)):
            value = map(underscore_keys, value)
        elif isinstance(value, dict):
            value = underscore_keys(value)

        result[key] = value

    return result
