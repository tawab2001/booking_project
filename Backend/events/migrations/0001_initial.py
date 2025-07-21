from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('description', models.TextField()),
                ('phone', models.CharField(max_length=20)),
                ('email', models.EmailField(max_length=254)),
                ('address', models.CharField(max_length=255)),
                ('venue', models.CharField(max_length=255)),
                ('category', models.CharField(blank=True, max_length=100, null=True)),
                ('social_image', models.URLField(blank=True, max_length=500, null=True)),
                ('cover_image', models.URLField(blank=True, max_length=500, null=True)),
                ('dates', models.JSONField(blank=True, null=True)),
                ('tickets', models.JSONField(blank=True, null=True)),
                ('startSales', models.DateTimeField(blank=True, null=True)),
                ('endSales', models.DateTimeField(blank=True, null=True)),
                ('paymentMethod', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('creator', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='created_events', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'events_event',
                'ordering': ['-created_at'],
            },
        ),
    ] 