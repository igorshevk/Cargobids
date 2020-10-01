from rest_framework.decorators import authentication_classes
from django.shortcuts import render
import simplejson
# from profiles.models import Users
# from profiles.serializers import *
from datetime import timedelta
import pytz
from django.utils import timezone
from django.contrib.auth.models import Group, Permission
from django.http import JsonResponse
from rest_framework.decorators import api_view, action
from rest_framework import viewsets, permissions, filters, mixins, generics
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.reverse import reverse
from django.core import serializers
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from knox.models import AuthToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_204_NO_CONTENT
)
from rest_framework.response import Response
from django.http import Http404
from django.contrib.contenttypes.models import ContentType
import json
from django.db.models import Q
import random
import csv
from django.contrib.auth.hashers import make_password, check_password

from profiles.models import Users, Activations, Agent, Airline, Quote, Bid, Question
from profiles.serializers import *
from django.conf import settings
from common.views import CommonViewset
from common.helper import send_email, isAdmin, to_dict, isAirline, isAgent, getAirportName, adminEmails
from datetime import datetime
from django.db.models import Count
from cargobids.settings.base import pusher_client


class GroupsViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):

    queryset = Group.objects.order_by('name')
    serializer_class = GroupSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'name')
    filter_fields = ('id',)
    search_fields = ('id', 'name')

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = self.perform_create(serializer)
        group.save()
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # def destroy(self, request, *args, **kwargs):
    #     resp = safe_delete(self, request, Group)
    #     return resp


# ---------groups views --------------#
class PermissionsViewSet(viewsets.ModelViewSet, generics.RetrieveAPIView):

    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'name',)
    filter_fields = ('id',)
    search_fields = ('id', 'name',)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        group = self.perform_create(serializer)
        group.save()
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # def destroy(self, request, *args, **kwargs):
    #     request_data = json.loads(request.body.decode('utf-8'))
    #     if 'ids' in request_data:
    #         Permission.objects.filter(id__in=request_data['ids']).delete()
    #         return Response(status=HTTP_204_NO_CONTENT)
    #     else:
    #         return super(PermissionsViewSet, self).destroy(request, *args, **kwargs)


class UserViewSet(CommonViewset):

    queryset = Users.objects.filter(deleted_at=None)
    serializer_class = UsersSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'email',)
    filter_fields = ('email', 'groups__name', 'is_active')
    search_fields = ('email', )

    def list(self, request, *args, **kwargs):
        not_group = request.GET.get('not_group', None)
        records = request.GET.get('records', None)
        queryset = self.filter_queryset(self.get_queryset())

        if not_group is not None:
            queryset.exclude(groups__name='User')

        page = self.paginate_queryset(queryset)
        if page is not None and records is None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)

        # return apiCustomizedResponse(serializer.data)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()
    #
    # def create(self, request):
    #     serializer = self.get_serializer(data=request.data)
    #     serializer.is_valid(raise_exception=True)
    #     user = self.perform_create(serializer)
    #     # user.password = make_password(request.data['password'])
    #     user.set_password(request.data['password'])
    #     user.save()
    #     post_data = request.data['groups']
    #     user.groups.add(post_data)
    #     return Response(serializer.data)

    def retrieve(self, request: Request, *args, **kwargs):
        if kwargs.get('pk') == 'me':
            response_data = self.get_serializer(request.user).data
            response_data['permissions'] = Permission.objects.filter(
                id__in=request.user.user_permissions.values_list('id', flat=True)).values_list('codename', flat=True)
            response_data['group_permissions'] = request.user.groups.first(
            ).permissions.all().values_list('codename', flat=True)
            response_data['group_name'] = request.user.groups.first().name
            subscription = request.user.subscriptions_set.filter(
                status='active', cancel_at__gt=datetime.now())
            if subscription.exists():
                response_data['subscription'] = to_dict(subscription.last())
                response_data['plan'] = subscription.last().membership.name
            else:
                response_data['subscription'] = None

            response_data['last_subscription'] = request.user.subscriptions_set.last(
            ).id if request.user.subscriptions_set.exists() else None
            try:
                response_data['days_left'] = (
                    response_data['subscription']['current_period_end'].date() - datetime.today().date()).days
            except:
                response_data['days_left'] = 0

            sett = set()
            for group in request.user.groups.all():
                sett.add(group.name)

            response_data['groups'] = sett
            response_data['token'] = request.headers["Authorization"][6:]
            response_data['notifications'] = NotificationSerializer(
                request.user.notifications, many=True).data
            return Response(response_data)

        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    # def destroy(self, request, *args, **kwargs):
    #     resp = safe_delete(self, request, AbUsers)
    #     return resp


