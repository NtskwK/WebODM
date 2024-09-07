from rest_framework import viewsets, status
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action

from app.models.yc_monitor_category import MonitorCategory
from app.models.yc_monitor_data import MonitorData
from app.models.yc_monitor_point import MonitorPoint
from app.models.yc_project import YcProject

class isAdminUserorReadOnly(permissions.BasePermission):
    
    # Can not edit by web client
    IS_SINGLE_CLIENT = True
    
    message = 'You do not have permission to perform this action.'
    
    def has_permission(self, request, view):

        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff and self.IS_SINGLE_CLIENT == False

class YcProjectViewSet(viewsets.ModelViewSet):
    
    queryset = YcProject.objects.all()
    
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
            
class YcMonitorPointViewSet(viewsets.ModelViewSet):
    
    queryset = MonitorPoint.objects.all()
    permission_classes = [isAdminUserorReadOnly]
    
    def perform_destroy(self, instance):
        # instance.delete()
        instance.is_delete = True
        instance.save()

class YcMonitorCategoryViewSet(viewsets.ModelViewSet):
    
    queryset = MonitorCategory.objects.all()
    permission_classes = [isAdminUserorReadOnly]
    
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
    
class YcMonitorDataViewSet(viewsets.ModelViewSet):
    
    queryset = MonitorData.objects.all()
    permission_classes = [isAdminUserorReadOnly]
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)
    
    def perform_destroy(self, instance):
        # instance.delete()
        instance.is_delete = True
        instance.save()
