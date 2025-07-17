# api/admin.py
from django.contrib import admin
from .models import (
    Customer, Category, MenuItem, Variant, 
    ModifierGroup, ModifierOption, Order, OrderItem, Payment,
    BusinessHours, BusinessHourException, SystemConfig,
    CustomerTag, UserInteraction
)

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone_number', 'total_orders', 'last_order_at')
    search_fields = ('name', 'phone_number')
    list_filter = ('is_blocked', 'segment')

@admin.register(CustomerTag)
class CustomerTagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'sort_order', 'is_active')
    list_editable = ('sort_order', 'is_active')
    search_fields = ('name',)

class VariantInline(admin.TabularInline):
    model = Variant
    extra = 1

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'base_price', 'is_active')
    list_filter = ('category', 'is_active', 'is_promotion')
    search_fields = ('name',)
    inlines = [VariantInline]
    readonly_fields = ('sku_code',)

class ModifierOptionInline(admin.TabularInline):
    model = ModifierOption
    extra = 1

@admin.register(ModifierGroup)
class ModifierGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_required', 'min_choices', 'max_choices')
    inlines = [ModifierOptionInline]
    search_fields = ('name',)

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = [field.name for field in OrderItem._meta.get_fields()]
    can_delete = False
    
    def has_add_permission(self, request, obj=None):
        return False

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0
    readonly_fields = ('created_at',)
    
@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('daily_order_id', 'customer', 'status', 'payment_status', 'total', 'created_at')
    list_filter = ('status', 'payment_status', 'service_type', 'created_at')
    search_fields = ('daily_order_id', 'customer__name', 'customer__phone_number')
    ordering = ('-created_at',)
    inlines = [OrderItemInline, PaymentInline]
    readonly_fields = ('daily_order_id', 'created_at', 'total_items', 'subtotal', 'total')

    def has_add_permission(self, request):
        return False

@admin.register(BusinessHours)
class BusinessHoursAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'open_time', 'close_time', 'is_active')
    list_editable = ('is_active',)

@admin.register(BusinessHourException)
class BusinessHourExceptionAdmin(admin.ModelAdmin):
    list_display = ('date', 'is_closed', 'alternative_open_time', 'alternative_close_time')
    list_filter = ('is_closed', 'date')

@admin.register(SystemConfig)
class SystemConfigAdmin(admin.ModelAdmin):
    list_display = ('is_system_paused', 'maintenance_message')

@admin.register(UserInteraction)
class UserInteractionAdmin(admin.ModelAdmin):
    list_display = ('interaction_date', 'customer', 'menu_viewed', 'order_created_at')
    list_filter = ('menu_viewed', 'interaction_date')
    search_fields = ('customer__name', 'session_id')