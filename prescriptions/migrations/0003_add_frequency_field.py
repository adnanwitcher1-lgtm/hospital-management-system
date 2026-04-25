from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [
        ('prescriptions', '0002_add_diagnosis_field'),
    ]

    operations = [
        migrations.AddField(
            model_name='prescriptionitem',
            name='frequency',
            field=models.CharField(blank=True, default='', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='prescriptionitem',
            name='instructions',
            field=models.TextField(blank=True, default=''),
        ),
    ]