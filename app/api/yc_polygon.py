import os
from datetime import datetime

from django.contrib.gis.gdal import DataSource
from django.contrib.gis.utils import LayerMapping

from rest_framework import permissions
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from app.models.yc_project import YcProject
from app.models.yc_polygon import YcPolygon

from webodm.settings import MEDIA_TMP


class isAdminUserorReadOnly(permissions.BasePermission):
    # Can not edit by web client
    IS_SINGLE_CLIENT = True

    message = 'You do not have permission to perform this action.'

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff and self.IS_SINGLE_CLIENT == False


class YcPolygonViewSet(viewsets.ModelViewSet):
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

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


@action(detail=False, methods=['post'], permission_classes=[IsAdminUser])
def create(self, request, *args, **kwargs):
    files = request.FILES['file']

    if len(files) == 0:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    elif len(files) > 1:
        return Response(status=status.HTTP_503_SERVICE_UNAVAILABLE)
    else:
        file = files[0]
        filename = file.name
        filename_tmp = filename + datetime.timestamp()
        try:
            with open(MEDIA_TMP + '/' + filename_tmp, 'wb+') as tmp_file:
                for chunk in file.chunks():
                    tmp_file.write(chunk)
                ds = DataSource(MEDIA_TMP + '/' + filename_tmp)
                # 校验字段
                yc_mapping = {
                    "name": "str",
                    "poly": "Polygon"
                    # For geometry fields use OGC name. See https://gdal.org/user/vector_data_model.html
                }
                lm = LayerMapping(YcPolygon, ds, yc_mapping, transform=True, encoding='utf-8')
                lm.save()

        # except Exception as e:
        #     raise e
        # return http 500 by default behavior by django

        finally:
            try:
                os.remove(MEDIA_TMP + '/' + filename_tmp, )
            except Exception:
                pass

    return Response(status=status.HTTP_201_CREATED)
