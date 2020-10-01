from django.shortcuts import render
# from profiles.models import Users
# from profiles.serializers import *
from django.contrib.auth.models import Group ,Permission

from rest_framework.decorators import api_view
from rest_framework import viewsets,permissions,filters, mixins, generics
# from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework.reverse import reverse
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
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
from django.contrib.auth.hashers import make_password

from profiles.models import Users,Activations,Agent
from memberships.models import Subscriptions,MembershipPlan
from memberships.serializers import *
from django.conf import settings
from common.helper import isAdmin, isAgent, isAirline
import stripe
from common.views import CommonViewset
from rest_framework_datatables.filters import DatatablesFilterBackend


class PaymentViewSet(CommonViewset,generics.RetrieveAPIView):
    queryset = Subscriptions.objects.all()
    serializer_class = PaymentSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,)
    ordering_fields = ('id','status','user__lastname', 'status','user__firstname','current_period_start','current_period_end',)
    filter_fields = ('id', 'status','user__firstname','current_period_start','current_period_end',)
    search_fields = ('id', 'status','user__firstname','current_period_start','current_period_end',)

    def list(self, request, *args, **kwargs):
        records = request.GET.get('records', None)
        user_id = request.GET.get('user_id', None)
        queryset = self.get_queryset()
        if not isAdmin(request.user):
            queryset = queryset.filter(user = request.user)
        else:
            if user_id is not None:
                queryset = queryset.filter(user_id=user_id)

        queryset = self.filter_queryset(queryset)
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

        if kwargs.get('pk') == 'paymenthistory':
            print(request.user)
            print(instance.user)
            response_data = self.get_serializer(request.user).data
            return Response(response_data)

        serializer = self.get_serializer(instance).data
        try:
            if isAgent(instance.user):
                serializer['company'] = to_dict(instance.user.agent_company)['agent_company_name']
            elif isAirline(instance.user):
                serializer['company'] = to_dict(instance.user.airline_company)['airline_company_name']
        except:
            serializer['company'] = ''
        return Response(serializer)

class MembershipPlanViewSet(viewsets.ModelViewSet,generics.RetrieveAPIView):
    queryset = MembershipPlan.objects.all()
    serializer_class = MembershipPlanSerializer
    filter_backends = (filters.OrderingFilter, filters.SearchFilter,DatatablesFilterBackend,)
    ordering_fields = ('id',)
    filter_fields = ('id',)
    search_fields = ('id', )

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


