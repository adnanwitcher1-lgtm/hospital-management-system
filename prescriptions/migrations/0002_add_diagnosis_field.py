from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('prescriptions', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescription',
            name='diagnosis',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='prescription',
            name='notes',
            field=models.TextField(blank=True, default=''),
        ),
    ]