#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

import six


class OptionMeta(type):

    def __new__(mcs, name, bases, attrs):

        options = []
        values = []
        texts = []
        fields = []

        for field, value in attrs.items():

            if field.isupper():
                attrs[field] = value[0]
                values.append(value[0])
                texts.append(value[1])
                options.append(value)
                fields.append((field, value[0], value[1]))

        attrs['OPTIONS'] = options
        attrs['KEY_TEXTS'] = dict(options)
        attrs['VALUES'] = values
        attrs['TEXTS'] = texts
        attrs['FIELDS'] = fields

        return super(OptionMeta, mcs).__new__(mcs, name, bases, attrs)


class Option(six.with_metaclass(OptionMeta)):
    """
        class FRUITS(Option):
            APPLE = (1, "苹果")
            ORANGE = (2, "橘子")

        >> FRUITS.OPTIONS
        >> ((1, "苹果"), (2, "橘子"))
        >> FRUITS.text(1)
        >> 苹果
    """

    @classmethod
    def text(cls, key, default=None):
          return cls.KEY_TEXTS.get(key, default)


class StatusOptionMeta(type):

    def __new__(mcs, name, bases, attrs):

        options = []
        values = []
        busy_values = []
        texts = []
        fields = []

        for field, value in attrs.items():
            # value　format: (key, text, is_busy)
            if field.isupper():
                attrs[field] = value[0]
                values.append(value[0])
                if value[2]:
                    busy_values.append(value[0])
                texts.append(value[1])

                options.append(value[:2])
                fields.append((field, value[0], value[1], value[2]))

        attrs['OPTIONS'] = options
        attrs['KEY_TEXTS'] = dict(options)
        attrs['VALUES'] = values
        attrs['BUSY_VALUES'] = busy_values
        attrs['TEXTS'] = texts
        attrs['FIELDS'] = fields

        return super(StatusOptionMeta, mcs).__new__(mcs, name, bases, attrs)


class StatusOption(six.with_metaclass(StatusOptionMeta)):
    """
        class T(Option):
            PENDING = (1, "未定", True)
            AVAILABLE = (2, "可用", False)

        >> T.OPTIONS
        >> ((1, "未定"), (2, "可用"))
        >> T.text(1)
        >> 未定
        >> T.is_busy(1)
        >> True
    """

    @classmethod
    def text(cls, key, default=None):
        return cls.KEY_LABELS.get(key, default)

    @classmethod
    def is_busy(cls, status):
        return status in cls.BUSY_VALUES
