import json
from django.conf import settings
from django.contrib.auth import get_user_model, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .serializers import TaskSerializer
from .models import Task


User = get_user_model()

class TaskListCreate(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class TaskDelete(generics.DestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(author=self.request.user)

class TaskUpdate(generics.UpdateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(author=self.request.user)
    
@require_POST
def google_auth(request):
    try:
        data = json.loads(request.body)
        credential = data.get("credential")

        if not credential:
            return JsonResponse({"error": "Missing credential"}, status=400)

        idinfo = id_token.verify_oauth2_token(
            credential,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
        )

        email = idinfo.get("email")
        given_name = idinfo.get("given_name", "")
        family_name = idinfo.get("family_name", "")

        if not email:
            return JsonResponse({"error": "Invalid Google account"}, status=400)

        user, created = User.objects.get_or_create(
            username=email,
            defaults={
                "email": email,
                "first_name": given_name,
                "last_name": family_name,
            },
        )

        if not created:
            changed = False
            if user.email != email:
                user.email = email
                changed = True
            if given_name and user.first_name != given_name:
                user.first_name = given_name
                changed = True
            if family_name and user.last_name != family_name:
                user.last_name = family_name
                changed = True
            if changed:
                user.save()

        login(request, user)

        return JsonResponse({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@require_GET
@ensure_csrf_cookie
def auth_me(request):
    if not request.user.is_authenticated:
        return JsonResponse({"user": None}, status=401)

    return JsonResponse({
        "user": {
            "id": request.user.id,
            "email": request.user.email,
            "first_name": request.user.first_name,
            "last_name": request.user.last_name,
        }
    })


@require_POST
def auth_logout(request):
    logout(request)
    return JsonResponse({"message": "Logged out"})