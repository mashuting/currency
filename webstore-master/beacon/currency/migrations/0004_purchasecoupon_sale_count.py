# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-03-15 12:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('currency', '0003_purchasecoupon_can_sale'),
    ]

    operations = [
        migrations.AddField(
            model_name='purchasecoupon',
            name='sale_count',
            field=models.PositiveIntegerField(default=0, verbose_name='\u53ef\u51fa\u552e\u6570\u91cf'),
        ),
    ]
