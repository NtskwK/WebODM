# Generated by Django 2.2.27 on 2024-09-14 17:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0042_ycpolygon'),
    ]

    operations = [
        migrations.AddField(
            model_name='monitorpoint',
            name='name',
            field=models.CharField(blank=True, max_length=30, null=True),
        ),
    ]