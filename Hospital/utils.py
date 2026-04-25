# D:\HMS\Hospital\Hospital\utils.py

from django.core.mail import send_mail
from django.conf import settings

def send_appointment_confirmation(patient_email, patient_name, doctor_name, date, time):
    """Send appointment confirmation email"""
    subject = f'Appointment Confirmation - Hospital HMS'
    message = f"""
    Dear {patient_name},
    
    Your appointment has been confirmed!
    
    Doctor: Dr. {doctor_name}
    Date: {date}
    Time: {time}
    
    Please arrive 15 minutes early.
    
    Thank you,
    Hospital Management System
    """
    
    # For now, just print to console (email not configured)
    print(f"Email would be sent to: {patient_email}")
    print(f"Subject: {subject}")
    print(f"Message: {message}")
    
    # Uncomment when email is configured
    # try:
    #     send_mail(subject, message, settings.EMAIL_HOST_USER, [patient_email])
    # except Exception as e:
    #     print(f"Email error: {e}")