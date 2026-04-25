from django.db import models
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment


class Prescription(models.Model):
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='prescriptions')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='prescriptions')
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='prescriptions', null=True, blank=True)
    diagnosis = models.TextField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription #{self.id} - {self.patient}"


class PrescriptionItem(models.Model):
    prescription = models.ForeignKey(Prescription, on_delete=models.CASCADE, related_name='items')
    medicine_name = models.CharField(max_length=200)
    dosage = models.CharField(max_length=100)
    frequency = models.CharField(max_length=100, blank=True)
    duration = models.CharField(max_length=100)
    instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.medicine_name} - {self.dosage}"