from datetime import datetime

from rest_framework import viewsets, serializers, pagination, status
from rest_framework.response import Response

from app import models


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sensor
        fields = '__all__'


class CreateSensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sensor
        fields = ['name', 'description', 'task', 'longitude', 'latitude', 'data_url']


class SensorPagination(pagination.PageNumberPagination):
    page_query_param = 'page'
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50


class SensorViewSet(viewsets.ModelViewSet):
    http_method_names = ['get']
    queryset = models.Sensor.objects.all()
    serializer_class = SensorSerializer
    pagination_class = SensorPagination

    def create(self, request, *args, **kwargs):
        serializer = CreateSensorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def destroy(self, request, *args, **kwargs):
        sensor_instance = self.get_object()
        if sensor_instance.is_delete:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        if (not request.user.id == sensor_instance.owner.id) or (not request.user.is_superuser):
            return Response(status=status.HTTP_403_FORBIDDEN)

        sensor_data_queryset = models.SensorData.objects.filter(sensor_id=sensor_instance.sensor_id)
        for sensor_data_instance in sensor_data_queryset:
            sensor_data_instance.is_delete = True
        models.SensorData.objects.bulk_update(sensor_data_queryset, ['is_delete'])

        sensor_instance.is_delete = True
        sensor_instance.deleted_at = datetime.now()
        sensor_instance.save()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request, *args, **kwargs):
        queryset = self.queryset.filter(is_delete=False)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        if request.user.is_superuser or request.user.id == self.get_object().owner.id:
            return super().update(request, *args, **kwargs)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)

