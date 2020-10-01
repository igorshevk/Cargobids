
from .base import *


DEBUG = False

ALLOWED_HOSTS = ['cargobids.herokuapp.com']


# Password validation
# https://docs.djangoproject.com/en/3.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# STRIPE_LIVE_PUBLIC_KEY = config('STRIPE_LIVE_PUBLIC_KEY')
# STRIPE_LIVE_SECRET_KEY = config('STRIPE_LIVE_SECRET_KEY')
