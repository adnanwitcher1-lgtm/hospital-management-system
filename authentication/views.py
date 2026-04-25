from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .models import UserProfile
from .serializers import UserSerializer, UserProfileSerializer, RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get', 'put'])
    def profile(self, request):
        user = request.user
        if request.method == 'GET':
            serializer = UserSerializer(user)
            profile_serializer = UserProfileSerializer(user.profile)
            return Response({
                'user': serializer.data,
                'profile': profile_serializer.data
            })
        elif request.method == 'PUT':
            # Update profile logic
            return Response({'message': 'Profile updated'})

class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    
    def create(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'message': 'User created successfully',
                'username': user.username
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)