class AirlinesViewSet(CommonViewset):
    queryset = Airline.objects.filter(deleted_at=None)
    serializer_class = AirlineSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'airline_company_name',)
    filter_fields = ('id', 'is_active',)
    search_fields = ('id', 'airline_company_name',)

    def list(self, request, *args, **kwargs):
        records = request.GET.get('records', None)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None and records is None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()

    def retrieve(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class AgentsViewSet(CommonViewset):
    queryset = Agent.objects.filter(deleted_at=None)
    serializer_class = AgentSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'agent_company_name',)
    filter_fields = ('id', 'is_active',)
    search_fields = ('id', 'agent_company_name',)

    def list(self, request, *args, **kwargs):
        records = request.GET.get('records', None)
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None and records is None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()

    def retrieve(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


class QuoteViewSet(CommonViewset):
    queryset = Quote.objects.order_by('publish').order_by('-status')
    serializer_class = QuoteSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'title', 'destination', 'publish',
                       'deadline', 'status', 'rfc', 'weight', 'kilos')
    filter_fields = ('id',)
    search_fields = ('id', 'author', 'title', 'types',)
    lookup_field = 'slug'

    def list(self, request, *args, **kwargs):
        records = request.GET.get('records', None)
        weight = request.GET.get('weight_', None)
        queryset = self.get_queryset()
        if weight is not None:
            op = weight[0]
            if op == '<':
                queryset = queryset.filter(weight__lte=weight[1:])
            elif op == '>':
                queryset = queryset.filter(weight__gte=weight[1:])

        if isAgent(request.user):
            queryset = queryset.filter(author=request.user)
        if isAirline(request.user):
            queryset = queryset.exclude(publish=None)
            scope = request.GET.get('scope', None)
            if scope is not None and scope == 'my':
                queryset = queryset.filter(
                    bids__author=request.user, bids__status='OPEN')

        date_fields = ['publish', 'deadline', 'rfc']
        kwargs = {}
        for field in date_fields:
            dateVal = request.GET.get(field, None)
            if dateVal is not None:
                try:
                    kwargs[field] = datetime.strptime(
                        dateVal.strip(), '%d-%m-%y').date()
                except:
                    pass

        if kwargs:
            queryset = queryset.filter(**kwargs)

        fields = ['title', 'types', 'status', 'destination',
                  'area', 'origin', 'destination', 'piece', 'weight']
        kwargs = {}
        for field in fields:
            fieldVal = request.GET.get(field, None)
            if fieldVal is not None:
                try:
                    kwargs['{}__icontains'.format(field)] = fieldVal.strip()
                except:
                    pass

        if kwargs:
            queryset = queryset.filter(**kwargs)

        queryset = self.filter_queryset(queryset)
        page = self.paginate_queryset(queryset)
        if page is not None and records is None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        return serializer.save()

    def partial_update(self, request, *args, **kwargs):
        response = super().partial_update(request, *args, **kwargs)
        if request.data.get('is_publish'):
            # push this new quote to all airlines
            msg = simplejson .dumps(response.data)
            pusher_client.trigger(
                f'airlines', f'quote_created', {u'message': msg})

        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        if not request.data.get('updateCount'):
            # push this deleted quote to all airlines
            msg = simplejson .dumps(response.data)
            pusher_client.trigger(
                f'airlines', f'quote_closed', {u'message': msg})

            # push this update to airlines that bid on this quote
            quote_id = response.data["id"]
            pusher_client.trigger(f'agent{quote_id}', f'bid{quote_id}', {
                                  u'message': u'bid has been deleted'})

        return response

    def retrieve(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)

        # check if user has quote permission
        if(request.user != instance.author and not isAirline(request.user)):
            return Response({'error': True, 'message': 'No permission'}, status=HTTP_404_NOT_FOUND)

        data = serializer.data
        data['airport'] = getAirportName(instance.destination)
        data['bids'] = BidSerializer(instance.bids.filter(
            author=request.user), many=True).data
        # list(instance.quote.bids.annotate(rank=(F('rate') + F('surcharges')) * F('cw_required')).order_by(
        #     'rank').values_list('id', flat=True)).index(instance.id) + 1
        if instance.status == 'CLOSED':
            try:
                data['author'] = to_dict(instance.author)
            except:
                data['author'] = None
            try:
                data['company'] = to_dict(instance.author.agent_company)
            except:
                data['company'] = None

        return Response(data)


