from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import Http404
import random
from rest_framework.status import (
	HTTP_400_BAD_REQUEST,
	HTTP_404_NOT_FOUND,
	HTTP_200_OK,
	HTTP_204_NO_CONTENT
)

import csv
@api_view(['GET'])
def airport_data(request):
	# code = request.data.get('code', None)
	objects = []
	with open('./airports.csv', encoding="utf8") as f:
		reader = csv.reader(f, skipinitialspace=True)
		header = next(reader)
		for row in reader:
			# if code in row[4]:
			objects.append(row)

		return Response({'success': 'Data imported successfully',"data":objects}, status=HTTP_200_OK)


@api_view(['GET'])
def airports_filter_code(request, code):
	airport = []
	with open('./airports.csv', encoding="utf8") as f:
		reader = csv.reader(f, skipinitialspace=True)
		header = next(reader)
		for row in reader:
			if code.upper() == row[4]:
				airport = row

		return Response({'success': 'Data imported successfully',"data":airport}, status=HTTP_200_OK)