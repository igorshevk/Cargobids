from rest_framework import serializers

from profiles.models import Users, Activations, Airline, Agent, Agent
from memberships.models import Subscriptions, MembershipPlan
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator
from rest_framework.response import Response
# from profiles.views import send_emails
import datetime
from django.db.models import Q
from django.contrib.auth.validators import UnicodeUsernameValidator

from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_204_NO_CONTENT
)

from django.contrib.contenttypes.models import ContentType
from common.helper import to_dict, send_email, isAdmin, adminEmails
from django.conf import settings


class PaymentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    exception_note = serializers.CharField(
        allow_blank=True, allow_null=True, required=False, write_only=True)

    def __init__(self, *args, **kwargs):
        super(PaymentSerializer, self).__init__(*args, **kwargs)
        if self.context['request'].method == 'PATCH' and isAdmin(self.context['request'].user):
            self.fields['payment_type'].required = True
        self.fields['membership'].required = True
        if not isAdmin(self.context['request'].user):
            self.fields['user'].required = False
            self.fields['current_period_end'].required = False
            self.fields['current_period_start'].required = False
        else:
            self.fields['payment_received_on'].required = True

        # self.fields['invoice_sent_on'].required = True

    def create(self, validated_data):

        if 'exception_note' in validated_data:
            validated_data.pop('exception_note')

        if not isAdmin(self.context['request'].user):
            validated_data['user'] = self.context['request'].user
            validated_data['status'] = 'pending'
            validated_data['interval'] = 'month'
            validated_data['invoice_sent_on'] = None

        # on activation by admin, send email to user
        if isAdmin(self.context['request'].user):
            validated_data['cancel_at'] = validated_data['current_period_end']
            validated_data['user'].trial = 1
            validated_data['user'].save()
            subject = 'Plan Activated'
            context = {
                'name': '{} {}'.format(validated_data['user'].firstname, validated_data['user'].lastname),
                'data': validated_data,
                'btn_link': '{}/cb/account/login'.format(settings.SITE_URL),
                'btn_label': 'Login Now',
                'is_renewal': False
            }
            temp_name = 'membership_activated.html'
            send_email(subject, context,
                       validated_data['user'].email, temp_name)

        membership = super().create(validated_data)

        if not isAdmin(self.context['request'].user):
            # send membership request to admin
            subject = 'Need Approval: New subscription'
            context = {
                'name': '{} {}'.format(validated_data['user'].firstname, validated_data['user'].lastname),
                'btn_link': '{}/admin/subscribers/{}/edit'.format(settings.SITE_URL, membership.id),
                'btn_label': 'Check Now',
                'data': validated_data,
            }
            temp_name = 'membership_approval_required.html'
            send_email(subject, context, adminEmails(), temp_name)

        return membership

    def update(self, instance, validated_data):
        exception_note = None
        if 'exception_note' in validated_data:
            exception_note = validated_data.pop('exception_note')

        if not isAdmin(self.context['request'].user):
            if 'is_confirmed' in validated_data and validated_data['is_confirmed'] == True and instance.is_confirmed == False:
                subject = 'User Subscription Confirmed'
                context = {
                    'name': '{} {}'.format(instance.user.firstname, instance.user.lastname),
                    'btn_link': '{}/admin/subscribers/{}/edit'.format(settings.SITE_URL, instance.id),
                    'btn_label': 'Check Now',
                    'data': validated_data,
                    'exception_note': exception_note
                }
                temp_name = 'new_strip_subscription.html'
                send_email(subject, context, adminEmails(), temp_name)
            elif instance.is_confirmed == True:
                subject = 'ACTION REQUIRED --> Need Approval: Renewal Subscription'
                context = {
                    'name': '{} {}'.format(instance.user.firstname, instance.user.lastname),
                    'btn_link': '{}/admin/subscribers/{}/edit'.format(settings.SITE_URL, instance.id),
                    'btn_label': 'Check Now',
                    'data': validated_data,
                    'exception_note': None
                }
                temp_name = 'new_strip_subscription.html'
                send_email(subject, context, settings.ADMIN_EMAIL, temp_name)
            else:
                subject = 'ACTION REQUIRED --> Need Approval: New Subscription'
                context = {
                    'name': '{} {}'.format(instance.user.firstname, instance.user.lastname),
                    'btn_link': '{}/admin/subscribers/{}/edit'.format(settings.SITE_URL, instance.id),
                    'btn_label': 'Check Now',
                    'data': validated_data,
                    'exception_note': None
                }
                temp_name = 'new_strip_subscription.html'
                send_email(subject, context, adminEmails(), temp_name)

        elif validated_data['current_period_end'] != instance.current_period_end:

            validated_data['cancel_at'] = validated_data['current_period_end']
            if validated_data['membership'].name == 'Trial':
                validated_data['user'].trial = 1
                validated_data['user'].save()

            subject = 'Plan Activated'
            context = {
                'name': '{} {}'.format(validated_data['user'].firstname, validated_data['user'].lastname),
                'data': validated_data,
                'btn_link': '{}/cb/account/login'.format(settings.SITE_URL),
                'btn_label': 'Login Now',
                'is_renewal': validated_data['is_confirmed']
            }
            temp_name = 'membership_activated.html'
            validated_data['status'] = 'active'
            send_email(subject, context,
                       validated_data['user'].email, temp_name)

        return super().update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(
            PaymentSerializer, self).to_representation(instance)
        related_models = ['membership', 'user']
        for model in related_models:
            try:
                representation[model] = to_dict(getattr(instance, model))
            except:
                representation[model] = None

        return representation

    class Meta:
        model = Subscriptions
        fields = ('id', 'user', 'payment_received_on', 'exception_note', 'membership', 'invoice_sent_on', 'payment_type', 'current_period_start', 'current_period_end', 'is_confirmed',
                  'canceled_by_user', 'cancel_at', 'interval', 'interval_count', 'trial_period', 'status', 'amount_paid', 'total_cost', 'bank_transfer_no', 'amount_due', 'created_at', 'updated_at')
        datatables_always_serialize = (
            'id', 'membership', 'user', 'payment_type')


class MembershipPlanSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    def __init__(self, *args, **kwargs):
        super(MembershipPlanSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = MembershipPlan
        fields = ('id', 'name',)
        datatables_always_serialize = ('id',)
