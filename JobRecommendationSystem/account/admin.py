from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from django.contrib import admin
from .models import User

class CustomUserChangeForm(UserChangeForm):
    class Meta(UserChangeForm.Meta):
        model = User

class CustomUserCreationForm(UserCreationForm):
    class Meta(UserCreationForm.Meta):
        model = User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('is_candidat', 'is_coordinateur'),
        }),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Additional Fields', {
            'fields': ('is_candidat', 'is_coordinateur'),
        }),
    )
