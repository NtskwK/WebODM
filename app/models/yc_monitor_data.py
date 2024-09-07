from django.contrib.gis.db import models

from .yc_monitor_point import MonitorPoint
from .yc_monitor_category import MonitorCategory

class MonitorData(models.Model):
    monitor_batch = models.IntegerField(blank=True,null=True,help_text="Batch number")
    monitor_date = models.DateField(blank=True,null=True,help_text="Date of monitoring")
    monitor_id = models.ForeignKey(MonitorPoint, on_delete=models.CASCADE,help_text="Monitor id", blank=True,null=True)
    category_id = models.ForeignKey(MonitorCategory, on_delete=models.CASCADE,help_text="Category id", blank=True,null=True)
    ve1 = models.FloatField(blank=True,null=True)
    ve2 = models.FloatField(blank=True,null=True)
    ve3 = models.FloatField(blank=True,null=True)
    ve4 = models.FloatField(blank=True,null=True)
    vm1 = models.FloatField(blank=True,null=True)
    vm2 = models.FloatField(blank=True,null=True)
    vm3 = models.FloatField(blank=True,null=True)
    vm4 = models.FloatField(blank=True,null=True)
    vo1 = models.FloatField(blank=True,null=True)
    vo2 = models.FloatField(blank=True,null=True)
    vo3 = models.FloatField(blank=True,null=True)
    
    class Meta:
        db_table = 'yc_monitor_data'