class BidViewSet(CommonViewset):
    queryset = Bid.objects.annotate(rank=(
        F('rate') + F('surcharges')) * F('cw_required')).order_by('-status', 'rank')
    serializer_class = BidSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id', 'status')
    filter_fields = ('id',)
    search_fields = ('id', 'author')
    paginate_by = 20

    def list(self, request, *args, **kwargs):
        records = request.GET.get('records', None)
        quote = request.GET.get('quote', None)

        queryset = self.get_queryset()

        if isAgent(request.user):
            queryset = queryset.filter(
                quote__author=request.user, quote_id=quote)

        date_fields = ['publish']
        kwargs = {}
        for field in date_fields:
            dateVal = request.GET.get(field, None)
            if dateVal is not None:
                try:
                    kwargs[field] = datetime.strptime(
                        dateVal.strip(), '%d-%m-%y').date()
                except:
                    pass

        if kwargs:
            queryset = queryset.filter(**kwargs)

        fields = ['status', 'carrier', 'rate', 'all_in', 'surcharges',
                  'cw_required', 'origin', 'conditions', 'remarks']
        kwargs = {}
        for field in fields:
            fieldVal = request.GET.get(field, None)
            if fieldVal is not None:
                try:
                    kwargs['{}__icontains'.format(field)] = fieldVal.strip()
                except:
                    pass

        if kwargs:
            queryset = queryset.filter(**kwargs)

        queryset = self.filter_queryset(queryset)
        # page = self.paginate_queryset(queryset)
        # if page is not None and records is None:
        #     serializer = self.get_serializer(page, many=True)
        #     return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        instance = serializer.save()
        # send this new quote airlines
        bid_id = instance.id
        quote = Bid.objects.get(pk=bid_id).quote
        pusher_client.trigger(f'agent{quote.id}', f'bid{quote.id}', {
                              u'message': u'bid has been created'})

        # push the updated bids to the agent author
        msg = {
            "quote": quote.id,
            "bids": quote.bids.filter(status="OPEN").count()
        }
        msg = simplejson.dumps(msg)
        pusher_client.trigger(f'agent', f'bid_added', {u'message': msg})
        return instance

    def retrieve(self, request: Request, *args, **kwargs):
        instance = self.get_object()
        # check if user has bid permission
        if(request.user != instance.author and instance.quote.author != request.user):
            return Response({'error': True, 'message': 'No permission'}, status=HTTP_404_NOT_FOUND)
        serializer_data = self.get_serializer(instance).data
        serializer_data['author'] = UsersSerializer(instance.author).data
        return Response(serializer_data)

    def update(self, request, *args, **kwargs):
        # update all the airline bids list that bid on this quote
        # try:
        response = super().update(request, *args, **kwargs)
        # except Exception as e:
        #     print(e)
        #     response = Response({"success" : True})
        bid_id = request.data.get("id")
        quote = Bid.objects.get(pk=bid_id).quote
        pusher_client.trigger(f'agent{quote.id}', f'bid{quote.id}', {
                              u'message': u'bid has been created'})

        return response

    def partial_update(self, request, *args, **kwargs):
        # update all the airline bids list that bid on this quote
        # try:
        response = super().partial_update(request, *args, **kwargs)
        # except Exception as e:
        #     print(e)
        #     response = Response({"success" : True})
        bid_id = kwargs.get("pk")
        quote_id = Bid.objects.get(pk=bid_id).quote.id
        pusher_client.trigger(f'agent{quote_id}', f'bid{quote_id}', {
                              u'message': u'bid has been deleted'})

        return response


@api_view(['GET'])
def api_root(request, format=None):
    return Response({
        'users': reverse('users', request=request, format=format),
    })


