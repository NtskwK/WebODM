# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.contrib.gis.db import models

from .project import Project as webodm_project

class YcPolygon(models.Model):
    project_id = models.ForeignKey(webodm_project, blank=True, null=True, on_delete=models.DO_NOTHING, db_column='project_id', related_name='yc_projects')
    name = models.CharField(max_length=255, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    # WGS84 2D
    poly = models.MultiPolygonField(dim=2, srid=4326)
    is_delete = models.BooleanField(blank=True,null=True)
