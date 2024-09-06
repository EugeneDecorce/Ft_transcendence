from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer, TokenObtainPairSerializer
from django.http import JsonResponse, HttpResponseNotAllowed

def home(request):
    return JsonResponse({'message': 'Welcome to the backend API!'})

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED, headers=headers)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'success': True, 'message': 'User registered successfully!'})
        else:
            return JsonResponse({'success': False, 'message': serializer.errors}, status=400)
        
    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'Register endpoint - POST only'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

class LoginView(generics.GenericAPIView):
    serializer_class = TokenObtainPairSerializer
    
    def get(self, request, *args, **kwargs):
        return JsonResponse({'message': 'Register endpoint - POST only'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.filter(username=serializer.validated_data['username']).first()
        if user and user.check_password(serializer.validated_data['password']):
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class LogoutView(generics.GenericAPIView):
    def post(self, request, *args, **kwargs):
        # Here you might want to blacklist the token for security reasons
        return Response(status=status.HTTP_205_RESET_CONTENT)
