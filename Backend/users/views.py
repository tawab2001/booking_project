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
from .serializers import AvatarUploadSerializer
import jwt
from datetime import datetime, timedelta
from google.oauth2 import id_token
from google.auth.transport import requests
import logging
import time
from django.db import transaction 
from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary
import cloudinary.uploader
import cloudinary.api
from django.conf import settings
import logging



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
# class UserProfileView(APIView):
#     authentication_classes = [JWTAuthentication]
#     permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     try:
    #         user = request.user
    #         data = {
    #             'id': user.id,
    #             'username': user.username,
    #             'email': user.email,
    #             'mobile_number': user.mobile_number,
    #         }
            
    #         if hasattr(user, 'organizer_company'):
    #             company = user.organizer_company
    #             data.update({
    #                 'company_name': company.company_name,
    #                 'description': company.description,
    #                 'country': company.country,
    #             })
            
    #         return Response(data, status=status.HTTP_200_OK)
    #     except Exception as e:
    #         return Response(
    #             {'error': str(e)}, 
    #             status=status.HTTP_400_BAD_REQUEST
    #         )

    # def put(self, request):
    #     try:
    #         user = request.user
    #         serializer = UserSerializer(
    #             user, 
    #             data=request.data, 
    #             partial=True
    #         )
    #         if serializer.is_valid():
    #             serializer.save()
    #             return Response(serializer.data)
    #         return Response(
    #             serializer.errors, 
    #             status=status.HTTP_400_BAD_REQUEST
    #         )
    #     except Exception as e:
    #         return Response(
    #             {'error': str(e)}, 
    #             status=status.HTTP_400_BAD_REQUEST
    #         )


