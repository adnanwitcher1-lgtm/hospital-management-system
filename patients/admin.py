from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['id', 'first_name', 'last_name', 'email', 'phone', 'gender', 'disease']
    list_filter = ['gender', 'blood_group', 'disease']
    search_fields = ['first_name', 'last_name', 'email', 'phone']
    list_editable = ['disease']
    readonly_fields = ['admission_date']
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'date_of_birth', 'gender', 'blood_group')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'address', 'emergency_contact')
        }),
        ('Medical Information', {
            'fields': ('disease', 'doctor_assigned', 'admission_date', 'discharge_date')
        }),
    )