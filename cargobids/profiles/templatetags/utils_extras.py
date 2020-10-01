from django import template
from django.conf import settings

register = template.Library()

@register.filter(name='getSetting')
def getSetting(value, arg=[]):
	return getattr(settings, value)
