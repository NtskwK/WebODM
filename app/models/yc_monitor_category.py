# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models


class MonitorCategory(models.Model):
    raw1_unit_c = models.CharField(max_length=20, blank=True, null=True)
    raw1_unit = models.CharField(max_length=10, blank=True, null=True)
    raw1_decimal = models.CharField(max_length=10, blank=True, null=True)
    raw2_unit_c = models.CharField(max_length=20, blank=True, null=True)
    raw2_unit = models.CharField(max_length=10, blank=True, null=True)
    raw2_decimal = models.CharField(max_length=10, blank=True, null=True)
    raw3_unit_c = models.CharField(max_length=20, blank=True, null=True)
    raw3_unit = models.CharField(max_length=10, blank=True, null=True)
    raw3_decimal = models.CharField(max_length=10, blank=True, null=True)
    raw_num = models.IntegerField(blank=True, null=True)
    med1_unit_c = models.CharField(max_length=20, blank=True, null=True)
    med1_unit = models.CharField(max_length=10, blank=True, null=True)
    med1_formula = models.CharField(max_length=256, blank=True, null=True)
    med1_decimal = models.CharField(max_length=10, blank=True, null=True)
    med2_unit_c = models.CharField(max_length=20, blank=True, null=True)
    med2_unit = models.CharField(max_length=10, blank=True, null=True)
    med2_formula = models.CharField(max_length=256, blank=True, null=True)
    med2_decimal = models.CharField(max_length=10, blank=True, null=True)
    med3_unit_c = models.CharField(max_length=20, blank=True, null=True)
    med3_unit = models.CharField(max_length=10, blank=True, null=True)
    med3_formula = models.CharField(max_length=256, blank=True, null=True)
    med3_decimal = models.CharField(max_length=10, blank=True, null=True)
    med4_unit_c = models.CharField(max_length=20, blank=True, null=True)
    med4_unit = models.CharField(max_length=10, blank=True, null=True)
    med4_formula = models.CharField(max_length=256, blank=True, null=True)
    med4_decimal = models.CharField(max_length=10, blank=True, null=True)
    med_num = models.IntegerField(blank=True, null=True)
    res1_unit_c = models.CharField(max_length=20, blank=True, null=True)
    res1_unit = models.CharField(max_length=10, blank=True, null=True)
    res1_formula = models.CharField(max_length=256, blank=True, null=True)
    res1_decimal = models.CharField(max_length=10, blank=True, null=True)
    res2_unit_c = models.CharField(max_length=20, blank=True, null=True)
    res2_unit = models.CharField(max_length=10, blank=True, null=True)
    res2_formula = models.CharField(max_length=256, blank=True, null=True)
    res2_decimal = models.CharField(max_length=10, blank=True, null=True)
    res3_unit_c = models.CharField(max_length=20, blank=True, null=True)
    res3_unit = models.CharField(max_length=10, blank=True, null=True)
    res3_formula = models.CharField(max_length=256, blank=True, null=True)
    res3_decimal = models.CharField(max_length=10, blank=True, null=True)
    res4_unit_c = models.CharField(max_length=20, blank=True, null=True)
    res4_unit = models.CharField(max_length=10, blank=True, null=True)
    res4_formula = models.CharField(max_length=256, blank=True, null=True)
    res4_decimal = models.CharField(max_length=10, blank=True, null=True)
    res_num = models.IntegerField(blank=True, null=True)
    org_device_id = models.IntegerField(blank=True, null=True)
    monitor_type_id = models.IntegerField(blank=True, null=True)
    monitor_rate = models.IntegerField(blank=True, null=True)
    monitor_date_last = models.DateField(blank=True, null=True)
    monitor_batch_last = models.IntegerField(blank=True, null=True)
    project_id = models.IntegerField(blank=True, null=True)
    remark = models.CharField(max_length=512, blank=True, null=True)
    enable = models.DateField(blank=True, null=True)
    is_delete = models.BooleanField(blank=True, null=True)

    class Meta:
        # managed = False
        db_table = 'yc_monitor_category'