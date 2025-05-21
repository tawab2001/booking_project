from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, OrganizerCompanySerializer
from .models import CustomUser, OrganizerCompany
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
import jwt
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests
import logging
import time

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
        
logger = logging.getLogger(__name__)

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        start_time = time.time()
        logger.info(f"Request started at {start_time}, server_time: {int(time.time())}")
        try:
            credential = request.data.get('credential')
            
            if not credential:
                logger.warning("No credential provided in request")
                return Response(
                    {'error': 'Credential is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Verify the token with increased clock skew tolerance
                idinfo = id_token.verify_oauth2_token(
                    credential,
                    requests.Request(),
                    settings.GOOGLE_OAUTH2_CLIENT_ID,
                    clock_skew_in_seconds=15  # Increased to 15 seconds
                )

                # Get user info from token
                email = idinfo['email']
                
                # Get or create user
                user = CustomUser.objects.filter(email=email).first()
                if not user:
                    username = email.split('@')[0]
                    base_username = username
                    counter = 1
                    while CustomUser.objects.filter(username=username).exists():
                        username = f"{base_username}{counter}"
                        counter += 1
                        
                    user = CustomUser.objects.create_user(
                        email=email,
                        username=username,
                        first_name=idinfo.get('given_name', ''),
                        last_name=idinfo.get('family_name', ''),
                        password=None
                    )

                # Generate tokens
                refresh = RefreshToken.for_user(user)
                
                logger.info(f"User {email} logged in successfully, processing_time: {time.time() - start_time}")
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'organizer' if hasattr(user, 'organizer') else 'user',
                    'user_data': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }
                })

            except ValueError as ve:
                try:
                    decoded = jwt.decode(credential, options={"verify_signature": False})
                    logger.error(
                        f"Token verification failed: {str(ve)}, "
                        f"token_payload: {decoded}, "
                        f"processing_time: {time.time() - start_time}, "
                        f"server_time: {int(time.time())}"
                    )
                except Exception as e:
                    logger.error(f"Token decode failed: {str(e)}, processing_time: {time.time() - start_time}")
                return Response(
                    {'error': 'Google authentication failed. Please try again.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        except Exception as e:
            logger.error(f"Google login error: {str(e)}, processing_time: {time.time() - start_time}")
            return Response(
                {'error': 'An unexpected error occurred. Please try again.'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
class GoogleUserSignupView(APIView):
    permission_classes = []

    def post(self, request):
        try:
            user_data = request.data.get('user', {})
            google_id = user_data.get('google_id')
            email = user_data.get('email')

            # Check if user exists
            user = CustomUser.objects.filter(email=email).first()
            if user:
                return Response(
                    {'error': 'User with this email already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create new user
            user = CustomUser.objects.create_user(
                username=user_data.get('username'),
                email=email,
                first_name=user_data.get('first_name', ''),
                last_name=user_data.get('last_name', ''),
                password=user_data.get('password'),
                mobile_number=user_data.get('mobile_number', ''),
                google_id=google_id
            )

            return Response({
                'message': 'User created successfully',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error in Google signup: {str(e)}")
            return Response(
                {'error': 'Failed to create user'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class GoogleOrganizerSignupView(APIView):
    permission_classes = []

    def post(self, request):
        try:
            user_data = request.data.get('user', {})
            company_data = request.data
            google_id = user_data.get('google_id')
            email = user_data.get('email')

            # Check if user exists
            user = CustomUser.objects.filter(email=email).first()
            if user:
                return Response(
                    {'error': 'User with this email already exists'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create user and organizer profile
            user = CustomUser.objects.create_user(
                username=user_data.get('username'),
                email=email,
                first_name=user_data.get('first_name', ''),
                last_name=user_data.get('last_name', ''),
                password=user_data.get('password'),
                mobile_number=user_data.get('mobile_number', ''),
                google_id=google_id,
                is_organizer=True
            )

            # Create organizer profile
            user.organizer.company_name = company_data.get('company_name', '')
            user.organizer.country = company_data.get('country', '')
            user.organizer.description = company_data.get('description', '')
            user.organizer.save()

            return Response({
                'message': 'Organizer created successfully',
                'user_id': user.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Error in Google organizer signup: {str(e)}")
            return Response(
                {'error': 'Failed to create organizer'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )