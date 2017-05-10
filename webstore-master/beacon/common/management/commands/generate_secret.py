#!/usr/bin/env python
# coding=utf-8


from __future__ import unicode_literals

from django.core.management.base import BaseCommand
import string
import random


class Command(BaseCommand):
    help = 'Add quotas for users'

    def handle(self, *args, **options):
        chars = ''.join([string.ascii_letters, string.digits, string.punctuation]).replace('\'', '').replace('"', '').replace('\\', '')
        print ''.join([random.SystemRandom().choice(chars) for _ in range(50)])