from rest_framework.decorators import authentication_classes
from datetime import datetime
@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def subscriptions(request): # one time Not in use
    token = request.data.get('token')
    if token['id']:
        from dateutil.relativedelta import relativedelta
        user_id = request.data.get('user_id')
        price = request.data.get('price')
        start_sub = datetime.now()
        month = request.data.get('month')
        total_cost = int(price) * int(month)
        if Users.objects.filter(id=user_id, trial=0).exists():
            Users.objects.filter(id=user_id).update(trial=1)
            month = int(month) + 1
        else:
            month = int(month)
        end_sub = start_sub + relativedelta(months=+ month)
        plan = request.data.get('plan')
        membership_id = 2
        if plan == "Basic":
            membership_id = 1
        Users.objects.filter(id=user_id).update(end_sub=end_sub) # used to access users
        # following will use to check users subscriptions history
        Subscriptions.objects.create(start_sub=start_sub, end_sub=end_sub, membership_id=membership_id,
                                     user_id=user_id, cost_per_month=price, total_cost=total_cost)
        return Response({'Success': 'Subscribed Successfully'}, status=HTTP_200_OK)
    else:
        return Response({'Error': token['message']}, status=HTTP_400_BAD_REQUEST)\


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def paymentDetails(request): # recurring

    stripe.api_key = settings.STRIPE_API_KEY
    payment_method = request.data.get('payment_method')
    user_id = request.data.get('user_id')
    if payment_method:
        customer = stripe.Customer.create(
            payment_method= payment_method,
            email=request.data.get('user_email'),
            invoice_settings={
                'default_payment_method': payment_method,
            },
        )
        if customer:
            subscription = stripe.Subscription.create(
                customer=customer.id,
                items=[
                    {
                        'plan':request.data.get('plan_id'),
                    },
                ],
                expand=['latest_invoice.payment_intent'],
                cancel_at_period_end=True # will canceled subscriptions to prevent auto charge
            )
            if subscription.id:
                # used to access users
                print('subscriptions is', subscription)
                subscriber = Subscriptions.objects.filter(user_id=user_id)
                if subscriber.exists():
                    subscriber = subscriber.last()
                else:
                    subscriber = Subscriptions(user_id=user_id)

                subscriber.membership = MembershipPlan.objects.get(pk=1)
                subscriber.subscription_id = subscription.id
                subscriber.cancel_at = datetime.fromtimestamp(subscription.cancel_at)
                subscriber.current_period_end = datetime.fromtimestamp(subscription.current_period_end) # today date will be saved because i have canceled subscriptions dusing creating
                subscriber.current_period_start = datetime.fromtimestamp(subscription.current_period_start)
                subscriber.customer_id = customer.id
                subscriber.cost_per_month = 1
                # subscription.days_until_due=subscription.days_until_due,
                subscriber.status = subscription.status
                subscriber.amount_paid = subscription.latest_invoice.amount_paid
                subscriber.amount_due = subscription.latest_invoice.amount_due
                subscriber.total_cost = subscription.plan.amount # converted cents into Dollar
                subscriber.interval = subscription.plan.interval
                subscriber.interval_count = subscription.plan.interval_count
                subscriber.payment_type = 'Stripe'
                subscriber.payment_received_on = datetime.now()
                subscriber.save()

                if subscriber.is_confirmed:
                    # send membership request to admin
                    subject = 'User Stripe Subscription Confirmed'
                    context = {
                        'name': '{} {}'.format(subscriber.user.firstname, subscriber.user.lastname), 
                        'btn_link': '{}/admin/subscribers/{}/edit'.format(settings.SITE_URL, subscriber.id),
                        'btn_label': 'Check Now',
                        'data':subscriber
                    }
                    temp_name = 'new_strip_subscription.html'
                    send_email(subject, context, subscriber.user.email, temp_name)
            return Response({'Success': 'Subscribed Successfully', 'auto_approve':subscriber.is_confirmed}, status=HTTP_200_OK)
        else:
            return Response({'Error': 'Customer Not Created'}, status=HTTP_400_BAD_REQUEST)
    else:
        return Response({'Error': 'Invalid Payment method'}, status=HTTP_400_BAD_REQUEST)



from rest_framework.decorators import authentication_classes
from datetime import datetime, timedelta
@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def cancelsubscriptions(request):

    stripe.api_key = settings.STRIPE_API_KEY
    user_id = request.data.get('user_id')
    if user_id:
        user = Users.objects.get(pk=user_id)
        if user.subscription_id and user.subscription_id is not None:
            stripe.Subscription.delete(user.subscription_id)

        subscription = user.subscriptions_set.last()
        subscription.cancel_at = datetime.now()
        subscription.canceled_by_user = 1
        subscription.save()
        return Response({'Success': 'Subscription Canceled successfully'}, status=HTTP_200_OK)
    else:
        return Response({'Error': 'Invalid Request'}, status=HTTP_400_BAD_REQUEST)

from datetime import datetime
@csrf_exempt
@api_view(["GET"])
@permission_classes((AllowAny,))
def allplans(request):

    stripe.api_key = settings.STRIPE_API_KEY
    plans = stripe.Plan.list()
    customData = {}
    for data in plans.data:
        if data['product'] in customData:
            customData[data['product']]['optionsList'] = [{
                "name": data['nickname'],
                "amount":data['amount']/100,
                "id":data['id'],
            }] + customData[data['product']]['optionsList']
        else:
            customData[data['product']] = data
            customData[data['product']]['optionsList'] = [{
                "name": data['nickname'],
                "amount":data['amount']/100,
                "id":data['id'],
            }]

    customData = [customData[data] for data in customData]
    return Response(customData ,  status=HTTP_200_OK)


@csrf_exempt
@api_view(["POST"])
@permission_classes((AllowAny,))
def customer(request):
    stripe.api_key = settings.STRIPE_API_KEY
    if request.data.get('customer_id'):
        data  = stripe.Customer.retrieve(request.data.get('customer_id'))
        return Response(data,  status=HTTP_200_OK)
    else:
        return Response({'Error': 'Invalid Customer'}, status=HTTP_400_BAD_REQUEST)



