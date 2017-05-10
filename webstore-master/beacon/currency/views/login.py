#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

import json
import logging
import copy

from django.views.generic import View
from django.shortcuts import render
from django.http import (HttpResponseRedirect, JsonResponse)
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login as auth_login
from django.contrib.auth import logout as auth_logout
from django.core.urlresolvers import reverse

from ..serializers import UserSerializer
from ..forms import LoginForm
from .. import settings

LOG = logging.getLogger(__name__)


@login_required
def index(request):
    site_config = copy.deepcopy(settings.SITE_CONFIG)
    site_config["LOGIN_URL"] = settings.LOGIN_URL
    site_config["LOGOUT_URL"] = settings.LOGOUT_URL

    return render(request, 'currency/index.html', {
        'THEME': settings.SITE_CONFIG['THEME'],
        'current_user': json.dumps(UserSerializer(instance=request.user).data),
        'site_config': json.dumps(site_config)})


class LoginView(View):

    def get(self, request):
        if request.user.is_authenticated():
            return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)
        return self.response(request)

    def post(self, request):

        form = LoginForm(data=request.POST)

        if not form.is_valid():
            return self.response(request, form)

        auth_login(request, form.get_user())

        # todo redirect next
        return HttpResponseRedirect(settings.LOGIN_REDIRECT_URL)

    @staticmethod
    def response(request, form=None):

        if form is None:
            form = LoginForm(initial={'username': ''})
            error = False
        else:
            error = True

        return render(request, 'currency/login.html', {"form": form, "error": error})


def logout(request):
    auth_logout(request)
    return HttpResponseRedirect(reverse("auth_login"))


def not_found(request):
    if request.path.startswith('/api'):
        return JsonResponse({"success": False, "msg": "没有数据"}, status=404)
    else:
        return render(request, '404.html')


def server_error(request):
    if request.path.startswith('/api'):
        return JsonResponse({"success": False, "msg": "未知系统错误！"}, status=500)
    else:
        return render(request, '500.html')
