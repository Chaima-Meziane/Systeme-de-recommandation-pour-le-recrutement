# Generated by Django 4.1 on 2023-07-25 14:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('entretien', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='entretien',
            name='resultat',
            field=models.CharField(choices=[('accepte', 'Accepté'), ('en_attente', 'En attente'), ('refuse', 'Refusé')], default='en_attente', max_length=20),
        ),
    ]
