from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, StockMovementViewSet

router = DefaultRouter()
router.register(r'medicines', MedicineViewSet)
router.register(r'stock-movements', StockMovementViewSet)

urlpatterns = [
    path('', include(router.urls)),
]