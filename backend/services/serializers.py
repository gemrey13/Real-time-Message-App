from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Chat

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = get_user_model().objects.create_user(
            email = validated_data["email"],
            password = validated_data["password"],
            first_name = validated_data.get("first_name", ""),
            last_name = validated_data.get("last_name", ""),
        )
        return user
    

    class Meta:
        model = get_user_model()
        fields = ["email", "password", "first_name", "last_name"]
        extra_kwargs = { "password" : { "write_only" : True },"id": {"read_only": True}}


        # {"email": "gem@gmail.com", "password": "123", "first_name": "gem", "last_name": "rey"}


class LoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()
    id = serializers.CharField(max_length=15, read_only=True)
    password = serializers.CharField(max_length=255, write_only=True)


    def validate(self, attrs):
        email = attrs.get("email", None)
        password = attrs.get("password", None)

        if email is None:
            raise serializers.ValidationError("An email address is required for login!")
        
        if password is None:
            raise serializers.ValidationError("An password is required for login!")
            
        user = authenticate(username=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid Email or Password!")

        if not user.is_active:
            raise serializers.ValidationError("User is inactive")
        
        return {
            "email": user.email,
            "id": user.id
        }
    
    class Meta:
        model = get_user_model()
        fields = ["email", "password", "id"]
        extra_kwargs = { "password" : { "write_only" : True }}


        # {"email": "gem@gmail.com", "password": "123"}


class UserGetSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["email", "first_name", "last_name", "id"]
        extra_kwargs = {"id": {"read_only": True}}


class ChatSerializer(serializers.ModelSerializer):
    sender_email = serializers.EmailField(source="sender.email")
    recipient_email = serializers.EmailField(source="recipient.email")
    sender_name = serializers.CharField(source="sender.get_full_name")
    recipient_name = serializers.CharField(source="recipient.get_full_name")
    timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S")

    class Meta:
        model = Chat
        fields = ['sender_email', 'recipient_email', 'sender_name', 'recipient_name', 'message', 'timestamp']