#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

from django import forms
from django.contrib.auth.forms import AuthenticationForm


class LoginForm(AuthenticationForm):

    def confirm_login_allowed(self, user):
        """
        Controls whether the given User may log in. This is a policy setting,
        independent of end-user authentication. This default behavior is to
        allow login by active users, and reject login by inactive users.

        If the given user cannot log in, this method should raise a
        ``forms.ValidationError``.

        If the given user may log in, this method should return None.
        """
        if not user.is_active or not user.is_staff:
            raise forms.ValidationError(
                self.error_messages['inactive'],
                code='inactive',
            )
