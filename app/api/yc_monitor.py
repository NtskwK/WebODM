from django.views.decorators.csrf import csrf_exempt

from rest_framework import viewsets, status, permissions, serializers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.exceptions import NotFound

from django_filters import rest_framework as filters
from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist

from app.models.project import Project
from app.models.yc_monitor_category import MonitorCategory
from app.models.yc_monitor_data import MonitorData
from app.models.yc_monitor_point import MonitorPoint
from app.models.yc_project import YcProject
from webodm import settings

import logging

logger = logging.getLogger('django')

class isAdminUserorReadOnly(permissions.BasePermission):
    
    # Can not edit by web client
    IS_SINGLE_CLIENT = True
    
    message = 'You do not have permission to perform this action.'
    
    def has_permission(self, request, view):

        if request.method in permissions.SAFE_METHODS:
            return True
        
        if request.user.is_staff:
            return settings.DEV \
                or settings.DEBUG \
                or self.IS_SINGLE_CLIENT
        
        return False

class YcProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = YcProject
        fields = '__all__'


class YcProjectFilter(filters.FilterSet):
    class Meta:
        model = YcProject
        fields = ['id', 'name', 'project_id']

class YcProjectViewSet(viewsets.ModelViewSet):
    queryset = YcProject.objects.all()
    serializer_class = YcProjectSerializer
    filterset_class = YcProjectFilter

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
    
    def perform_destroy(self, instance):
        # instance.delete()
        instance.is_delete = True
        instance.save()

class MonitorPointSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonitorPoint
        fields = '__all__'

class YcMonitorFilter(filters.FilterSet):
    class Meta:
        model = MonitorPoint
        fields = ['id', 'name', 'project_id', 'category_id']

class YcMonitorPointViewSet(viewsets.ModelViewSet):
    
    queryset = MonitorPoint.objects.all()
    serializer_class = MonitorPointSerializer
    permission_classes = [isAdminUserorReadOnly]
    filterset_class = YcMonitorFilter

    def perform_destroy(self, instance):
        # instance.delete()
        instance.is_delete = True
        instance.save()

class YcMonitorCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = YcProject
        fields = '__all__'

class YcMonitorCategoryFilter(filters.FilterSet):
    class Meta:
        model = MonitorCategory
        fields = ['id', 'remark', 'enable', 'monitor_date_last']

class YcMonitorCategoryViewSet(viewsets.ModelViewSet):
    
    queryset = MonitorCategory.objects.all()
    serializer_class = YcMonitorCategorySerializer
    permission_classes = [isAdminUserorReadOnly]
    filterset_class = YcMonitorCategoryFilter
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if not request.user.is_staff and instance.enable == False:
            return Response({'message': 'Monitor category is not enabled'}, status=status.HTTP_403_FORBIDDEN)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        
        if not request.user.is_staff:
            queryset = queryset.filter(enable=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def perform_destroy(self, instance):
        # instance.delete()
        instance.is_delete = True
        instance.save()
        return Response({'message': '删除成功'}, status=status.HTTP_200_OK)

class YcMonitorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonitorData
        fields = '__all__'

class YcMonitorDataFilter(filters.FilterSet):
    class Meta:
        model = MonitorData
        fields = ['monitor_date', 'monitor_id', 'category_id', 'monitor_batch']

class YcMonitorDataViewSet(viewsets.ModelViewSet):
    
    queryset = MonitorData.objects.all()
    serializer_class = YcMonitorDataSerializer
    permission_classes = [isAdminUserorReadOnly]
    filterset_class = YcMonitorDataFilter
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def perform_destroy(self, instance):
        # instance.delete()
        instance.is_delete = True
        instance.save()
