# Generated by Django 4.1 on 2023-08-11 10:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('offre', '0005_rename_candidat_offre_coordinateur'),
    ]

    operations = [
        migrations.RenameField(
            model_name='offre',
            old_name='coordinateur',
            new_name='coordinateur_id',
        ),
    ]