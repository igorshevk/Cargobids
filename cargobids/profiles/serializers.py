from rest_framework import serializers
from profiles.models import Users, Activations, Airline, Agent, Agent, Quote, Bid, Question
from django.contrib.auth.models import Group, Permission
from django.contrib.auth.hashers import make_password
from rest_framework.validators import UniqueValidator
from rest_framework.response import Response
# from profiles.views import send_emails
import datetime
import uuid
from django.db.models import Q, F
from django.contrib.auth.validators import UnicodeUsernameValidator

from rest_framework.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_404_NOT_FOUND,
    HTTP_200_OK,
    HTTP_204_NO_CONTENT
)

from django.conf import settings
from common.helper import *
from django.contrib.contenttypes.models import ContentType
from notifications.signals import notify


class PermissionSerializer(serializers.ModelSerializer):
    name = serializers.CharField(validators=[UniqueValidator(
        queryset=Permission.objects.all())], max_length=150)

    def __init__(self, *args, **kwargs):
        super(PermissionSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = Permission
        fields = ('id', 'name')


class ContentTypeSerializer(serializers.ModelSerializer):
    permission_set = PermissionSerializer(many=True)

    def __init__(self, *args, **kwargs):
        super(ContentTypeSerializer, self).__init__(*args, **kwargs)

    class Meta:
        model = ContentType
        fields = ('id', 'model', 'permission_set')


class GroupSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)
    name = serializers.CharField(validators=[UniqueValidator(
        queryset=Group.objects.all())], max_length=150)
    permissions = serializers.PrimaryKeyRelatedField(
        many=True, required=False, queryset=Permission.objects.all())

    def __init__(self, *args, **kwargs):
        super(GroupSerializer, self).__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        if 'permissions' in validated_data:
            permissions = validated_data.pop('permissions')
            instance.permissions.set(permissions)
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        return instance

    class Meta:
        model = Group
        fields = ('id', 'name', 'permissions')


class UsersSerializer(serializers.ModelSerializer):  # used to get user profile

    password = serializers.CharField(write_only=True, required=True, )
    groups = serializers.PrimaryKeyRelatedField(many=True, read_only=False, required=False,
                                                queryset=Group.objects.all())
    user_permissions = serializers.PrimaryKeyRelatedField(
        many=True, read_only=False, queryset=Permission.objects.all())
    id = serializers.IntegerField(read_only=True)
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=Users.objects.all())])

    def __init__(self, *args, **kwargs):
        super(UsersSerializer, self).__init__(*args, **kwargs)

    def create(self, validated_data):
        validated_data['password'] = make_password(
            validated_data.get('password'))
        permissions = validated_data.pop('user_permissions')
        groups = validated_data.pop('groups')
        user = Users.objects.create(**validated_data)
        user.groups.set(groups)
        user.user_permissions.set(permissions)
        return user

    def update(self, instance, validated_data):

        if 'groups' in validated_data:
            groups = validated_data.pop('groups')
            instance.groups.clear()
            instance.groups.add(*groups)

        instance.email = validated_data.get('email', instance.email)
        instance.firstname = validated_data.get(
            'firstname', instance.firstname)
        instance.lastname = validated_data.get('lastname', instance.lastname)
        instance.agent_company = validated_data.get(
            'agent_company', instance.agent_company)
        instance.airline_company = validated_data.get(
            'airline_company', instance.airline_company)
        instance.is_airline = validated_data.get(
            'is_airline', instance.is_airline)
        instance.is_agent = validated_data.get('is_agent', instance.is_agent)
        instance.is_superuser = validated_data.get(
            'is_superuser', instance.is_superuser)
        # User Address
        instance.address = validated_data.get('address', instance.address)
        instance.address2 = validated_data.get('address2', instance.address2)
        instance.city = validated_data.get('city', instance.city)
        instance.zip_code = validated_data.get('zip_code', instance.zip_code)
        # End of User Address

        # check if user has been activated send email
        if instance.is_active == 0 and validated_data.get('is_active', 0) == 1:
            # check if trial not avail then create trial key
            trial_key = None
            url = settings.SITE_URL
            if instance.trial != 1:
                instance.trial_key = str(uuid.uuid4())
                url = '{}/cb/landing/trial/{}'.format(url, instance.trial_key)

            subject = 'Welcome to Cargobids!'
            context = {
                'name': '{} {}'.format(instance.firstname, instance.lastname),
                # 'content': 'Congratulations! Your account has been activated. ',
                'btn_label': 'Request Free Trial',
                'url': url
            }
            temp_name = 'account_activated.html'
            send_email(subject, context, instance.email, temp_name)

        instance.is_active = validated_data.get(
            'is_active', instance.is_active)
        new_password = validated_data.get('password', None)
        if new_password is not None:
            instance.password = make_password(new_password)
        instance.save()
        return instance

    def to_representation(self, instance):
        representation = super(
            UsersSerializer, self).to_representation(instance)
        try:
            representation['fullname'] = instance.firstname + \
                ' ' + instance.lastname
        except:
            representation['fullname'] = None

        try:
            representation['airline_company'] = AirlineSerializer(
                instance.airline_company).data
        except:
            representation['airline_company'] = None

        try:
            representation['agent_company'] = AgentSerializer(
                instance.agent_company).data
        except:
            representation['agent_company'] = None

        representation['created_at'] = instance.created_at.date()
        return representation

    class Meta:
        model = Users
        fields = (
            'id', 'firstname', 'lastname', 'email', 'email_verified', 'is_airline', 'is_agent', 'is_active', 'trial', 'is_superuser',
            'remember_token', 'groups', 'user_permissions', 'is_staff', 'password', 'agent_company', 'airline_company',
            'deleted_at', 'created_at', 'updated_at', 'new_password', 'address', 'address2', 'city', 'zip_code')
        datatables_always_serialize = (
            'id', 'created_at', 'agent_company', 'airline_company', 'groups')


class AirlineSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    def __init__(self, *args, **kwargs):
        super(AirlineSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            users = Users.objects.filter(airline_company=data['id']).values()
            username = []
            for user in users:
                name = str(user['firstname']) + " " + str(user['lastname'])
                username.append(
                    {'id': user['id'], 'name': name, 'email': user['email'], 'is_active': user['is_active']})
            data['user'] = username
        except:
            data['user'] = None
        return data

    class Meta:
        model = Airline
        fields = ('id', 'mode', 'airline_company_name', 'branch', 'address_1', 'address_2', 'zip_code', 'city',
                  'p_iva', 'cf', 'pec', 'sdi', 'is_active', 'deleted_at', 'created_at', 'updated_at')
        datatables_always_serialize = ('id',)


class AgentSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    def __init__(self, *args, **kwargs):
        super(AgentSerializer, self).__init__(*args, **kwargs)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        try:
            users = Users.objects.filter(agent_company=data['id']).values()
            username = []
            for user in users:
                name = str(user['firstname']) + " " + str(user['lastname'])
                username.append(
                    {'id': user['id'], 'name': name, 'email': user['email'], 'is_active': user['is_active']})
            data['user'] = username
        except:
            data['user'] = None
        return data

    class Meta:
        model = Agent
        fields = ('id', 'agent_company_name', 'iata', 'branch', 'address_1', 'address_2', 'zip_code', 'city',
                  'p_iva', 'cf', 'pec', 'sdi', 'is_active', 'deleted_at', 'created_at', 'updated_at')
        datatables_always_serialize = ('id',)


class QuoteSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    def __init__(self, *args, **kwargs):
        super(QuoteSerializer, self).__init__(*args, **kwargs)
        self.fields['is_publish'] = serializers.BooleanField(default=False)
        self.fields['updateCount'] = serializers.BooleanField(default=False)

    def create(self, validated_data):
        if 'is_publish' in validated_data:
            is_publish = validated_data.pop('is_publish')
        if 'updateCount' in validated_data:
            validated_data.pop('updateCount')

        deadline = validated_data['deadline']
        max_deadline = datetime.date.today() + datetime.timedelta(days=15)
        # deadline max 15 days allow, not more than that
        if deadline > max_deadline:
            validated_data['deadline'] = max_deadline

        validated_data['author'] = self.context['request'].user
        return super(QuoteSerializer, self).create(validated_data)

    def update(self, instance, validated_data):
        if 'is_publish' in validated_data:
            is_publish = validated_data.pop('is_publish')
            if is_publish and instance.publish is None:
                validated_data['publish'] = datetime.date.today()

        if 'updateCount' in validated_data:
            updateCount = validated_data.pop('updateCount')
            if updateCount:
                validated_data['views_count'] = instance.views_count + 1

                # also update user viewed
                if isAirline(self.context['request'].user):
                    instance.viewers.set([self.context['request'].user])

        if self.context['request'].method != 'PATCH':
            deadline = validated_data['deadline']
            max_deadline = datetime.date.today() + datetime.timedelta(days=15)
            # deadline max 15 days allow, not more than that
            if deadline > max_deadline:
                validated_data['deadline'] = max_deadline

            validated_data['author'] = self.context['request'].user

        if self.context['request'].method == 'PUT':
            if validated_data['status'] == 'CLOSED' and instance.status != 'CLOSED':
                users = Users.objects.filter(groups__name='Airline', id__in=instance.bids.select_related(
                    'author').values_list('author__id', flat=True))
                notify.send(self.context['request'].user,
                            recipient=users,
                            verb='Quote Closed',
                            actor=validated_data['author'],
                            target=instance,
                            )

                # send email notification to permium users
                usersEmail = list(users.filter(
                    subscriptions__membership__name="Premium").values_list('email', flat=True))
                if usersEmail:
                    subject = 'Cargobid Notification - Quote Closed'
                    context = {
                        'btn_link': '{}/cb/agent/quotes/{}/view'.format(settings.SITE_URL, instance.slug),
                        'btn_label': 'View Quote',
                        'message': "Quote {} has been closed".format(instance.title)
                    }
                    temp_name = 'site_notifications.html'
                    send_email(subject, context, usersEmail, temp_name)

        return super(QuoteSerializer, self).update(instance, validated_data)

    def to_representation(self, instance):
        representation = super(
            QuoteSerializer, self).to_representation(instance)
        representation['weight_'] = instance.weight
        representation['dimension_result'] = calculateDimensions(instance)
        representation['bid'] = False
        representation['total_bids'] = instance.bids.exclude(
            status='DELETED').count()
        representation['user_bids'] = 0
        if isAirline(self.context['request'].user):
            representation['is_viewed'] = instance.viewers.filter(
                id=self.context['request'].user.id).exists()
            bid = instance.bids.filter(
                author=self.context['request'].user).exclude(status='DELETED')
            representation['ranked'] = None
            if bid.exists():
                representation['user_bids'] = bid.count()
                representation['bid'] = to_dict(bid.annotate(
                    rank=(F('rate') + F('surcharges')) * F('cw_required')).order_by('rank').first())
                representation['ranked'] = list(instance.bids.exclude(status='DELETED').annotate(rank=(
                    F('rate') + F('surcharges')) * F('cw_required')).order_by('rank').values_list('id', flat=True)).index(representation['bid']['id']) + 1
        return representation

    class Meta:
        model = Quote
        fields = ('id', 'slug', 'author', 'types', 'title', 'origin', 'destination', 'area', 'pieces',
                  'kilos', 'volume', 'gencargo', 'dgr', 'perishable', 'stackable', 'tiltable', 'rfc', 'deadline',
                  'note', 'publish', 'updated', 'status', 'views_count', 'timestamp', 'dimensions', 'special_cargo', 'weight')
        datatables_always_serialize = ('id', 'title', 'slug')


class BidSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)

    def __init__(self, *args, **kwargs):
        super(BidSerializer, self).__init__(*args, **kwargs)
        self.fields['is_publish'] = serializers.BooleanField(default=False)
        self.fields['allow_same_company'] = serializers.BooleanField(
            default=False)

    def create(self, validated_data):
        if 'is_publish' in validated_data:
            is_publish = validated_data.pop('is_publish')
        if 'allow_same_company' in validated_data:
            allow_same_company = validated_data.pop('allow_same_company')

        # check if the bid exist against same company and quote

        user = self.context['request'].user
        if not allow_same_company:
            domain = (user.email).split('@')[1]
            if validated_data['quote'].bids.filter(author__email__icontains=domain).exclude(author=user).exists():
                raise serializers.ValidationError({'Warning': [
                                                  'User {} from your company {} has already bid for this quote. Do you want to publish your bid anyway?'.format(user.firstname, domain), ]})
        # check max allows bids against quote
        if validated_data['quote'].bids.exclude(status='DELETED').count() >= 10:
            raise serializers.ValidationError({'Limit Reached': [
                                              'You cannot bid at the moment as this quote already reached max allowed 10 bids']})

        # check max allows bids against quote and user
        if validated_data['quote'].bids.filter(author=user).exclude(status='DELETED').count() >= 1:
            raise serializers.ValidationError(
                {'Limit Reached': ['You already make enough bids for this quote']})

        validated_data['author'] = self.context['request'].user

        bidInstance = super(BidSerializer, self).create(validated_data)

        # send notification to quote author
        notify.send(self.context['request'].user,
                    recipient=bidInstance.quote.author,
                    verb='New Bid',
                    actor=bidInstance.author,
                    target=bidInstance,
                    )

        # send email notification if quote author is perimum user
        if bidInstance.quote.author.subscriptions_set.last().membership.name == "Premium":
            subject = 'Cargobid Notification - New Bid'
            context = {
                'btn_link': '{}/cb/agent/quotes/{}/bids/{}/detail/'.format(settings.SITE_URL, bidInstance.quote.slug, bidInstance.id),
                'btn_label': 'View Bid',
                'message': "New bid has been received against quote {}".format(bidInstance.quote.title)
            }
            temp_name = 'site_notifications.html'
            send_email(subject, context,
                       bidInstance.quote.author.email, temp_name)

        newBidRanking = bidInstance.quote.bids.exclude(status='DELETED').annotate(
            rank=(F('rate') + F('surcharges')) * F('cw_required')).order_by('rank')

        bidsRankChange = False
        bidsAuthorIds = []
        for bidrank in newBidRanking:
            if bidrank.id == bidInstance.id:
                bidsRankChange = True

            if bidsRankChange:
                bidsAuthorIds.append(bidrank.author.id)

        # send notification to other users whose bid ranking effected
        users = Users.objects.filter(id__in=bidsAuthorIds)
        notify.send(self.context['request'].user,
                    recipient=users,
                    verb='Rank Changed',
                    actor=bidInstance.author,
                    target=bidInstance.quote,
                    )

        # send email notification to permium users
        usersEmail = list(users.filter(
            subscriptions__membership__name="Premium").values_list('email', flat=True))
        if usersEmail:
            subject = 'Cargobid Notification - Rank Changed'
            context = {
                'btn_link': '{}/cb/agent/quotes/{}/view'.format(settings.SITE_URL, bidInstance.quote.slug),
                'btn_label': 'View Now',
                'message': "La posizione della tua quotazione relativa all'Inserzione '{}'  è cambiata".format(bidInstance.quote.title)
            }
            temp_name = 'site_notifications.html'
            send_email(subject, context, usersEmail, temp_name)

        return bidInstance

    def update(self, instance, validated_data):
        if 'allow_same_company' in validated_data:
            validated_data.pop('allow_same_company')

        if 'is_publish' in validated_data:
            is_publish = validated_data.pop('is_publish')
            if is_publish and instance.publish is None:
                validated_data['publish'] = datetime.date.today()
        if 'rate' in validated_data:
            if instance.rate < validated_data['rate']:
                raise serializers.ValidationError(
                    {'Rate': ['Non è possibile offrire una tariffa più alta di quella precedentemente quotata', ]})

        if self.context['request'].method != 'PATCH':
            # send notification to quote author
            notify.send(self.context['request'].user,
                        recipient=instance.quote.author,
                        verb='Bid Updated',
                        actor=instance.author,
                        target=instance,
                        )

            # send email notification if quote author is perimum user
            if instance.quote.author.subscriptions_set.last().membership.name == "Premium":
                subject = 'Cargobid Notification - Bid Updated'
                context = {
                    'btn_link': '{}/cb/agent/quotes/{}/bids/{}/detail/'.format(settings.SITE_URL, instance.quote.slug, instance.id),
                    'btn_label': 'View Bid',
                    'message': "Una quotazione relativa all'inserzione '{}' è stata aggiornata dall'utente".format(instance.quote.title)
                }
                temp_name = 'site_notifications.html'
                send_email(subject, context,
                           instance.quote.author.email, temp_name)
        else:
            if 'status' in validated_data and validated_data['status'] == 'DELETED' and instance.status != 'DELETED':
                # check if already cancel a bid
                if instance.quote.bids.filter(author=self.context['request'].user).count() > 2:
                    raise serializers.ValidationError('Operation unauthorized')
                else:
                    # send notification to quote author
                    notify.send(self.context['request'].user,
                                recipient=instance.quote.author,
                                verb='Bid Cancelled',
                                actor=instance.author,
                                target=instance,
                                )

            # send email notification if quote author is perimum user
            if instance.quote.author.subscriptions_set.last().membership.name == "Premium":
                subject = 'Cargobid Notification - Bid Cancelled'
                context = {
                    'btn_link': '{}/cb/agent/quotes/{}/view'.format(settings.SITE_URL, instance.quote.slug),
                    'btn_label': 'View Now',
                    'message': "Una quotazione relativa all'inserzione '{}' è stata cancellata dall'utente offerente".format(instance.quote.title)
                }
                temp_name = 'site_notifications.html'
                send_email(subject, context,
                           instance.quote.author.email, temp_name)

        oldBidRank = list(instance.quote.bids.exclude(status='DELETED').annotate(rank=(
            F('rate') + F('surcharges')) * F('cw_required')).order_by('rank').values_list('id', flat=True)).index(instance.id) + 1

        bidInstance = super(BidSerializer, self).update(
            instance, validated_data)

        newBidRanking = bidInstance.quote.bids.exclude(status='DELETED').annotate(
            rank=(F('rate') + F('surcharges')) * F('cw_required')).order_by('rank')

        print('newbidranding', newBidRanking)
        print('ID', bidInstance.id)
        rankChanged = False
        if bidInstance.status != 'DELETED':
            newBidRank = list(newBidRanking.values_list(
                'id', flat=True)).index(bidInstance.id) + 1
            rankChanged = newBidRank < oldBidRank
        else:
            if 'status' in validated_data and validated_data['status'] == 'DELETED' and instance.status != 'DELETED':
                rankChanged = True

        if rankChanged:

            bidsRankChange = False
            bidsAuthorIds = []
            for bidrank in newBidRanking:
                if bidrank.id == bidInstance.id:
                    bidsRankChange = True

                if bidsRankChange:
                    bidsAuthorIds.append(bidrank.author.id)

            # send notification to other users whose bid ranking effected
            users = Users.objects.filter(id__in=bidsAuthorIds)
            notify.send(self.context['request'].user,
                        recipient=users,
                        verb='Rank Changed',
                        actor=bidInstance.author,
                        target=bidInstance.quote,
                        )

            # send email notification to permium users
            usersEmail = list(users.filter(
                subscriptions__membership__name="Premium").values_list('email', flat=True))
            if usersEmail:
                subject = 'Cargobid Notification - Rank Changed'
                context = {
                    'btn_link': '{}/cb/agent/quotes/{}/view'.format(settings.SITE_URL, bidInstance.quote.slug),
                    'btn_label': 'View Now',
                    'message': "La posizione della tua quotazione relativa all'Inserzione '{}'  è cambiata".format(bidInstance.quote.title)
                }
                temp_name = 'site_notifications.html'
                send_email(subject, context, usersEmail, temp_name)

        return bidInstance

    def to_representation(self, instance):
        representation = super(BidSerializer, self).to_representation(instance)
        related_modes = ['author']
        for model in related_modes:
            try:
                representation[model] = to_dict(getattr(instance, model))
            except:
                representation[model] = None
        try:
            representation['rank'] = list(instance.quote.bids.annotate(rank=(F('rate') + F('surcharges')) * F(
                'cw_required')).order_by('rank').values_list('id', flat=True)).index(instance.id) + 1
        except:
            representation['rank'] = None
        representation['quote_slug'] = instance.quote.slug
        return representation

    class Meta:
        model = Bid
        fields = ('id', 'quote', 'publish', 'author', 'status', 'carrier', 'rate', 'all_in',
                  'surcharges', 'cw_required', 'origin', 'conditions', 'remarks', 'timestamp')
        datatables_always_serialize = ('id',)

