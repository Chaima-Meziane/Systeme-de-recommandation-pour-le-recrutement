# Generated by Django 4.1.10 on 2023-08-26 16:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entretien', '0002_remove_entretien_heure_entretien_heure_debut_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='entretien',
            name='lien_reunion',
            field=models.URLField(blank=True, null=True),
        ),
    ]