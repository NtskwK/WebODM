from django.db.models import signals
from django.dispatch import receiver
from django.contrib.auth.models import User, Group
import logging

from app.models.project import Project
from app.models.yc_project import YcProject

logger = logging.getLogger('app.logger')


@receiver(signals.post_save, sender=User, dispatch_uid="user_check_default_group")
def check_default_group(sender, instance, created, **kwargs):
    if created:
        try:
            default_group = Group.objects.get(name="Default")
            instance.groups.add(default_group)
            instance.save()
            logger.info("Added {} to default group".format(instance.username))
        except:
            # Group "Default" is not available, probably loading fixtures at this moment...
            pass


@receiver(signals.post_save, sender=Project, dispatch_uid="auto_yc_project_create")
def auto_yc_project_create(sender, instance, created, **kwargs):
    if created:
        YcProject.objects.create(
            project_id=instance,
            name=instance.name,
            description=instance.description,
            tags=instance.tags,
        )

@receiver(signals.post_save, sender=Project, dispatch_uid="auto_yc_project_create")
def auto_yc_project_update(sender, instance, created, **kwargs):
    if not created:
        try:
            YcProject.objects.create(
            project_id=instance,
            name=instance.name,
            description=instance.description,
            tags=instance.tags,
        )
        except:
            # YcProject is not available, probably loading fixtures at this moment...
            pass
    else:
        ycInstance = YcProject.objects.get(project_id=instance)
        ycInstance.name = instance.name
        ycInstance.description = instance.description
        ycInstance.tags = instance.tags
        ycInstance.save()
