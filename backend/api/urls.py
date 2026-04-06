from django.urls import path
from . import views

urlpatterns = [
    path("tasks/", views.TaskListCreate.as_view(), name="task-list"),
    path("tasks/delete/<int:pk>/", views.TaskDelete.as_view(), name="delete-task"),
    path("tasks/<int:pk>/", views.TaskUpdate.as_view(), name="update-task"),
    path("auth/google/", views.google_auth, name="google-auth"),
    path("auth/me/", views.auth_me, name="auth-me"),
    path("auth/logout/", views.auth_logout, name="auth-logout"),
]
