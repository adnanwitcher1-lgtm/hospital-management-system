from rest_framework import serializers
from .models import Prescription, PrescriptionItem


class PrescriptionItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrescriptionItem
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    items = PrescriptionItemSerializer(many=True, read_only=True)
    
    # Add doctor_name field
    doctor_name = serializers.SerializerMethodField()
    patient_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Prescription
        fields = '__all__'
    
    def get_doctor_name(self, obj):
        if obj.doctor:
            # Your Doctor model uses 'name' field
            if hasattr(obj.doctor, 'name') and obj.doctor.name:
                return obj.doctor.name
            # Fallback
            if hasattr(obj.doctor, 'first_name'):
                return f"{obj.doctor.first_name} {obj.doctor.last_name or ''}"
        return "Unknown"
    
    def get_patient_name(self, obj):
        if obj.patient:
            return f"{obj.patient.first_name} {obj.patient.last_name}"
        return "Unknown"