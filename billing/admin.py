from django.contrib import admin
from .models import Billing

@admin.register(Billing)
class BillingAdmin(admin.ModelAdmin):
    list_display = ['bill_number', 'patient', 'total_amount', 'status', 'created_at']
    list_filter = ['status', 'payment_method']
    search_fields = ['bill_number', 'patient__first_name', 'patient__last_name']
    readonly_fields = ['bill_number', 'total_amount', 'created_at']
    
    def patient(self, obj):
        return f"{obj.patient.first_name} {obj.patient.last_name}"
    patient.short_description = 'Patient'