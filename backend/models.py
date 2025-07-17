# api/models.py
from django.db import models
import uuid
from django.utils import timezone

class BusinessHours(models.Model):
    day_of_week = models.IntegerField(choices=[(i, i) for i in range(7)])
    open_time = models.TimeField()
    close_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['day_of_week']

class BusinessHourException(models.Model):
    date = models.DateField()
    is_closed = models.BooleanField(default=True)
    alternative_open_time = models.TimeField(null=True, blank=True)
    alternative_close_time = models.TimeField(null=True, blank=True)
    reason = models.CharField(max_length=200)

class SystemConfig(models.Model):
    is_system_paused = models.BooleanField(default=False)
    maintenance_message = models.CharField(max_length=200, blank=True)

class Category(models.Model):
    name = models.CharField(max_length=100)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)

    class Meta:
        ordering = ['sort_order', 'name']
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='menu_items')
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    is_promotion = models.BooleanField(default=False)
    is_discount_active = models.BooleanField(default=False)
    discount_percent = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sort_order = models.IntegerField(default=0)
    stock_control_enabled = models.BooleanField(default=False)
    current_stock = models.IntegerField(null=True, blank=True)
    sku_code = models.CharField(max_length=50, unique=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return self.name

class ModifierGroup(models.Model):
    name = models.CharField(max_length=100)
    is_required = models.BooleanField(default=False)
    min_choices = models.IntegerField(default=0)
    max_choices = models.IntegerField(default=1)
    sort_order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class ModifierOption(models.Model):
    group = models.ForeignKey(ModifierGroup, on_delete=models.CASCADE, related_name='options')
    name = models.CharField(max_length=100)
    price_addition = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    sku_code = models.CharField(max_length=50, unique=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.name} (+R${self.price_addition})"

class Variant(models.Model):
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=100)
    price_addition = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)
    sort_order = models.IntegerField(default=0)
    sku_code = models.CharField(max_length=50, unique=True)
    stock_control_enabled = models.BooleanField(default=False)
    current_stock = models.IntegerField(null=True, blank=True)

    class Meta:
        ordering = ['sort_order', 'name']

    def __str__(self):
        return f"{self.menu_item.name} - {self.name}"

class Customer(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=200)
    phone_number = models.CharField(max_length=20, unique=True)
    address = models.TextField(blank=True)
    is_blocked = models.BooleanField(default=False)
    total_orders = models.IntegerField(default=0)
    loyalty_points = models.IntegerField(default=0)
    first_order_at = models.DateTimeField(null=True, blank=True)
    last_order_at = models.DateTimeField(null=True, blank=True)
    segment = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return f"{self.name} ({self.phone_number})"

class CustomerTag(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='tags')
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name

class Order(models.Model):
    SERVICE_CHOICES = [
        ('delivery', 'Delivery'),
        ('pickup', 'Retirada'),
        ('local', 'Presencial')
    ]
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('preparing', 'Em Preparo'),
        ('ready', 'Pronto'),
        ('delivered', 'Entregue'),
        ('cancelled', 'Cancelado'),
        ('completed', 'Finalizado')
    ]
    ORIGIN_CHOICES = [
        ('app', 'Aplicativo'),
        ('site', 'Website'),
        ('local', 'Balcão')
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    daily_order_id = models.IntegerField()
    customer = models.ForeignKey(Customer, on_delete=models.PROTECT)
    service_type = models.CharField(max_length=20, choices=SERVICE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    origin = models.CharField(max_length=20, choices=ORIGIN_CHOICES)
    table_name = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    delivery_address = models.TextField(blank=True)
    attended_by = models.CharField(max_length=100)
    delivery_person = models.CharField(max_length=100, blank=True)
    payment_status = models.CharField(max_length=20, default='pending')
    total_items = models.IntegerField(default=0)
    items_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    total_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount_code = models.CharField(max_length=50, blank=True)
    service_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    packaging_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    total_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    tip_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Pedido #{self.daily_order_id} - {self.customer.name}"

    def save(self, *args, **kwargs):
        if not self.daily_order_id:
            # Gera ID diário sequencial
            last_order = Order.objects.filter(
                created_at__date=timezone.now().date()
            ).order_by('-daily_order_id').first()
            
            self.daily_order_id = (last_order.daily_order_id + 1 if last_order else 1)
        super().save(*args, **kwargs)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    variant = models.ForeignKey(Variant, on_delete=models.PROTECT, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    quantity = models.IntegerField()
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_modifiers_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2)
    notes = models.TextField(blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

class OrderItemModifier(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    modifier_option = models.ForeignKey(ModifierOption, on_delete=models.PROTECT)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.order_item.menu_item.name} - {self.modifier_option.name}"

class Payment(models.Model):
    PAYMENT_METHODS = [
        ('cash', 'Dinheiro'),
        ('credit', 'Cartão de Crédito'),
        ('debit', 'Cartão de Débito'),
        ('pix', 'PIX')
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='pending')

    def __str__(self):
        return f"{self.order.daily_order_id} - {self.get_method_display()} - R${self.amount}"

class UserInteraction(models.Model):
    interaction_date = models.DateTimeField(auto_now_add=True)
    menu_viewed = models.BooleanField(default=False)
    order_started_at = models.DateTimeField(null=True, blank=True)
    order_created_at = models.DateTimeField(null=True, blank=True)
    session_id = models.CharField(max_length=100)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Interação {self.session_id} - {self.interaction_date}"