# ************************** Q&A SECTION *******************


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ("quote", "author", "content", "replay", "visible",
                  "created_at", "publish_at", "deleted_at")
        read_only_fields = ["author"]

    def create(self, validated_data):
        question = Question.objects.create(
            **validated_data,
            author=self.context["request"].user
        )
        question.save()
        return question

    def validate(self, data):
        # verify if this is an airline user
        # only airline users can create questions
        user = self.context["request"].user
        is_airline = False
        for group in user.groups.all():
            # if the user is an airline user
            if group.id == 3:
                is_airline = True
        if is_airline == False:
            raise serializers.ValidationError("this user is not airline")
        return data


class VirificationQuestion(serializers.Serializer):
    question_id = serializers.CharField(required=True,)

    def validate(self, data):
        # verify if this is an agent user
        # only agents users can reply to questions
        user = self.context["request"].user
        if not user.groups.filter(name="Agent").exists():
            raise serializers.ValidationError("this user is not agent")
        return data


class QuoteQuestion(serializers.Serializer):
    quote_id = serializers.CharField(required=True,)

    def validate(self, data):
        return data


class PublishQuestionSer(serializers.Serializer):
    replay = serializers.CharField(required=True,)

    def validate(self, data):
        # verify if this is an agent user
        # only agents users can reply to questions
        user = self.context["request"].user
        is_agent = False
        for group in user.groups.all():
            # if the user is an airline user
            if group.id == 2:
                is_agent = True
        if is_agent == False:
            raise serializers.ValidationError("this user is not agent")
        return data


class GenericNotificationRelatedField(serializers.RelatedField):

    def to_representation(self, value):
        target = to_dict(value)
        if isinstance(value, Bid):
            target['quote'] = to_dict(value.quote)

        return target


class NotificationSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    unread = serializers.BooleanField(read_only=True)
    target = GenericNotificationRelatedField(read_only=True)
    verb = serializers.CharField(read_only=True)
    timestamp = serializers.DateTimeField(read_only=True)
