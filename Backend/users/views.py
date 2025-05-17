# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status
# from .serializers import UserSerializer, OrganizerCompanySerializer
# from rest_framework.permissions import AllowAny
# from .models import CustomUser, OrganizerCompany
# from rest_framework_simplejwt.tokens import RefreshToken


# class UserSignupView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = UserSerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class OrganizerSignupView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):
#         serializer = OrganizerCompanySerializer(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class LoginView(APIView):
#     permission_classes = [AllowAny]

#     def post(self, request):  
#         email = request.data.get('email')
#         password = request.data.get('password')

#         try:
#             user = CustomUser.objects.get(email=email)
#             if user.check_password(password):
                
#                 refresh = RefreshToken.for_user(user)
                
                
#                 is_organizer = hasattr(user, 'organizer_company')
#                 user_type = 'organizer' if is_organizer else 'user'
                
                
#                 response_data = {
#                     'token': str(refresh.access_token),
#                     'user_type': user_type,
#                     'user_id': user.id,
#                     'email': user.email,
#                     'username': user.username
#                 }

            
#                 if is_organizer:
#                     response_data['company_name'] = user.organizer_company.company_name
                
#                 return Response(response_data, status=status.HTTP_200_OK)
#             else:
#                 return Response({
#                     'error': 'Invalid credentials'
#                 }, status=status.HTTP_401_UNAUTHORIZED)
                
#         except CustomUser.DoesNotExist:
#             return Response({
#                 'error': 'User does not exist'
#             }, status=status.HTTP_404_NOT_FOUND)
#         except Exception as e:
#             return Response({
#                 'error': str(e)
#             }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, OrganizerCompanySerializer
from .models import CustomUser, OrganizerCompany
from rest_framework_simplejwt.authentication import JWTAuthentication

class UserSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user_type': 'user',
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class OrganizerSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = OrganizerCompanySerializer(data=request.data)
        if serializer.is_valid():
            company = serializer.save()
            refresh = RefreshToken.for_user(company.user)
            return Response({
                'token': str(refresh.access_token),
                'user_type': 'organizer',
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return Response(
                    {'error': 'Please provide both email and password'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get user by email
            user = CustomUser.objects.filter(email=email).first()

            if not user or not user.check_password(password):
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            # Prepare response data
            response_data = {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': 'organizer' if hasattr(user, 'organizer_company') else 'user',
                'user_data': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'mobile_number': user.mobile_number
                }
            }

            # Add organizer specific data if applicable
            if hasattr(user, 'organizer_company'):
                response_data['user_data'].update({
                    'company_name': user.organizer_company.company_name,
                    'description': user.organizer_company.description,
                    'country': user.organizer_company.country
                })

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'mobile_number': user.mobile_number,
            }
            
            if hasattr(user, 'organizer_company'):
                company = user.organizer_company
                data.update({
                    'company_name': company.company_name,
                    'description': company.description,
                    'country': company.country,
                })
            
            return Response(data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request):
        try:
            user = request.user
            serializer = UserSerializer(
                user, 
                data=request.data, 
                partial=True
            )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_400_BAD_REQUEST
            )