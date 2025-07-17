# api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, MenuItemViewSet, OrderViewSet,
    CustomerViewSet, BusinessHoursViewSet,
    BusinessHourExceptionViewSet, SystemConfigViewSet,
    UserInteractionViewSet
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'menu-items', MenuItemViewSet, basename='menuitem')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'customers', CustomerViewSet, basename='customer')
router.register(r'business-hours', BusinessHoursViewSet, basename='businesshours')
router.register(r'business-hour-exceptions', BusinessHourExceptionViewSet, basename='businesshourexception')
router.register(r'system-config', SystemConfigViewSet, basename='systemconfig')
router.register(r'user-interactions', UserInteractionViewSet, basename='userinteraction')

urlpatterns = [
    path('', include(router.urls)),
]