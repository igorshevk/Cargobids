
import os
import datetime
from decouple import config
import pusher

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(
    os.path.dirname(
        os.path.dirname(
            os.path.abspath(__file__))))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.0/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!

SECRET_KEY = config('SECRET_KEY')


# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'profiles.apps.ProfilesConfig',
    'airports.apps.AirportsConfig',
    'corsheaders',
    'rest_framework',
    'knox',
    'memberships.apps.MembershipsConfig',
    'notifications'
]
SITE_URL = config('SITE_URL')

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'knox.auth.TokenAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',),
    # 'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',

    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
        'rest_framework_datatables.renderers.DatatablesRenderer',
    ),
    'DEFAULT_FILTER_BACKENDS': (
        'rest_framework_datatables.filters.DatatablesFilterBackend',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework_datatables.pagination.DatatablesPageNumberPagination',
    'PAGE_SIZE': 10
}
AUTH_USER_MODEL = 'profiles.Users'

EXPIRY_TOKEN_IN_MIN = int(config("EXPIRY_TOKEN"))
REST_KNOX = {
    'TOKEN_TTL': datetime.timedelta(minutes=EXPIRY_TOKEN_IN_MIN),
    'AUTO_REFRESH': True,
    "MIN_REFRESH_INTERVAL" : 2,
}

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'memberships.middleware.custommiddleware.CustomMiddleware',
]

ROOT_URLCONF = 'cargobids.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(os.path.join(BASE_DIR, os.pardir), 'frontenduser/dist'),
            os.path.join(os.path.join(BASE_DIR, os.pardir), 'admin'),
        ],
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

WSGI_APPLICATION = 'cargobids.wsgi.application'


# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

DATABASES = {
    'default': {
        #  sqlite
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        # postgres
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        # 'ENGINE': 'django.db.backends.mysql',
        'NAME': config('DB_NAME'),
        'USER': config('DB_USER'),
        'PASSWORD': config('DB_PASSWORD'),
        'HOST': config('DB_HOST'),
        'PORT': '5432',
        # 'PORT': '3306',
    }
}
# db_from_env = dj_database_url.config()
# DATABASES['default'].update(db_from_env)

# If CORS_ORIGIN_ALLOW_ALL is True, Whitelist will be ignored
CORS_ORIGIN_ALLOW_ALL = True
# CORS_ORIGIN_WHITELIST = [
#     "http://localhost:3000",
#     "http://127.0.0.1:8000",
#     "http://127.0.0.1:8001",
#     "http://localhost:3001",
#     "http://cargobid.sadqa99.org",
#     "http://site.test",
#     "*",
# ]

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.mailtrap.io'
EMAIL_USE_TLS = True
EMAIL_PORT = 2525
EMAIL_HOST_USER = config('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD')

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')


STATICFILES_DIRS = [
    os.path.join(os.path.join(BASE_DIR, os.pardir), 'frontenduser/dist'),
    # Arslan knows well why he added this line here
    os.path.join(os.path.join(BASE_DIR, os.pardir), 'admin/build/static'),
    os.path.join(os.path.join(BASE_DIR, os.pardir), 'admin/build'),
    os.path.join(os.path.join(BASE_DIR, os.pardir), 'admin/public/static'),
    os.path.join(os.path.join(BASE_DIR, os.pardir),
                 'frontenduser/public/static'),
    os.path.join(os.path.join(BASE_DIR, os.pardir), 'frontenduser/src'),
    os.path.join(os.path.join(BASE_DIR, os.pardir), 'admin/src'),
]


ADMIN_EMAIL = 'admin@yopmail.com'

# pusher settings
pusher_client = pusher.Pusher(
    app_id = config("APP_ID"),
    key = config("PUSHER_KEY"),
    secret = config("PUSHER_SECRET"),
    cluster = config("CLUSTER")
)
