from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum
from patients.models import Patient
from doctors.models import Doctor
from appointments.models import Appointment
from billing.models import Billing


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_stats(request):
    try:
        # Simple counts - no created_at filter
        total_patients = Patient.objects.count()
        total_doctors = Doctor.objects.count()
        total_appointments = Appointment.objects.count()
        
        # Today's appointments
        today = timezone.now().date()
        today_appointments = Appointment.objects.filter(appointment_date=today).count()
        
        # Appointment status counts
        pending_appointments = Appointment.objects.filter(status='Pending').count()
        completed_appointments = Appointment.objects.filter(status='Completed').count()
        
        # Revenue calculation
        revenue_result = Billing.objects.filter(status='Paid').aggregate(total=Sum('total_amount'))
        total_revenue = float(revenue_result['total']) if revenue_result['total'] else 0
        pending_bills = Billing.objects.filter(status='Pending').count()
        
        # New patients (using admission_date instead of created_at)
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)
        new_patients_week = Patient.objects.filter(admission_date__gte=week_ago).count()
        new_patients_month = Patient.objects.filter(admission_date__gte=month_ago).count()
        
        stats = {
            'total_patients': total_patients,
            'total_doctors': total_doctors,
            'total_appointments': total_appointments,
            'today_appointments': today_appointments,
            'pending_appointments': pending_appointments,
            'completed_appointments': completed_appointments,
            'total_revenue': total_revenue,
            'pending_bills': pending_bills,
            'new_patients_week': new_patients_week,
            'new_patients_month': new_patients_month,
        }
        
        return Response(stats)
        
    except Exception as e:
        print(f"Dashboard error: {e}")
        return Response({
            'total_patients': Patient.objects.count(),
            'total_doctors': Doctor.objects.count(),
            'total_appointments': Appointment.objects.count(),
            'today_appointments': 0,
            'pending_appointments': 0,
            'completed_appointments': 0,
            'total_revenue': 0,
            'pending_bills': 0,
            'new_patients_week': 0,
            'new_patients_month': 0,
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recent_activity(request):
    try:
        recent_appointments = Appointment.objects.select_related('patient', 'doctor').order_by('-id')[:10]
        recent_patients = Patient.objects.order_by('-id')[:5]
        recent_bills = Billing.objects.select_related('patient').order_by('-id')[:5]
        
        data = {
            'recent_appointments': [
                {
                    'id': a.id,
                    'patient': f"{a.patient.first_name} {a.patient.last_name}" if a.patient else "Unknown",
                    'doctor': f"Dr. {a.doctor.first_name} {a.doctor.last_name}" if a.doctor else "Unknown",
                    'date': a.appointment_date,
                    'status': a.status
                } for a in recent_appointments
            ],
            'recent_patients': [
                {
                    'id': p.id,
                    'name': f"{p.first_name} {p.last_name}",
                } for p in recent_patients
            ],
            'recent_bills': [
                {
                    'id': b.id,
                    'patient': f"{b.patient.first_name} {b.patient.last_name}" if b.patient else "Unknown",
                    'amount': float(b.total_amount) if b.total_amount else 0,
                    'status': b.status
                } for b in recent_bills
            ]
        }
        return Response(data)
        
    except Exception as e:
        return Response({'recent_appointments': [], 'recent_patients': [], 'recent_bills': []})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def appointment_stats(request):
    try:
        today = timezone.now().date()
        week_data = []
        
        for i in range(7):
            date = today - timedelta(days=i)
            count = Appointment.objects.filter(appointment_date=date).count()
            week_data.append({'date': date, 'count': count})
        
        return Response({'weekly_appointments': week_data})
        
    except Exception as e:
        return Response({'weekly_appointments': []})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def revenue_stats(request):
    try:
        from django.db.models.functions import TruncMonth
        monthly_revenue = Billing.objects.filter(status='Paid').annotate(
            month=TruncMonth('paid_at')
        ).values('month').annotate(total=Sum('total_amount')).order_by('-month')[:6]
        
        result = []
        for item in monthly_revenue:
            result.append({
                'month': item['month'].strftime('%B %Y') if item['month'] else 'Unknown',
                'total': float(item['total']) if item['total'] else 0
            })
        
        return Response({'monthly_revenue': result})
        
    except Exception as e:
        return Response({'monthly_revenue': []})