from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Doctor
from .serializers import DoctorSerializer

class DoctorViewSet(viewsets.ModelViewSet):
    queryset = Doctor.objects.all().order_by('name')
    serializer_class = DoctorSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get'])
    def by_specialization(self, request):
        specialization = request.query_params.get('spec', '')
        doctors = Doctor.objects.filter(specialization__icontains=specialization, is_available=True)
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def available(self, request):
        doctors = Doctor.objects.filter(is_available=True)
        serializer = self.get_serializer(doctors, many=True)
        return Response(serializer.data)