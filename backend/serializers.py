# api/serializers.py
from rest_framework import serializers
from .models import (
    Customer, Category, MenuItem, Variant, 
    ModifierGroup, ModifierOption, Order, OrderItem, 
    OrderItemModifier, Payment, CustomerTag, BusinessHours,
    BusinessHourException, SystemConfig, UserInteraction
)

# --- SERIALIZERS DE LEITURA (PARA EXIBIR DADOS) ---

class ModifierOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ModifierOption
        fields = ['id', 'name', 'price_addition', 'is_active', 'sku_code', 'cost_price']

class ModifierGroupSerializer(serializers.ModelSerializer):
    options = ModifierOptionSerializer(many=True, read_only=True)
    class Meta:
        model = ModifierGroup
        fields = ['id', 'name', 'is_required', 'min_choices', 'max_choices', 'options', 'sort_order']

class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'name', 'price_addition', 'is_active', 'sort_order', 
                 'sku_code', 'stock_control_enabled', 'current_stock']

class MenuItemSerializer(serializers.ModelSerializer):
    variants = VariantSerializer(many=True, read_only=True)
    modifier_groups = ModifierGroupSerializer(many=True, read_only=True)

    class Meta:
        model = MenuItem
        fields = ['id', 'category', 'name', 'description', 'base_price', 
                 'is_active', 'is_promotion', 'is_discount_active', 
                 'discount_percent', 'sort_order', 'stock_control_enabled', 
                 'current_stock', 'sku_code', 'cost_price', 'variants', 
                 'modifier_groups']

class CategorySerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'is_active', 'sort_order', 'menu_items']

class CustomerTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerTag
        fields = ['id', 'name']

class CustomerSerializer(serializers.ModelSerializer):
    tags = CustomerTagSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ['id', 'name', 'phone_number', 'address', 'is_blocked',
                 'total_orders', 'loyalty_points', 'first_order_at',
                 'last_order_at', 'segment', 'tags']

# --- SERIALIZERS PARA PEDIDOS ---

class OrderItemModifierSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemModifier
        fields = ['id', 'modifier_option', 'price', 'cost_price']

class OrderItemSerializer(serializers.ModelSerializer):
    modifiers = OrderItemModifierSerializer(many=True, read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'variant', 'quantity', 'base_price',
                 'total_modifiers_price', 'discount', 'final_price', 
                 'notes', 'cost_price', 'modifiers']

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'order', 'method', 'amount', 'created_at', 'status']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'daily_order_id', 'customer', 'service_type',
                 'status', 'origin', 'table_name', 'created_at', 
                 'delivered_at', 'closed_at', 'delivery_address',
                 'attended_by', 'delivery_person', 'payment_status',
                 'total_items', 'items_discount', 'subtotal',
                 'total_discount', 'discount_code', 'service_fee',
                 'delivery_fee', 'packaging_fee', 'total', 'total_paid',
                 'tip_amount', 'items', 'payments']

class BusinessHoursSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHours
        fields = ['id', 'day_of_week', 'open_time', 'close_time', 'is_active']

class BusinessHourExceptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessHourException
        fields = ['id', 'date', 'is_closed', 'alternative_open_time',
                 'alternative_close_time', 'reason']

class SystemConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemConfig
        fields = ['id', 'is_system_paused', 'maintenance_message']

class UserInteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserInteraction
        fields = ['id', 'interaction_date', 'menu_viewed', 'order_started_at',
                 'order_created_at', 'session_id', 'customer']