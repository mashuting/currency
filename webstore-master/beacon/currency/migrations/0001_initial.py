# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-03-01 13:55
from __future__ import unicode_literals

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.db.models.manager


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0007_alter_validators_add_error_messages'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Coupon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('total_count', models.PositiveIntegerField(default=0, verbose_name='\u70b9\u5238\u603b\u91cf')),
                ('sell_count', models.PositiveIntegerField(default=0, verbose_name='\u9500\u552e\u6570\u91cf')),
                ('residue_count', models.PositiveIntegerField(default=0, verbose_name='\u5269\u4f59\u6570\u91cf')),
            ],
            options={
                'ordering': ['-id'],
                'db_table': 'coupon_info',
                'verbose_name': '\u70b9\u5238',
                'verbose_name_plural': '\u70b9\u5238',
            },
        ),
        migrations.CreateModel(
            name='ExchangeRate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.CharField(max_length=20, verbose_name='\u70b9\u5238\u5151\u6362\u7387')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='ExchangeTimes',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.PositiveIntegerField(verbose_name='\u6700\u5927\u5151\u6362\u6b21\u6570')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='GiveCouponCount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.PositiveIntegerField(verbose_name='\u5356\u51fa\u56de\u8d2d\u7387')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='MaxExchangeRate',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.CharField(max_length=20, verbose_name='\u6700\u5927\u5151\u6362\u7387')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='MemberLevel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('name', models.CharField(max_length=20, verbose_name='\u7b49\u7ea7\u79f0\u4e3a')),
                ('coupon_count', models.PositiveIntegerField(verbose_name='\u70b9\u5238\u6700\u4f4e\u603b\u91cf')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('real_name', models.CharField(max_length=20, verbose_name='\u771f\u5b9e\u59d3\u540d')),
                ('sex', models.CharField(max_length=20, verbose_name='\u6027\u522b')),
                ('country', models.CharField(max_length=50, verbose_name='\u56fd\u5bb6')),
                ('id_card', models.CharField(max_length=20, verbose_name='\u8eab\u4efd\u8bc1\u53f7\u7801')),
                ('phone_number', models.CharField(max_length=20, verbose_name='\u624b\u673a\u53f7\u7801')),
                ('credit_card_number', models.CharField(max_length=30, verbose_name='\u94f6\u884c\u5361\u53f7')),
                ('credit_card_name', models.CharField(max_length=30, verbose_name='\u94f6\u884c\u6237\u540d')),
                ('bank_name', models.CharField(max_length=30, verbose_name='\u94f6\u884c\u540d')),
                ('total_coupon_count', models.PositiveIntegerField(default=0, verbose_name='\u91d1\u5e01\u5151\u6362\u70b9\u5238\u603b\u91cf')),
                ('sale_coupon_count', models.PositiveIntegerField(default=0, verbose_name='\u70b9\u5238\u552e\u5356\u91cf')),
                ('residue_coupon_count', models.PositiveIntegerField(default=0, verbose_name='\u70b9\u5238\u4f59\u989d\u91cf')),
                ('selling_number', models.PositiveIntegerField(default=0, verbose_name='\u9500\u552e\u6b21\u6570')),
                ('total_coin_count', models.PositiveIntegerField(default=0, verbose_name='\u91d1\u5e01\u603b\u989d')),
                ('residue_coin_count', models.PositiveIntegerField(default=0, verbose_name='\u91d1\u5e01\u4f59\u989d')),
            ],
            options={
                'db_table': 'coupon_user_profile',
                'verbose_name': '\u7528\u6237\u4fe1\u606f',
                'verbose_name_plural': '\u7528\u6237\u4fe1\u606f',
            },
        ),
        migrations.CreateModel(
            name='ProtectTime',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.PositiveIntegerField(verbose_name='\u70b9\u5238\u4fdd\u62a4\u79d2')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='PurchaseCoupon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('purchase_num', models.CharField(max_length=30, verbose_name='\u8d2d\u4e70\u7f16\u53f7')),
                ('purchase_count', models.PositiveIntegerField(default=0, verbose_name='\u8d2d\u4e70\u6570\u91cf')),
                ('exchange_rate', models.CharField(max_length=20, verbose_name='\u5151\u6362\u7387')),
            ],
            options={
                'ordering': ['-id'],
                'db_table': 'purchase_coupon',
                'verbose_name': '\u8d2d\u4e70\u70b9\u5238',
                'verbose_name_plural': '\u8d2d\u4e70\u70b9\u5238',
            },
        ),
        migrations.CreateModel(
            name='SaleCoupon',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('sale_num', models.CharField(max_length=30, verbose_name='\u51fa\u552e\u7f16\u53f7')),
                ('sell_count', models.PositiveIntegerField(default=0, verbose_name='\u51fa\u552e\u6570\u91cf')),
                ('exchange_rate', models.CharField(max_length=20, verbose_name='\u5151\u6362\u7387')),
            ],
            options={
                'ordering': ['-id'],
                'db_table': 'sale_coupon',
                'verbose_name': '\u51fa\u552e\u70b9\u5238',
                'verbose_name_plural': '\u51fa\u552e\u70b9\u5238',
            },
        ),
        migrations.CreateModel(
            name='SellPresent',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.CharField(max_length=20, verbose_name='\u552e\u5356\u6700\u9ad8\u7387')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='SystemGiveCouponCount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.PositiveIntegerField(verbose_name='\u7cfb\u7edf\u8d60\u9001\u70b9\u5238\u6570')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='UserGiveCouponCount',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('deleted', models.PositiveIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='\u521b\u5efa\u65e5\u671f')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='\u66f4\u65b0\u65e5\u671f')),
                ('deleted_at', models.DateTimeField(null=True)),
                ('value', models.PositiveIntegerField(verbose_name='\u7528\u6237\u8d60\u9001\u70b9\u5238\u6570')),
            ],
            options={
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='UserProxy',
            fields=[
            ],
            options={
                'proxy': True,
            },
            bases=('auth.user',),
            managers=[
                ('normal_users', django.db.models.manager.Manager()),
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.AddField(
            model_name='salecoupon',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_saler', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='purchasecoupon',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_purchaser', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='profile',
            name='superior',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, related_name='user_proxy', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='profile',
            name='user',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='coupon',
            name='user',
            field=models.ForeignKey(db_constraint=False, on_delete=django.db.models.deletion.CASCADE, related_name='user_superior', to=settings.AUTH_USER_MODEL),
        ),
    ]