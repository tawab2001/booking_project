from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import UserSerializer, OrganizerCompanySerializer
from rest_framework.permissions import AllowAny
from .models import CustomUser, OrganizerCompany
from rest_framework_simplejwt.tokens import RefreshToken


class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrganizerSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrganizerCompanySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):  # تغيير من get إلى post
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = CustomUser.objects.get(email=email)
            if user.check_password(password):
                # إنشاء توكن للمستخدم
                refresh = RefreshToken.for_user(user)
                
                # تحديد نوع المستخدم
                is_organizer = hasattr(user, 'organizer_company')
                user_type = 'organizer' if is_organizer else 'user'
                
                # إعداد البيانات التي سيتم إرجاعها
                response_data = {
                    'token': str(refresh.access_token),
                    'user_type': user_type,
                    'user_id': user.id,
                    'email': user.email,
                    'username': user.username
                }

                # إضافة بيانات إضافية للمنظم إذا كان المستخدم منظماً
                if is_organizer:
                    response_data['company_name'] = user.organizer_company.company_name
                
                return Response(response_data, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except CustomUser.DoesNotExist:
            return Response({
                'error': 'User does not exist'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)