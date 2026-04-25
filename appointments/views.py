from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from Hospital.utils import send_appointment_confirmation
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        return queryset
    
    @action(detail=False, methods=['get'])
    def today(self, request):
        today = timezone.now().date()
        appointments = Appointment.objects.filter(appointment_date=today)
        serializer = self.get_serializer(appointments, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Cancelled'
        appointment.save()
        return Response({'message': 'Appointment cancelled successfully'})
    
    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        appointment = self.get_object()
        appointment.status = 'Completed'
        appointment.save()
        return Response({'message': 'Appointment marked as completed'})
    
    def perform_create(self, serializer):
        appointment = serializer.save()
        
        # Send email notification (optional)
        try:
            send_appointment_confirmation(
                patient_email=appointment.patient.email,
                patient_name=f"{appointment.patient.first_name} {appointment.patient.last_name}",
                doctor_name=f"{appointment.doctor.first_name} {appointment.doctor.last_name}",
                date=appointment.appointment_date,
                time=appointment.appointment_time
            )
        except Exception as e:
            print(f"Email notification error: {e}")
        
        return appointment