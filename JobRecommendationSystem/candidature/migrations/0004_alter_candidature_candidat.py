# Generated by Django 4.1.10 on 2023-08-10 09:01

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('candidature', '0003_alter_candidature_candidat_alter_candidature_offre'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidature',
            name='candidat',
            field=models.ForeignKey(default=None, limit_choices_to={'is_candidat': True}, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
