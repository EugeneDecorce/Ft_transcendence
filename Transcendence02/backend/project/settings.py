import os
    
AUTHENTICATION_BACKENDS = (
    'project.backends.FourtyTwoOAuth2',
    'social_core.backends.google.GoogleOAuth2',
    'django.contrib.auth.backends.ModelBackend',
)

SOCIAL_AUTH_42_KEY = 'u-s4t2ud-e2cf60b8472a3659cf6741405c4a073af62109238034430aeaabb111909b9f60'
SOCIAL_AUTH_42_SECRET = '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'
SOCIAL_AUTH_42_SCOPE = ['public']

AUTH_USER_MODEL = 'project.User'
ROOT_URLCONF = 'project.urls'
SECURE_SSL_REDIRECT = True
CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOWED_ORIGINS = [
    "https://localhost:3000",
    "https://127.0.0.1:3000",
]

CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'x-csrftoken',
    'x-requested-with',
]

CORS_EXPOSE_HEADERS = [
    'content-type',
    'authorization',
    'x-csrftoken',
    'x-requested-with',
]

#CORS_ALLOW_ALL_ORIGINS = True # This is for development only
CORS_ALLOW_CREDENTIALS = True
SECRET_KEY = 'secret_key'
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
CORS_ALLOW_HEADERS = ['*']  # Allow all headers, can be narrowed down as needed
CORS_ALLOW_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_simplejwt',
    'django_otp',
    'django_otp.plugins.otp_static',
    'django_otp.plugins.otp_totp',
    'two_factor',
    'corsheaders',
    'sslserver',
	'csp',
	'social_django',
    'project',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'csp.middleware.CSPMiddleware',
    'django_otp.middleware.OTPMiddleware'
]

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
DEBUG = True

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'static')
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

SECURE_SSL_REDIRECT = True

AUTHENTIFICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'django_otp.backends.OTPBackend',
)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'myuser',
        'PASSWORD': 'mypassword',
        'HOST': 'db',
        'PORT': '5432',
    }
}

# JWT settings
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=5),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
        'simple': {
            'format': '{levelname} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',  # Change to INFO to reduce verbosity
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'debug.log'),
            'formatter': 'verbose',
        },
        'console': {
            'level': 'INFO',  # Change to INFO to reduce verbosity
            'class': 'logging.StreamHandler',
            'formatter': 'simple',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',  # Change to WARNING to reduce verbosity
            'propagate': True,
        },
        'django.server': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',  # Only log warnings and above for server-related logs
            'propagate': False,
        },
        'django.request': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',  # Only log warnings and above for request-related logs
            'propagate': False,
        },
        'django.utils.autoreload': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',  # Only log warnings and above for autoreload-related logs
            'propagate': False,
        },
        'django.server.basehttp': {
            'handlers': ['file', 'console'],
            'level': 'WARNING',  # Only log warnings and above for basehttp-related logs
            'propagate': False,
        },
        'project': {  # Replace 'myapp' with the name of your app
            'handlers': ['file', 'console'],
            'level': 'INFO',  # Change to INFO to reduce verbosity
            'propagate': True,
        },
    },
}
