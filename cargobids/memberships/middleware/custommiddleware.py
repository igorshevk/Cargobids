from re import sub
from rest_framework.authtoken.models import Token

class CustomMiddleware:
	def __init__(self, get_response):
		self.get_response = get_response
		# One-time configuration and initialization.

	def __call__(self, request):
		return self.get_response(request)

	# def process_response(self, request, response):
	# 	if hasattr(response, 'data') and isinstance(response.data, dict):
	# 		try:
	# 			response_data = self.render_response(response)
	# 			response.status_code = response_data.get('status_http')

	# 			if 'status_http' in response_data:
	# 				del response_data['status_http']

	# 			token = sub('Token ', '', request.META.get('HTTP_AUTHORIZATION', None))
	# 			token_obj = Token.objects.get(key = token)
	# 			response.data = response_data
	# 			response.user = token_obj.user
	# 		except Exception:
	# 			pass
	# 	return response

