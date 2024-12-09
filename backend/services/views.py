from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from services.tokenauthentication import JWTAuthentication
from .serializers import UserSerializer, LoginSerializer, UserGetSerializer
from rest_framework import status
from django.contrib.auth import get_user_model

@api_view(["POST"])
def register_user(request):
    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)

    return Response(serializer.errors, status=400)

@api_view(["POST"])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        token = JWTAuthentication.generate_token(payload=serializer.data)
        return Response({
            "message": "Login Successfull",
            "token": token,
            "user": serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

User = get_user_model()


@api_view(["GET"])
@permission_classes(IsAuthenticated)
def get_user_list(request):
    try:
        user_obj = User.objects.exclude(id=request.user.id)
        serializer = UserGetSerializer(user_obj, many=True)
        return Response(serializer.data, status=200)
    except Exception as e:
        print("Error in getting users list", str(e))
        return Response({"error": "ERROR: Getting users list"}, status=400)