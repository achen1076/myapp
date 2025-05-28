from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny


class JWTAuthMixin:
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        # Public endpoints that don't require authentication
        if self.action in ['create', 'login']:
            return [AllowAny()]
        return [permission() for permission in self.permission_classes]
