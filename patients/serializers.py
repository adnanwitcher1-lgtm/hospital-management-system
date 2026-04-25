from rest_framework import serializers
from .models import Patient


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'id',
            'first_name',
            'last_name',
            'date_of_birth',
            'gender',
            'phone',
            'email',
            'address',
            'blood_group',
            'disease',
            'doctor_assigned',
            'admission_date',
            'discharge_date',
            'emergency_contact'
        ]