from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import UserProfile

class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False

class CustomUserAdmin(UserAdmin):
    inlines = [UserProfileInline]
    list_display = ['username', 'email', 'first_name', 'last_name', 'get_role']
    
    def get_role(self, obj):
        if hasattr(obj, 'profile'):
            return obj.profile.role
        return 'Not set'
    get_role.short_description = 'Role'

# Unregister and re-register User admin
if admin.site.is_registered(User):
    admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'phone']
    list_filter = ['role']
    search_fields = ['user__username', 'user__email']