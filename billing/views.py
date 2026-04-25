from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from .models import Billing
from .serializers import BillingSerializer

class BillingViewSet(viewsets.ModelViewSet):
    queryset = Billing.objects.all().order_by('-created_at')
    serializer_class = BillingSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'])
    def process_payment(self, request, pk=None):
        bill = self.get_object()
        bill.status = 'Paid'
        bill.paid_at = timezone.now()
        bill.payment_method = request.data.get('payment_method', 'Cash')
        bill.save()
        return Response({'message': 'Payment processed successfully'})
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        bills = Billing.objects.filter(status='Pending')
        serializer = self.get_serializer(bills, many=True)
        return Response(serializer.data)