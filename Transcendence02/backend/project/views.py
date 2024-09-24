from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from django.shortcuts import render
from rest_framework.response import Response
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from .serializers import UserSerializer, LoginSerializer, VerifySecurityAnswersSerializer, MatchSerializer
import pyotp
from .models import Friendship, Match
import json
from django.core.mail import send_mail

User = get_user_model()

class RegisterView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.save()
            user = data['user']
            accessToken = data['accessToken']
            refreshToken = data['refreshToken']
            return Response({
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'accessToken': accessToken,
                'refreshToken': refreshToken
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            user = authenticate(username=username, password=password)
            
            if user is not None:
                return Response({
                    'ok': True,
                    'message': 'Correct credentials',
                    'detail': 'Logged in successfully',
                    'username': user.username,
                })
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TwoFactorAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        # Verify the security answers
        serializer = VerifySecurityAnswersSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            return Response({
                'ok': True,
                'detail': 'Security answers verified successfully!',
                'accessToken': data['accessToken'],
                'refreshToken': data['refreshToken'],
                'language': data['language'],
                'textSize': data['textSize']
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [AllowAny]  # Allow preflight request to pass without authentication

    def options(self, request, *args, **kwargs):
        """
        Handle CORS preflight requests.
        """
        response = Response()
        response["Access-Control-Allow-Origin"] = "https://localhost:3000"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "authorization, content-type"
        return response

    def get(self, request):
        if not request.user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=401)
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def post(self, request):
        user = request.user
        data = request.data
        display_name = data.get('display_name')
        language = data.get('language')
        textSize = data.get('textSize')
        avatar = request.FILES.get('avatar')
        if display_name:
            user.display_name = display_name
        if avatar:
            user.avatar = avatar
        if language:
            user.language = language
        if textSize:
            user.textSize = textSize
        user.save()
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        # Placeholder for any server-side logout logic if needed
        return Response({"detail": "Logged out successfully"}, status=200)

class UserPlayersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserFriendsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = json.loads(request.body)
            friend_id = data.get("friend_id")
            user = request.user
            friend = User.objects.get(id=friend_id)

            # Check if the friendship already exists
            if Friendship.objects.filter(user=user, friend=friend).exists():
                return JsonResponse({"error": "Friendship already exists"}, status=400)

            # Create the friendship
            Friendship.objects.create(user=user, friend=friend)
            return JsonResponse({"message": "Friend added successfully"}, status=201)
        except User.DoesNotExist:
            return JsonResponse({"error": "User does not exist"}, status=404)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

class FriendsListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            friendships = Friendship.objects.filter(user_id=user.id).select_related('friend')

            friends_data = [
                {
                    "id": friendship.friend.id,
                    "username": friendship.friend.username,
                    "avatar": friendship.friend.avatar.url if friendship.friend.avatar else None,
                    "is_active": friendship.friend.is_active,
                }
                for friendship in friendships
            ]

            return JsonResponse(friends_data, safe=False)
        except Exception as e:
            return JsonResponse({"error": f"An error occurred while fetching friends data: {str(e)}"}, status=500)

class RemoveFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, friend_id):
        try:
            user = request.user
            friendship = Friendship.objects.filter(user=user, friend_id=friend_id).first()
            if friendship:
                friendship.delete()
                return JsonResponse({"message": "Friend removed successfully."}, status=200)
            else:
                return JsonResponse({"error": "Friendship not found."}, status=404)
        except Exception as e:
            return JsonResponse({"error": "An error occurred while removing the friend: " + str(e)}, status=500)

class UploadMatchView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = json.loads(request.body)
            username = data.get('user')
            opponent = data.get('opponent')
            play_against_ai = data.get('playAgainstAI')
            player1_score = data.get('player1Score')
            player2_score = data.get('player2Score')

            match = Match(
                user=username,
                opponent=opponent,
                play_against_ai=play_against_ai,
                player1_score=player1_score,
                player2_score=player2_score
            )
            match.save()

            return JsonResponse({'status': 'success', 'match_id': match.id})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': f'An error occurred: {str(e)}'}, status=500)

        return JsonResponse({'status': 'error', 'message': 'Invalid request method'}, status=400)

class MatchDataView(APIView):
    def get(self, request):
        matches = Match.objects.filter(user=request.user.username)
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

from django.shortcuts import redirect
from django.urls import reverse

def login_with_42(request):
    redirect_uri = request.build_absolute_uri(reverse('social:begin', args=['42']))
    return redirect(redirect_uri)

from django.contrib.auth import login
from django.conf import settings
import requests
import logging
logger = logging.getLogger(__name__)
def oauth2_callback(request):
    code = request.GET.get('code')
    state = request.GET.get('state')

    if state != request.session.get('oauth_state'):
        return JsonResponse({'error': 'Invalid state parameter'}, status=400)

    if not code:
        return JsonResponse({'error': 'Authorization code not found'}, status=400)

    token_url = 'https://api.intra.42.fr/oauth/token'
    payload = {
        'grant_type': 'authorization_code',
        'client_id': settings.SOCIAL_AUTH_42_KEY,
        'client_secret': settings.SOCIAL_AUTH_42_SECRET,
        'redirect_uri': 'https://localhost:8000/auth/complete/42/',
        'code': code
    }
    response = requests.post(token_url, data=payload)
    if response.status_code != 200:
        return JsonResponse({'error': 'Failed to obtain access token'}, status=400)

    token_data = response.json()
    access_token = token_data.get('access_token')

    # Fetch user info from the 42 API
    user_info_url = 'https://api.intra.42.fr/v2/me'
    user_response = requests.get(user_info_url, headers={'Authorization': f'Bearer {access_token}'})
    if user_response.status_code != 200:
        return JsonResponse({'error': 'Failed to fetch user info'}, status=400)

    user_info = user_response.json()
    username = user_info.get('login')
    email = user_info.get('email')
    display_name = user_info.get('displayname')
    avatar = user_info.get('image_url')  # Make sure to handle avatar URL if needed

    try:
        # Check if the user already exists
        user, created = User.objects.get_or_create(username=username, defaults={
            'email': email,
            'display_name': display_name,
            'avatar': avatar,
            'is_active': True
        })

        if created:
            # If the user was created, set default password or handle registration details
            user.set_password(User.objects.make_random_password())
            user.save()
            logger.info('Created new user: %s', username)
        else:
            logger.info('User already exists: %s', username)

        # Log the user in
        login(request, user)

        # Generate tokens for the user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return HttpResponseRedirect("http://localhost:3000/dashboard")
    except Exception as e:
        logger.error('Error creating or logging in user: %s', e)
        return JsonResponse({'error': 'Internal server error'}, status=500)