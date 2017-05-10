#!/usr/bin/env python
# coding=utf-8

from __future__ import unicode_literals

import six
from django.http import Http404
from django.db.models import ObjectDoesNotExist
from django.core.exceptions import PermissionDenied
from rest_framework import generics, exceptions, status
from rest_framework.views import set_rollback, APIView as _APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, BasePermission

from common import pagination


class APIView(_APIView):
    permission_classes = (IsAuthenticated,)


class ListCreateAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = pagination.PagePagination


class ListAPIView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    pagination_class = pagination.PagePagination


class RetrieveAPIView(generics.RetrieveAPIView):
    permission_classes = (IsAuthenticated,)


class RetrieveUpdateAPIView(generics.RetrieveUpdateAPIView):
    permission_classes = (IsAuthenticated,)


class UpdateAPIView(generics.UpdateAPIView):
    permission_classes = (IsAuthenticated,)


class DestroyAPIView(generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)


class RetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)


class AllView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class IsSuperUser(BasePermission):
    """
    Allows access only to admin users.
    """

    def has_permission(self, request, view):
        return request.user and request.user.is_superuser


class UniqueCheck(_APIView):

    queryset = None

    def get(self, request):
        name = request.query_params.get('name')
        user_id = request.query_params.get('user_id')
        query = self.queryset.filter(name=name, creator__id=user_id)

        return Response(not query.exists())
