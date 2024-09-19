from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken
import pyotp
from .models import Match
import hashlib

User = get_user_model()

def hash_security_answer(answer):
    return hashlib.sha256(answer.encode('utf-8')).hexdigest()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'display_name', 'security_answer_1', 'security_answer_2', 'avatar', 'is_active')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        try:
            password = validated_data.pop('password')
            security_answer_1 = validated_data.pop('security_answer_1')
            security_answer_2 = validated_data.pop('security_answer_2')
            user = User(**validated_data)
            user.set_password(password)
            user.security_answer_1 = hash_security_answer(security_answer_1)
            user.security_answer_2 = hash_security_answer(security_answer_2)
            user.save()

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            return {
                'user': user,
                'accessToken': str(refresh.access_token),
                'refreshToken': str(refresh)
            }
        except Exception as e:
            # Log the error
            print(f"Error in user creation: {e}")
            raise e


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            return data
        raise serializers.ValidationError("Invalid credentials")
    
class VerifySecurityAnswersSerializer(serializers.Serializer):
    username = serializers.CharField()
    security_answer_1 = serializers.CharField()
    security_answer_2 = serializers.CharField()

    def validate(self, data):
        username = data.get('username')
        security_answer_1 = data.get('security_answer_1')
        security_answer_2 = data.get('security_answer_2')

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found.")

        hashed_answer_1 = hash_security_answer(security_answer_1)
        hashed_answer_2 = hash_security_answer(security_answer_2)
        
        if hashed_answer_1 != user.security_answer_1:
            raise serializers.ValidationError("Security answer 1 is incorrect.")
        if hashed_answer_2 != user.security_answer_2:
            raise serializers.ValidationError("Security answer 2 is incorrect.")

        refresh = RefreshToken.for_user(user)
        data['accessToken'] = str(refresh.access_token)
        data['refreshToken'] = str(refresh)

        return data

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Match
        fields = '__all__'

class TokenSerializer(serializers.Serializer):
    token = serializers.CharField()