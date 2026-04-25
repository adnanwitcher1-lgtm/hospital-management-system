from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend

from .models import Patient
from .serializers import PatientSerializer


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer

    # 🔐 Security
    permission_classes = [IsAuthenticated]

    # 🔍 Search + Filter
    filter_backends = [SearchFilter, DjangoFilterBackend]

    search_fields = ['first_name', 'last_name', 'phone']
    filterset_fields = ['gender', 'blood_group']