class UserProfileView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get(self, request):
        try:
            user = request.user
            avatar_url = user.avatar if user.avatar else None
            data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'mobile_number': user.mobile_number,
                'avatar': avatar_url,

                'social_accounts': {
                    'facebook_url': user.facebook_url or '',
                    'instagram_url': user.instagram_url or '',
                    'whatsapp_number': user.whatsapp_number or ''
                }
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
                return Response({
                    'message': 'Profile updated successfully',
                    'data': serializer.data
                })
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
        try:
            logger.info('Processing Google login request')
            credential = request.data.get('credential')
            user_info = request.data.get('user_info')

            if not credential:
                logger.error('Missing Google credential')
                return Response({
                    'status': 'error',
                    'message': 'Google credential is required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Verify token with more lenient clock skew
                idinfo = id_token.verify_oauth2_token(
                    credential,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID,
                    clock_skew_in_seconds=settings.GOOGLE_OAUTH_SETTINGS['CLOCK_SKEW_IN_SECONDS']
                )

                email = idinfo['email']
                if not idinfo.get('email_verified'):
                    logger.error(f'Email not verified: {email}')
                    return Response({
                        'status': 'error',
                        'message': 'Email not verified'
                    }, status=status.HTTP_400_BAD_REQUEST)

                logger.info(f'Token verified for email: {email}')

            except ValueError as e:
                logger.error(f'Token verification failed: {str(e)}')
                return Response({
                    'status': 'error',
                    'message': 'Invalid or expired token. Please try again.'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Get or create user
            try:
                user = CustomUser.objects.get(email=email)
                logger.info(f'Existing user found: {email}')
            except CustomUser.DoesNotExist:
                # Create new user
                user = CustomUser.objects.create_user(
                    email=email,
                    username=idinfo.get('name', email.split('@')[0]),
                    first_name=idinfo.get('given_name', ''),
                    last_name=idinfo.get('family_name', ''),
                    is_active=True
                )
                logger.info(f'New user created: {email}')

            # Generate tokens
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'status': 'success',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': 'organizer' if hasattr(user, 'organizer_company') else 'user',
                'user_data': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'profile_picture': idinfo.get('picture', '')
                }
            })

        except Exception as e:
            logger.error(f'Unexpected error in Google login: {str(e)}', exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Login failed. Please try again.'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class GoogleUserSignupView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        try:
            logger.info('Processing Google signup...')
            credential = request.data.get('credential')
            user_info = request.data.get('user_info')

            if not credential or not user_info:
                logger.error('Missing credential or user info')
                return Response({
                    'status': 'error',
                    'message': 'Missing credential or user info'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Verify Google token
            logger.info('Verifying Google token...')
            idinfo = id_token.verify_oauth2_token(
                credential,
                requests.Request(),
                settings.GOOGLE_OAUTH2_CLIENT_ID,
                clock_skew_in_seconds=60
            )

            email = idinfo['email']
            logger.info(f'Google token verified for email: {email}')

            # Check if user exists
            if CustomUser.objects.filter(email=email).exists():
                logger.error(f'User with email {email} already exists')
                return Response({
                    'status': 'error',
                    'message': 'User with this email already exists'
                }, status=status.HTTP_400_BAD_REQUEST)

            # Create user
            user = CustomUser.objects.create_user(
                email=email,
                username=user_info.get('name', email.split('@')[0]),
                first_name=user_info.get('given_name', ''),
                last_name=user_info.get('family_name', ''),
                is_active=True,
                is_organizer=False
            )
            logger.info(f'User created: {user.email}')

            # Generate JWT tokens
            refresh = RefreshToken.for_user(user)
            user_type = 'user'

            return Response({
                'status': 'success',
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'user_type': user_type,
                'user_data': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'is_organizer': user.is_organizer
                }
            })

        except ValueError as e:
            logger.error(f"Google token validation error: {str(e)}")
            return Response({
                'status': 'error',
                'message': f'Invalid Google token: {str(e)}'
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Google signup error: {str(e)}", exc_info=True)
            return Response({
                'status': 'error',
                'message': f'Server error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GoogleOrganizerSignupView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            logger.info('Processing Google user signup...')
            credential = request.data.get('token')  # Changed from 'credential'
            user_data = request.data.get('user')    # Changed from 'user_info'

            if not credential or not user_data:
                logger.error('Missing token or user data')
                return Response({
                    'status': 'error',
                    'message': 'Missing required data'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                idinfo = id_token.verify_oauth2_token(
                    credential,
                    requests.Request(),
                    settings.GOOGLE_CLIENT_ID,
                    clock_skew_in_seconds=settings.GOOGLE_OAUTH_SETTINGS['CLOCK_SKEW_IN_SECONDS']
                )

                email = idinfo['email']
                
                # Create user if not exists
                with transaction.atomic():
                    user, created = CustomUser.objects.get_or_create(
                        email=email,
                        defaults={
                            'username': user_data.get('username', email.split('@')[0]),
                            'first_name': user_data.get('first_name', ''),
                            'last_name': user_data.get('last_name', ''),
                            'profile_picture': user_data.get('profile_picture', ''),
                            'google_id': idinfo['sub'],
                            'is_active': True
                        }
                    )

                    if created:
                        logger.info(f'Created new user: {email}')
                    else:
                        logger.info(f'Found existing user: {email}')

                # Generate tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    'status': 'success',
                    'message': 'Signup successful',
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'user_type': 'user',
                    'user_data': {
                        'id': user.id,
                        'email': user.email,
                        'username': user.username,
                        'first_name': user.first_name,
                        'last_name': user.last_name,
                        'profile_picture': user.profile_picture
                    }
                })

            except ValueError as e:
                logger.error(f'Token verification failed: {str(e)}')
                return Response({
                    'status': 'error',
                    'message': 'Invalid token'
                }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f'Unexpected error: {str(e)}', exc_info=True)
            return Response({
                'status': 'error',
                'message': 'Signup failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class ContactView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            data = request.data
            name = data.get('name')
            email = data.get('email')
            subject = data.get('subject')
            message = data.get('message')

            if not all([name, email, subject, message]):
                return Response({
                    'status': 'error',
                    'message': 'All fields are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            try:
                # Get admin email with fallback
                admin_email = getattr(settings, 'ADMIN_EMAIL', settings.EMAIL_HOST_USER)

                # Send email to admin
                admin_message = f"""
                New Contact Form Submission:
                From: {name}
                Email: {email}
                Subject: {subject}
                Message:
                {message}
                """

                send_mail(
                    subject=f'Contact Form: {subject}',
                    message=admin_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[admin_email],
                    fail_silently=False
                )

                # Send confirmation email to user
                user_message = f"""
                Dear {name},

                Thank you for contacting us. We have received your message and will get back to you soon.

                Best regards,
                EasyTicket Team
                """

                send_mail(
                    subject='Thank you for contacting EasyTicket',
                    message=user_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[email],
                    fail_silently=True
                )

                return Response({
                    'status': 'success',
                    'message': 'Your message has been sent successfully'
                }, status=status.HTTP_200_OK)

            except Exception as e:
                logger.error(f"Email sending error: {str(e)}")
                return Response({
                    'status': 'error',
                    'message': 'Failed to send email - please try again later'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            logger.error(f"Contact form error: {str(e)}")
            return Response({
                'status': 'error',
                'message': 'Server error - please try again later'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
logger = logging.getLogger(__name__)

# Make sure cloudinary is configured
cloudinary.config(
    cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
    api_key=settings.CLOUDINARY_STORAGE['API_KEY'],
    api_secret=settings.CLOUDINARY_STORAGE['API_SECRET']
)

class AvatarUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            logger.info("Starting avatar upload process")
            
            if 'avatar' not in request.FILES:
                return Response(
                    {'error': 'No image file provided'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            file = request.FILES['avatar']
            
            # Upload to Cloudinary
            try:
                upload_result = cloudinary.uploader.upload(
                    file,
                    folder='avatars',
                    resource_type='auto',
                    allowed_formats=['jpg', 'png', 'gif'],
                    transformation=[
                        {'width': 400, 'height': 400, 'crop': 'fill'}
                    ]
                )
                logger.info(f"Image uploaded successfully to Cloudinary: {upload_result['secure_url']}")
            except Exception as cloud_error:
                logger.error(f"Cloudinary upload error: {str(cloud_error)}")
                raise Exception(f"Failed to upload to Cloudinary: {str(cloud_error)}")
            
            # Update user's avatar URL
            request.user.avatar = upload_result['secure_url']
            request.user.save()

            return Response({
                'status': 'success',
                'avatar': upload_result['secure_url']
            })
            
        except Exception as e:
            logger.error(f"Error uploading avatar: {str(e)}")
            return Response(
                {'error': str(e)}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )