from django.db import models


class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]

    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O-'), ('O-', 'O-'),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)

    phone = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()

    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    disease = models.TextField(blank=True, null=True)

    doctor_assigned = models.ForeignKey(
        'doctors.Doctor',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    admission_date = models.DateTimeField(auto_now_add=True)
    discharge_date = models.DateTimeField(blank=True, null=True)

    emergency_contact = models.CharField(max_length=15)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"