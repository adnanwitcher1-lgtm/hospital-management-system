from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django.http import HttpResponse
from .models import Prescription, PrescriptionItem
from .serializers import PrescriptionSerializer, PrescriptionItemSerializer


class PrescriptionViewSet(viewsets.ModelViewSet):
    queryset = Prescription.objects.all()
    serializer_class = PrescriptionSerializer
    permission_classes = [IsAuthenticated]


class PrescriptionItemViewSet(viewsets.ModelViewSet):
    queryset = PrescriptionItem.objects.all()
    serializer_class = PrescriptionItemSerializer
    permission_classes = [IsAuthenticated]


def generate_pdf(request, pk):
    # Temporary response until Pillow is compatible with Python 3.14
    return HttpResponse(
        "PDF generation will be available soon. Please use Python 3.11 for PDF support.",
        status=200,
        content_type="text/plain"
    )