@api_view(['GET'])
def bids_summary(request, pk, format=None):

    bid_all_in = 0
    bid_without_surcharges = 0
    bid_have_origin = {}
    bid_have_condition = {}
    bid_req_cw_required = 0

    unique_bid = Bid.objects.get(id=pk)
    total_bids = Bid.objects.filter(quote_id=unique_bid.quote_id)

    for bid in total_bids:
        if bid.all_in == 'ALLIN':
            bid_all_in = bid_all_in + 1
        if bid.all_in != 'ALLIN':
            bid_without_surcharges = bid_without_surcharges + 1
        # if bid.all_in != 'ALLIN':
        #     bid_without_surcharges = bid_without_surcharges + 1
        if bid.origin in bid_have_origin:
            bid_have_origin[bid.origin] += 1
        else:
            bid_have_origin[bid.origin] = 1

        if bid.conditions in bid_have_condition:
            bid_have_condition[bid.conditions] += 1
        else:
            bid_have_condition[bid.conditions] = 1

        if bid.cw_required > unique_bid.cw_required:
            bid_req_cw_required = bid_req_cw_required + 1
    res = {
        'bid_all_in': bid_all_in,
        'bid_without_surcharges': bid_without_surcharges,
        'bid_have_origin': bid_have_origin,
        'bid_require_CW': bid_req_cw_required,
        'bid_have_condition': bid_have_condition
    }
    return Response(res)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)
    try:
        user = Users.objects.get(email=email)
        corrent_pass = user.check_password(password)
    except:
        user = None
        corrent_pass = None

    if not user or not corrent_pass:
        return Response({'error': 'Invalid Credentials or your account is currently inactive'}, status=HTTP_404_NOT_FOUND)
    data = Users.objects.get(id=user.id)
    if data.email_verified == "0":
        return Response({'error': 'Please Verify your email before login'}, status=HTTP_404_NOT_FOUND)
    if data.is_active == "0":
        return Response({'error': 'Your account is deactivated kindly contact to the Administrator'}, status=HTTP_404_NOT_FOUND)
    key = random.randrange(1111, 9999)
    to = email
    subject = 'Login Verifications Code'
    context = {'name': '{} {}'.format(
        user.firstname, user.lastname), 'content': 'Login Verifications Code:  ' + str(key)}
    temp_name = 'authentications.html'
    try:
        send_email(subject, context, to, temp_name)
    except:
        Response({'error': 'Please try again'})
    user.authcode = key
    user.save()
    groups = data.groups.all()
    sett = set()
    for group in groups:
        sett.add(group.name)
    return Response({'id': data.id, 'email': data.email, 'firstname': data.firstname, 'lastname': data.lastname, 'groups': sett},
                    status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes((AllowAny,))
def check_login(request, token):
    # if the user have a valid token retun http200 success
    # otherways the app will get 401 Unauthorized
    try:
        user_token = AuthToken.objects.get(token_key=token)
        # if the token has expired delete the token and logout the user
        # utc=pytz.UTC
        now = timezone.now()
        print("expiry : ", user_token.expiry)
        if now > user_token.expiry:
            user_token.delete()
            return Response({'error': 'this user is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        else:
            # the token is valid and the user is authenticated
            return Response({'success': 'this user is authenticated'}, status=HTTP_200_OK)
    except:
        return Response({'error': 'this user is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
def logout(request):
    try:
        AuthToken.objects.filter(user=request.user).delete()
    except:
        pass
    return Response({'success': 'Successfully Logged Out'}, status=HTTP_200_OK)


@api_view(["POST"])
@permission_classes((AllowAny,))
def close_browser(request):
    try:
        token = AuthToken.objects.get(token_key=request.data["token"])
        new_expiry = token.expiry - timedelta(minutes=1, seconds=30)
        token.expiry = new_expiry
        token.save(update_fields=('expiry',))
    except Exception as e:
        print("error occured : ", e)
        return Response({'success': 'Error occured'}, status=HTTP_400_BAD_REQUEST)
    return Response({'success': 'success'}, status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def authenticate_user(request):
    email = request.data.get("email")
    user_id = request.data.get("id")
    key = request.data.get("key")
    if key.isdigit() == False:
        return Response({'error': 'Please enter a Valid 2FA code sent to your attached email address.'}, status=HTTP_400_BAD_REQUEST)
    if email is None or id is None or key is None:
        return Response({'error': 'Provide Email,User id, Key'}, status=HTTP_400_BAD_REQUEST)
    user = Users.objects.filter(pk=user_id, email=email, authcode=key)
    if not user:
        return Response({'error': 'Please enter a Valid 2FA code sent to your attached email address.'}, status=HTTP_404_NOT_FOUND)
    user_obj = Users.objects.get(id=user[0].id)
    # AuthToken.objects.filter(user=user_obj).delete()
    token = AuthToken.objects.create(user=user_obj)[1]
    groups = user_obj.groups.all()
    subscription = user_obj.subscriptions_set.filter(status='active')
    subscription = to_dict(
        subscription.last()) if subscription.exists() else None
    sett = set()
    for group in groups:
        sett.add(group.name)
    return Response({'email': user_obj.email, 'firstname': user_obj.firstname, 'lastname': user_obj.lastname, 'groups': sett,
                     'token': token, 'user_id': user_obj.id, 'subscription': subscription}, status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
@authentication_classes([])
def registrations(request):
    email = request.data.get("email")
    firstname = request.data.get("firstname")
    lastname = request.data.get("lastname")
    password = make_password(request.data.get("password"))
    groups = request.data.get("groups")
    if email is None or password is None:
        return Response({'error': 'Please provide both email and password'},
                        status=HTTP_400_BAD_REQUEST)

    if len(request.data.get("password")) < 6:
        return Response({'error': 'Password must be at least six characters long'},
                        status=HTTP_400_BAD_REQUEST)
    if groups is None:
        return Response({'error': 'Please select user type'},
                        status=HTTP_400_BAD_REQUEST)
    if groups == "1":
        return Response({'error': 'Invalid user type selected'}, status=HTTP_400_BAD_REQUEST)
    if Users.objects.filter(email=email).exists():
        return Response({'error': 'This email has already been taken'}, status=HTTP_400_BAD_REQUEST)
    user = Users.objects.create(
        email=email, password=password, firstname=firstname, lastname=lastname)
    user.groups.set([groups])
    activation = Activations.objects.create(
        user=user)  # activations key generated
    activation_key = activation.key
    url = settings.SITE_URL
    to = user.email
    subject = 'Your Account is registered successfully'
    context = {'name': '{} {}'.format(firstname, lastname),
               'url': url + '/cb/account/complete?key=' + str(activation_key)}
    temp_name = 'activations.html'
    send_email(subject, context, to, temp_name)
    if not user:
        return Response({'error': 'Some Thing happened Wrong'}, status=HTTP_404_NOT_FOUND)
    else:
        return Response({'Success': 'Application sent.'}, status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def activations(request):
    from uuid import UUID
    key = request.data.get('key')
    try:
        uuid_obj = UUID(key, version=4)
    except ValueError:
        return Response({'error': 'Invalid Key Provided'}, status=HTTP_400_BAD_REQUEST)
    queryset = Activations.objects.filter(key=key)
    if not queryset:
        return Response({'error': 'Invalid Key Provided'}, status=HTTP_404_NOT_FOUND)
    activation = queryset.get()
    user_id = activation.user_id
    user = Users.objects.get(pk=user_id)
    user.email_verified = True
    user.save()
    if not user:
        return Response({'error': 'User does not exists '}, status=HTTP_404_NOT_FOUND)
    else:
        return Response({
            'Success': 'Your email has been verified successfully!',
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'group_name': user.groups.all()[0].name,
            'group_id': user.groups.all()[0].id
        }, status=HTTP_200_OK)


@csrf_exempt
@api_view(["PATCH"])
@permission_classes((AllowAny,))
@authentication_classes([])
def registration_complete(request):
    from uuid import UUID
    activationKey = request.data.get("activationKey")
    userID = request.data.get("userID")

    if userID is None or str(userID).isdigit() == False:
        return Response({'error': 'Invalid User'}, status=HTTP_400_BAD_REQUEST)
    try:
        user = Users.objects.get(pk=userID)
    except:
        return Response({'error': 'User does not exists'}, status=HTTP_404_NOT_FOUND)
    try:
        uuid_obj = UUID(activationKey, version=4)
    except ValueError:
        return Response({'error': 'Invalid Key Provided'}, status=HTTP_400_BAD_REQUEST)

    activation = Activations.objects.filter(key=activationKey, user_id=userID)
    if activation.exists() == False:
        return Response({'error': 'User authentications Fails'}, status=HTTP_404_NOT_FOUND)

    data = {}
    data['firstname'] = user.firstname
    data['lastname'] = user.lastname
    data['email'] = user.email
    data['companyname'] = request.data.get("companyname")
    data['branch'] = request.data.get("branch")
    data['iata'] = request.data.get("iata", None)
    data['cf'] = request.data.get("cf", '')
    data['pec'] = request.data.get("pec", '')
    data['sdi'] = request.data.get("sdi", '')
    data['p_iva'] = request.data.get("p_iva", '')
    data['address'] = request.data.get("address")
    data['address2'] = request.data.get("address2")
    data['zip_code'] = request.data.get("zip_code")
    data['city'] = request.data.get("city")
    data['user_type'] = 'Agent' if isAgent(user) else 'Airline'

    if not data['companyname']:
        return Response({'error': 'Company name field can not be left empty'}, status=HTTP_400_BAD_REQUEST)

    if not data['address']:
        return Response({'error': 'Address 1 field can not be left empty'}, status=HTTP_400_BAD_REQUEST)

    if not data['city']:
        return Response({'error': 'City field can not be left empty'}, status=HTTP_400_BAD_REQUEST)

    if not data['zip_code']:
        return Response({'error': 'Zip Code field can not be left empty'}, status=HTTP_400_BAD_REQUEST)

    if isAgent(user):
        if not data['iata'] or data['iata'] is None:
            return Response({'error': 'Iata field can not be left empty'}, status=HTTP_400_BAD_REQUEST)

        if len(data['iata']) > 11:
            return Response({'error': 'Iata should not be more than 11 characters'}, status=HTTP_400_BAD_REQUEST)

    if data['sdi'] is not None and len(data['sdi']) > 0 and len(data['sdi']) != 7:
        return Response({'error': 'SDI should be 7 characters long'}, status=HTTP_400_BAD_REQUEST)

    subject = 'New Registration'

    # to = list(Users.objects.filter(groups__name='Admin').values_list('email', flat=True))

    context = {
        'content': 'New {} user has been registered on Cargobids with following details'.format(data['user_type']),
        'url': '{}/admin/users/{}/edit'.format(settings.SITE_URL, user.id),
        'data': data
    }
    temp_name = 'new_registration.html'
    send_email(subject, context, adminEmails(), temp_name)
    if not user:
        return Response({'error': 'Some Thing happened Wrong'}, status=HTTP_404_NOT_FOUND)
    else:
        activation.delete()
        return Response({'Success': 'Thanks you will be notified once registration is complete'}, status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def password_reset_request(request):
    email = request.data.get('email')
    import uuid
    keyUUID = uuid.uuid4()
    # return Response(keyUUID)
    # try:
    if email is None:
        return Response({'error': 'Email field can not be left empty'}, status=HTTP_400_BAD_REQUEST)
    if Users.objects.filter(email=email).exists():
        user = Users.objects.get(email=email)
        user_id = user.id
        firstname = user.firstname if True else ''
        lastname = user.lastname if True else ''
        user_name = str(firstname) + ' ' + str(lastname)
        # key = random.randrange(11111, 99999)
        # key = str(key) + str(user_id)
        # key = keyUUID
        user.new_pass_key = str(keyUUID)
        user.save()
        to = email

        if isAdmin(user):
            url = '{}/admin/auth/password-reset/{}'.format(
                settings.SITE_URL, keyUUID)
        else:
            url = '{}/cb/account/password-reset?key={}'.format(
                settings.SITE_URL, keyUUID)

        subject = 'Reset your Password'
        context = {'name': user_name, 'content': 'View Following Link to reset your Password',
                   'url': url}
        temp_name = 'reset_password.html'
        send_email(subject, context, to, temp_name)
        return Response({'Success': 'Email sent successfully'}, status=HTTP_200_OK)
    else:
        return Response({'error': 'This email does not exist'}, status=HTTP_400_BAD_REQUEST)
    # except Exception as e:
    #     print('THis should be error',e)
    #     return Response({'error': 'some error'}, status=HTTP_400_BAD_REQUEST)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def update_password(request):
    password = request.data.get('password')
    c_password = request.data.get('c_password')
    key = request.data.get('key')
    if password is None or c_password is None:
        return Response({'error': 'Password and confirm Password fields can not be left empty!'},
                        status=HTTP_400_BAD_REQUEST)
    if len(password) <= 6:
        return Response({'error': 'Password must be 6 digits or more'}, status=HTTP_400_BAD_REQUEST)
    if password != c_password:
        return Response({'error': 'Password does not match !'}, status=HTTP_400_BAD_REQUEST)
    if key is None or Users.objects.filter(new_pass_key=key).exists() == False:
        return Response({'error': 'Invalid key provided', 'key': key}, status=HTTP_400_BAD_REQUEST)

    try:
        import uuid
        user = Users.objects.get(new_pass_key=key)
        # check if password is not same as old one
        if check_password(password, user.password):
            return Response({'error': 'New password must be different from old one'}, status=HTTP_400_BAD_REQUEST)

        new_uuid = uuid.uuid4()
        password = make_password(request.data.get("password"))
        user.new_pass_key = new_uuid
        user.password = password
        user.save()
        return Response({'success': 'Password has been updated successfully'}, status=HTTP_200_OK)
    except:
        return Response({'error': 'Failed to update password'}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def import_data(request):
    import csv
    csv_file = request.FILES['data']
    model = request.data.get('model')
    if model is None or csv_file is None:
        return Response({'error': True, 'message': 'Select a valid file'}, status=HTTP_200_OK)
    decoded_file = ''
    try:
        decoded_file = csv_file.read().decode('utf-8').splitlines()
    except:
        return Response({'error': 'Select a valid CSV file', 'message': e}, status=HTTP_400_BAD_REQUEST)

    reader = csv.DictReader(decoded_file)
    inputCols = ['agent_company_name', 'iata', 'branch',
                 'address_1', 'address_2', 'zip_code', '', 'is_active']
    obj = Agent()
    objects = []
    try:
        for row in reader:
            for col in row:
                if col in inputCols:
                    setattr(obj, col, row[col])
            objects.append(obj)
        Agent.objects.bulk_create(objects, ignore_conflicts=True)
        return Response({'success': 'Data imported successfully'}, status=HTTP_200_OK)
    except:
        return Response({'error': 'Something happened wrong'}, status=HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def import_data_air(request):
    data = request.data.get('data')
    cols = request.data.get('cols')

    if "iata" not in cols:
        return Response({'error': 'No iata column found in data'}, status=HTTP_400_BAD_REQUEST)

    model = request.data.get('model')
    import_data_structure = {
        # 'Agent': ['agent_company_name', 'iata', 'branch', 'address_1', 'address_2', 'zip_code', '', 'is_active'],
        'Agent': ['agent_company_name', 'iata', 'branch', 'address_1', 'address_2'],
        'Airline': ['agent_company_name', 'iata', 'branch', 'address_1', 'address_2', 'zip_code', '', 'is_active'],
    }
    # try:
    if model in import_data_structure:
        # list of columns that are allowed to import
        allowCols = import_data_structure[model]
        if data:
            # excel columns input by user
            data.pop(0)
            inputCols = cols
            objects = []
            for row in data:
                obj = eval(model)()
                for index, col in enumerate(inputCols):
                    # check if column is allowed
                    if col in allowCols:
                        setattr(obj, col, row[index])

                objects.append(obj)

            model = eval(model)
            model.objects.bulk_create(objects, ignore_conflicts=True)
    return Response({'success': True, 'message': 'Record has been imported successfully'})
    # except:
    #   return Response({'success':False, 'message':'Error! Invalid data'})


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def activate_trial(request):
    trial_key = request.data.get('trial_key')
    # try:
    users = Users.objects.filter(trial_key=trial_key)
    if users.exists():
        user = users.first()
        subject = 'New Request For Trial Period'
        context = {
            'name': '{} {}'.format(user.firstname, user.lastname),
            'url': '{}/admin/subscribers/add/{}'.format(settings.SITE_URL, user.id)
        }
        temp_name = 'request_trial_period.html'
        user.trial_key = None
        user.save()
        send_email(subject, context, adminEmails(), temp_name)

        return Response({'success': True}, status=HTTP_200_OK)
    else:
        return Response({'success': False}, status=HTTP_200_OK)
    # except:
    #     return Response({'success':False}, status=HTTP_200_OK)


@api_view(['GET'])
def get_companies(request):
    companies = []
    with open('./companies.csv', encoding="utf8") as f:
        reader = csv.reader(f, skipinitialspace=True)
        header = next(reader)
        for row in reader:
            # if code in row[4]:
            companies.append(row)

        keys = ['cassCountryCode', 'codeIata', 'codeCass', 'name', 'address1', 'address2', 'city', 'country',
                'phone', 'vat', 'start_date', 'end_date', 'default_date', 'short_name', 'email', 'headOffice', 'type']
        companies = [dict(zip(keys, l)) for l in companies]

        return Response(companies, status=HTTP_200_OK)


# ************************** Q&A SECTION *******************
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAuthenticated]
    # def list(self, request):
    #     queryset = Question.objects.all()
    #     serializer = QuestionSerializer(queryset,many=True)
    #     return Response(serializer.data)

    def create(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        qst = serializer.save()

        quote_num = request.data["quote"]
        content = request.data["content"]
        quote = Quote.objects.filter(pk=quote_num).first()
        quote_user_email = quote.author
        user = Users.objects.get(email=quote_user_email)
        user2 = request.user

        user_name = user.firstname
        user_surname = user.lastname

        user2_name = user2.firstname
        user2_surname = user2.lastname

        airline_company_name = user2.airline_company.airline_company_name if user2.airline_company else None

        quote_tit = quote.title
        LINK = '{}/cb/agent/quotes/reply?id={}'.format(
            settings.SITE_URL, qst.id)
        to = quote_user_email
        subject = 'Nuova domanda su una tua inserzione'
        context = {
            'link': LINK, 'name': user_name + user_surname,
            'question': qst.content,
            'content1': f'Gentile {user_name} {user_surname},',
            'content2': f'''
                    L'utente {user2_name} {user2_surname}, dell'Azienda {airline_company_name}, ti ha inviato la seguente domanda
                    a riguardo della tua inserzione {quote_tit}:
                ''',
            'content3': f'Clicca sul seguente link se intendi rispondere e pubblicare:'
        }
        temp_name = 'question.html'
        try:
            send_email(subject, context, to, temp_name)
        except:
            Response({'error': 'Please try again'},
                     status=HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=HTTP_200_OK)


class VirificationQuestionView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = VirificationQuestion

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user
        question_id = request.data["question_id"]
        question = Question.objects.filter(pk=question_id).first()
        if question == None or question.replay:
            return Response({'error': 'this question does not existe'}, status=HTTP_400_BAD_REQUEST)
        else:
            if str(question.quote.author.id) == str(user.id):
                airline_company_name = question.author.airline_company.airline_company_name if question.author.airline_company else None
                return Response({
                    "airlineName": question.author.firstname + " " + question.author.lastname,
                    "company": airline_company_name,
                    "content": question.content,
                    "id": question.id,
                    "quote": question.quote.slug,
                    "quoteTitle": question.quote.title,
                }, status=HTTP_200_OK)
            else:
                return Response({'error': 'this is not the owner of the quote'}, status=HTTP_400_BAD_REQUEST)


class PublishQuestionView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PublishQuestionSer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question_id = kwargs["id"]
        question = Question.objects.get(pk=question_id)
        if question == None:
            return Response({'error': 'this question does not exist'}, status=HTTP_400_BAD_REQUEST)

        if request.user.id == question.quote.author.id:
            question.visible = True
            question.replay = request.data["replay"]
            question.publish_at = datetime.now()
            question.save()
            return Response({"success": "question has been published successfully"}, status=HTTP_200_OK)
        else:
            return Response({'error': 'this is not the owner of the quote'}, status=HTTP_400_BAD_REQUEST)


class DiscardQuestionView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PublishQuestionSer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        question_id = kwargs["id"]
        question = Question.objects.get(pk=question_id)
        if question == None:
            return Response({'error': 'this question does not existe'}, status=HTTP_400_BAD_REQUEST)

        if request.user.id == question.quote.author.id:
            question.delete()
            return Response({"success": "question has deleted succefully"}, status=HTTP_200_OK)
        else:
            return Response({'error': 'this is not the owner of the quote'}, status=HTTP_400_BAD_REQUEST)


class GetQuoteQuestionsView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        quote_slug = kwargs["slug"]
        try:
            quote = Quote.objects.get(slug=quote_slug)
        except:
            return Response({'error': '404'}, status=HTTP_404_NOT_FOUND)
        if isAirline(request.user) or quote.author.id == request.user.id:
            related_questions = quote.questions.filter(visible=True)
            questions_ser = QuestionSerializer(related_questions, many=True)
            return Response(questions_ser.data, status=HTTP_200_OK)

        else:
            return Response({'error': '403 FOrbidden'}, status=HTTP_400_BAD_REQUEST)


class QuoteQuestionView(APIView):
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = QuoteQuestion(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote_id = request.data["quote_id"]
        quote = Quote.objects.filter(pk=quote_id).first()

        if quote == None:
            return Response({'error': 'this quote does not existe'}, status=HTTP_400_BAD_REQUEST)
        else:
            quetions = Question.objects.filter(quote=quote)
            quotequestions_ser = QuestionSerializer(quetions, many=True)
            return Response({"quotequestions": quotequestions_ser.data}, status=HTTP_200_OK)


class QouteBidCountView(APIView):
    """
    API View that retruns:
    - Total website open Quotes
    - Total number of Bids On actual open quotes
    """
    permission_classes = [AllowAny]

    def get(self, request):
        quote = Quote.objects.filter(status='OPEN').count()
        bids = Bid.objects.filter(
            quote__status='OPEN'
        ).count()
        return Response({
            'quotes_count': quote,
            'bids_count': bids,
        })


@api_view(['GET'])
def getCarrier(request, code):
    airline = []
    with open('./airlines.csv', encoding="utf8") as f:
        reader = csv.reader(f, skipinitialspace=True)
        header = next(reader)
        for row in reader:
            if code.upper() == row[1].upper():
                airline = row
                break

        return Response({"data": airline}, status=HTTP_200_OK)


@api_view(['POST'])
def notifications_mark_as_read(request):
    request.user.notifications.mark_all_as_read()
    return Response({"success": True}, status=HTTP_200_OK)


@api_view(['DELETE'])
def delete_notification(request, pk):
    request.user.notifications.filter(id=pk).delete()
    return Response({"success": True}, status=HTTP_200_OK)
