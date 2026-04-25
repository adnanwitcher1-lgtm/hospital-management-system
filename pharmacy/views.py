from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import F
from .models import Medicine, StockMovement
from .serializers import MedicineSerializer, StockMovementSerializer


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class = MedicineSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=True, methods=['post'], url_path='update_stock')
    def update_stock(self, request, pk=None):
        medicine = self.get_object()
        quantity = request.data.get('quantity')
        movement_type = request.data.get('movement_type')
        
        if not quantity or not movement_type:
            return Response({'error': 'quantity and movement_type required'}, status=400)
        
        try:
            quantity = int(quantity)
        except ValueError:
            return Response({'error': 'quantity must be a number'}, status=400)
        
        if movement_type == 'IN':
            medicine.stock_quantity += quantity
        elif movement_type == 'OUT':
            if medicine.stock_quantity >= quantity:
                medicine.stock_quantity -= quantity
            else:
                return Response({'error': 'Insufficient stock'}, status=400)
        else:
            return Response({'error': 'Invalid movement_type. Use IN or OUT'}, status=400)
        
        medicine.save()
        
        StockMovement.objects.create(
            medicine=medicine,
            quantity=quantity,
            movement_type=movement_type,
            notes=request.data.get('notes', '')
        )
        
        serializer = self.get_serializer(medicine)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        medicines = Medicine.objects.filter(stock_quantity__lte=F('reorder_level'))
        serializer = self.get_serializer(medicines, many=True)
        return Response(serializer.data)


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all()
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]