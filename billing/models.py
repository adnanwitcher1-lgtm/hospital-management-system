from django.db import models
from patients.models import Patient
from appointments.models import Appointment

class Billing(models.Model):
    PAYMENT_STATUS = [
        ('Paid', 'Paid'),
        ('Pending', 'Pending'),
        ('Overdue', 'Overdue'),
        ('Refunded', 'Refunded'),
    ]
    
    PAYMENT_METHOD = [
        ('Cash', 'Cash'),
        ('Card', 'Card'),
        ('Insurance', 'Insurance'),
        ('Online', 'Online'),
    ]
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='bills')
    appointment = models.ForeignKey(Appointment, on_delete=models.SET_NULL, null=True, blank=True)
    bill_number = models.CharField(max_length=50, unique=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='Pending')
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD, blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(blank=True, null=True)
    
    def save(self, *args, **kwargs):
        self.total_amount = self.amount + self.tax - self.discount
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"Bill {self.bill_number} - {self.patient.name}"

# Add Invoice as an alias for Billing (for compatibility)
Invoice = Billing