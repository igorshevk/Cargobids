from .base import *


DEBUG = True

ALLOWED_HOSTS = ['*']


STRIPE_API_KEY = config('STRIPE_API_KEY')
STRIPE_SECRET_KEY = ""
