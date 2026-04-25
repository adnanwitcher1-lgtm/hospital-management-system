from django.urls import path, include
from rest_framework.routers import DefaultRouter
from doctors.views import DoctorViewSet
from patients.views import PatientViewSet
from appointments.views import AppointmentViewSet
from prescriptions.views import PrescriptionViewSet
from billing.views import BillingViewSet
from dashboard.views import DashboardViewSet
from authentication.views import UserViewSet

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet)
router.register(r'patients', PatientViewSet)
router.register(r'appointments', AppointmentViewSet)
router.register(r'prescriptions', PrescriptionViewSet)
router.register(r'billing', BillingViewSet)
router.register(r'dashboard', DashboardViewSet)
router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]