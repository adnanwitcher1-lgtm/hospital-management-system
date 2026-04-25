from django.contrib import admin
from .models import Prescription, PrescriptionItem

class PrescriptionItemInline(admin.TabularInline):
    model = PrescriptionItem
    extra = 1

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'patient_name', 'doctor_name', 'created_at']
    list_filter = ['created_at']
    search_fields = ['patient__first_name', 'patient__last_name', 'doctor__first_name', 'doctor__last_name']
    inlines = [PrescriptionItemInline]
    
    def patient_name(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    patient_name.short_description = 'Patient'
    
    def doctor_name(self, obj):
        if obj.doctor:
            return f"Dr. {obj.doctor.first_name} {obj.doctor.last_name}"
        return "Unknown"
    doctor_name.short_description = 'Doctor'

@admin.register(PrescriptionItem)
class PrescriptionItemAdmin(admin.ModelAdmin):
    list_display = ['prescription', 'medicine_name', 'dosage', 'duration']
    search_fields = ['medicine_name']