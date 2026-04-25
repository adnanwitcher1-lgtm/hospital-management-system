from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PrescriptionViewSet, PrescriptionItemViewSet, generate_pdf

router = DefaultRouter()
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'prescription-items', PrescriptionItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('pdf/<int:pk>/', generate_pdf, name='generate_pdf'),
]