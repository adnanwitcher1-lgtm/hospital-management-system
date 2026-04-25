from django.db import models
from prescriptions.models import PrescriptionItem

class Medicine(models.Model):
    CATEGORY_CHOICES = [
        ('Tablet', 'Tablet'),
        ('Capsule', 'Capsule'),
        ('Syrup', 'Syrup'),
        ('Injection', 'Injection'),
        ('Cream', 'Cream'),
    ]
    
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    manufacturer = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)
    reorder_level = models.IntegerField(default=10)
    expiry_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.name} - Stock: {self.stock_quantity}"

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.reorder_level

class StockMovement(models.Model):
    MOVEMENT_TYPES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
    ]
    
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    movement_type = models.CharField(max_length=3, choices=MOVEMENT_TYPES)
    prescription_item = models.ForeignKey(PrescriptionItem, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.movement_type}: {self.medicine.name} x{self.quantity}"