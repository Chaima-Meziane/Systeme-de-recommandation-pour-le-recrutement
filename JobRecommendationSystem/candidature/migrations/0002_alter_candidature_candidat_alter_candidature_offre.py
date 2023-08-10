# Generated by Django 4.1.10 on 2023-08-09 13:26

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('offre', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('candidature', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='candidature',
            name='candidat',
            field=models.ForeignKey(default=0, limit_choices_to={'is_candidat': True}, on_delete=django.db.models.deletion.CASCADE, related_name='candidatures', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='candidature',
            name='offre',
            field=models.ForeignKey(default=0, on_delete=django.db.models.deletion.CASCADE, to='offre.offre'),
        ),
    ]
