from django.contrib import admin
from .models import Doctor

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['id', 'doctor_name', 'specialization', 'phone']
    list_filter = ['specialization']
    search_fields = ['first_name', 'last_name', 'specialization']
    
    def doctor_name(self, obj):
        if hasattr(obj, 'first_name') and hasattr(obj, 'last_name'):
            return f"Dr. {obj.first_name} {obj.last_name}"
        return f"Doctor {obj.id}"
    doctor_name.short_description = 'Name'