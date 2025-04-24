from rest_framework import viewsets, status
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password
from .models import User
from .serializers import UserSerializer
from .authentication import JWTAuthMixin


class UserViewSet(JWTAuthMixin, viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return super().get_permissions()

    @action(detail=False, methods=['delete'])
    def clear(self, request):
        try:
            User.objects.all().delete()
            return Response({'message': 'All users deleted successfully'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        serializer = self.get_serializer(data=data)

        

        if serializer.is_valid():
            user = serializer.save()
            user.set_password(data['password'])
            user.save()
        #     refresh = RefreshToken.for_user(user)

        #     return Response({
        #         'message': 'User created successfully',
        #         'token': {
        #             'access': str(refresh.access_token),
        #             'refresh': str(refresh)
        #         }
        #     }, status=status.HTTP_201_CREATED)
        # return Response({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    @permission_classes([AllowAny])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        try:
            user = User.objects.get(username=username)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'token': {
                        'access': str(refresh.access_token),
                        'refresh': str(refresh)
                    }
                })
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
