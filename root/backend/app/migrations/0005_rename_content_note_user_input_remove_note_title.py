# Generated by Django 5.0.6 on 2024-06-25 14:42

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_note_delete_imagegenerate'),
    ]

    operations = [
        migrations.RenameField(
            model_name='note',
            old_name='content',
            new_name='user_input',
        ),
        migrations.RemoveField(
            model_name='note',
            name='title',
        ),
    ]
