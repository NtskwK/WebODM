# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models

from .yc_monitor_category import MonitorCategory
from .project import Project

class MonitorPoint(models.Model):
    project_id = models.ForeignKey(Project ,blank=True, null=True, on_delete=models.CASCADE)
    valid_id = models.IntegerField(default=0)
    sensor_iden = models.CharField(max_length=20, blank=True, null=True)
    category_id = models.ForeignKey(MonitorCategory, blank=True, null=True, on_delete=models.CASCADE)
    pos_y = models.IntegerField(blank=True, null=True)
    pos_x = models.IntegerField(blank=True, null=True)
    point_iden = models.CharField(max_length=20, blank=True, null=True)
    point_depth = models.FloatField(blank=True, null=True)
    monitor_date = models.DateTimeField(blank=True, null=True)
    init_date = models.DateField(blank=True, null=True)
    extra_channel = models.IntegerField(blank=True, null=True)
    dtu_id = models.IntegerField(blank=True, null=True)
    device_code = models.CharField(max_length=20, blank=True, null=True)
    device_address = models.CharField(max_length=128, blank=True, null=True)
    channel = models.IntegerField(blank=True, null=True)
    alarm_level = models.IntegerField(blank=True, null=True)
    raw1_init = models.FloatField(blank=True, null=True)
    raw1_last = models.FloatField(blank=True, null=True)
    raw2_init = models.FloatField(blank=True, null=True)
    raw2_last = models.FloatField(blank=True, null=True)
    raw3_init = models.FloatField(blank=True, null=True)
    raw3_last = models.FloatField(blank=True, null=True)
    med1_init = models.FloatField(blank=True, null=True)
    med1_last = models.FloatField(blank=True, null=True)
    med2_init = models.FloatField(blank=True, null=True)
    med2_last = models.FloatField(blank=True, null=True)
    med3_init = models.FloatField(blank=True, null=True)
    med3_last = models.FloatField(blank=True, null=True)
    med4_init = models.FloatField(blank=True, null=True)
    med4_last = models.FloatField(blank=True, null=True)
    res1_init = models.FloatField(blank=True, null=True)
    res1_last = models.FloatField(blank=True, null=True)
    res2_init = models.FloatField(blank=True, null=True)
    res2_last = models.FloatField(blank=True, null=True)
    res3_init = models.FloatField(blank=True, null=True)
    res3_last = models.FloatField(blank=True, null=True)
    res4_init = models.FloatField(blank=True, null=True)
    res4_last = models.FloatField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'yc_monitor_point'