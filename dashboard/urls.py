from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.dashboard_stats, name='dashboard-stats'),
    path('recent-activity/', views.recent_activity, name='recent-activity'),
    path('appointment-stats/', views.appointment_stats, name='appointment-stats'),
    path('revenue-stats/', views.revenue_stats, name='revenue-stats'),
]