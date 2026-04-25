from rest_framework import serializers
from .models import Medicine, StockMovement

class MedicineSerializer(serializers.ModelSerializer):
    is_low_stock = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Medicine
        fields = '__all__'

class StockMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockMovement
        fields = '__all__'