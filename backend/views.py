# api/views.py
from django.db import transaction
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import (
    Customer, Category, MenuItem, Variant, 
    ModifierGroup, ModifierOption, Order, OrderItem, 
    OrderItemModifier, Payment, CustomerTag, BusinessHours,
    BusinessHourException, SystemConfig, UserInteraction
)
from .serializers import (
    CategorySerializer, MenuItemSerializer, OrderSerializer,
    CustomerSerializer, PaymentSerializer, CustomerTagSerializer,
    BusinessHoursSerializer, BusinessHourExceptionSerializer,
    SystemConfigSerializer, UserInteractionSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True).prefetch_related(
        'menu_items__variants', 
        'menu_items__modifier_groups__options'
    )
    serializer_class = CategorySerializer

class MenuItemViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = MenuItem.objects.filter(is_active=True)
    serializer_class = MenuItemSerializer

class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    
    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        order = self.get_object()
        serializer = PaymentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(order=order)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BusinessHoursViewSet(viewsets.ModelViewSet):
    queryset = BusinessHours.objects.all()
    serializer_class = BusinessHoursSerializer

class BusinessHourExceptionViewSet(viewsets.ModelViewSet):
    queryset = BusinessHourException.objects.all()
    serializer_class = BusinessHourExceptionSerializer

class SystemConfigViewSet(viewsets.ModelViewSet):
    queryset = SystemConfig.objects.all()
    serializer_class = SystemConfigSerializer

class UserInteractionViewSet(viewsets.ModelViewSet):
    queryset = UserInteraction.objects.all()
    serializer_class = UserInteractionSerializer