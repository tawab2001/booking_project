from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, OrganizerCompanySerializer
from .models import CustomUser, OrganizerCompany
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.core.mail import send_mail
from django.conf import settings
import jwt
from datetime import datetime, timedelta

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
        
class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            email = request.data.get('email')
            if not email:
                return Response(
                    {'error': 'Email is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = CustomUser.objects.filter(email=email).first()
            if not user:
                return Response(
                    {'error': 'No user found with this email'},
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                # Generate reset token
                reset_token = jwt.encode({
                    'user_id': user.id,
                    'exp': datetime.utcnow() + timedelta(hours=1)
                }, settings.SECRET_KEY, algorithm='HS256')

                # Create reset URL
                reset_url = f"{settings.FRONTEND_URL}/reset-password/{reset_token}"

                # Create HTML email content
                html_message = f"""
                <html>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #2c3e50;">Password Reset Request</h2>
                    <p>Hello {user.username},</p>
                    <p>You requested to reset your password. Click the button below to proceed:</p>
                    <p style="margin: 25px 0;">
                        <a href="{reset_url}" 
                           style="background-color: #ffc107; 
                                  color: #000; 
                                  padding: 10px 20px; 
                                  text-decoration: none; 
                                  border-radius: 5px; 
                                  display: inline-block;">
                            Reset Password
                        </a>
                    </p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p><small>This link will expire in 1 hour.</small></p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #666; font-size: 12px;">
                        This is an automated email. Please do not reply.
                    </p>
                </body>
                </html>
                """

                # Send email with both plain text and HTML versions
                send_mail(
                    subject='Password Reset Request',
                    message=f'Click here to reset your password: {reset_url}',
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=False,
                    html_message=html_message
                )

                return Response({
                    'message': 'Password reset instructions sent to your email'
                }, status=status.HTTP_200_OK)

            except Exception as e:
                print(f"Error sending email: {str(e)}")  # For debugging
                return Response({
                    'error': 'Failed to send reset email. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            print(f"Unexpected error: {str(e)}")  # For debugging
            return Response({
                'error': 'An unexpected error occurred'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            token = request.data.get('token')
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')

            if not all([token, new_password, confirm_password]):
                return Response(
                    {'error': 'Missing required fields'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if new_password != confirm_password:
                return Response(
                    {'error': 'Passwords do not match'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
                user = CustomUser.objects.get(id=payload['user_id'])
            except (jwt.ExpiredSignatureError, jwt.InvalidTokenError, CustomUser.DoesNotExist):
                return Response(
                    {'error': 'Invalid or expired reset token'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user.set_password(new_password)
            user.save()

            return Response({
                'message': 'Password reset successful'
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
 