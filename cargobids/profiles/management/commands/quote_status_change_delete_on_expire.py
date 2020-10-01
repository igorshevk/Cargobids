from datetime import datetime, timedelta

from django.core.management.base import BaseCommand, CommandError
from profiles.models import Quote, Users
from notifications.signals import notify
from django.conf import settings
from common.helper import send_email
from profiles.serializers import QuoteSerializer
from cargobids.settings.base  import pusher_client
import simplejson

"""
    We will basically run this command on schedule.
    We may do this vai unix crontab or django celery, everywhere can be used this.

    About crontab, more details can be found there: https://tecadmin.net/crontab-in-linux-with-20-examples-of-cron-schedule/

    Commands: manage.py quote_status_change_delete_on_expire
"""

class Command(BaseCommand):
    """
         WHEN QUOTE EXPIRY DATE IS PASSED, THE QUOTE SHOULD BE AUTOMATICALLY TURNED TO “CLOSED” STATUS
         - CLOSED QUOTES SHOULD REMAIN VISIBLE IN THE QUOTES LIST FOR 30 DAYS . AFTER THAT THEY SHOULD BE
        AUTOMATICALLY DELETED
        - EXPIRY DATE OF QUOTE: AFTER EXPIRY DATE, THE QUOTE SHOULD BE AUTOMATICALLY TURN TO “CLOSED”
        - after 30 days from expiration, quote and its bids must be automatically DELETED FROM DB.
    """

    def status_closed_on_expire(self):
        today = datetime.today()
        expired_quote = Quote.objects.filter(
            deadline__lte=today
        )


        for quote in expired_quote:

            # send notification to quote author
            if quote.status != 'CLOSED':
                notify.send(quote.author,
                    recipient=quote.author, 
                    verb='Quote Closed', 
                    actor=quote.author,
                    target=quote,
                )

                if quote.author.subscriptions_set.last().membership.name == "Premium":
                    subject = 'Cargobid Notification - Quote Closed'
                    context = {
                        'btn_link': '{}/cb/agent/quotes/{}/view'.format(settings.SITE_URL, quote.slug),
                        'btn_label': 'View Now',
                        'message':"Quote {} has been closed".format(quote.title)
                    }
                    temp_name = 'site_notifications.html'
                    send_email(subject, context, quote.author.email, temp_name) 

                # send notification to all users who bid against that quote
                users = Users.objects.filter(groups__name='Airline', id__in=quote.bids.exclude(status='DELETED').select_related('author').values_list('author__id', flat=True))
                notify.send(quote.author, 
                    recipient=users, 
                    verb='Quote Closed', 
                    actor=quote.author,
                    target=quote,
                )

                # send email notification to permium users
                usersEmail = list(users.filter(subscriptions__membership__name="Premium").values_list('email', flat=True))
                if usersEmail:
                    subject = 'Cargobid Notification - Quote Closed'
                    context = {
                        'btn_link': '{}/cb/agent/quotes/{}/view'.format(settings.SITE_URL, quote.slug),
                        'btn_label': 'View Quote',
                        'message':"Quote {} has been closed".format(quote.title)
                    }
                    temp_name = 'site_notifications.html'
                    send_email(subject, context, usersEmail, temp_name)
            
            quote.status = 'CLOSED'
            quote.save()
            # push this deleted quote to all airline
            msg = {
                "id": quote.id
            }
            msg = simplejson .dumps(msg)
            pusher_client.trigger(f'airlines', f'quote_closed_from_cron_job', {u'message': msg})
            # push this update to airlines that bid on this quote
            quote_id = quote.id
            pusher_client.trigger(f'agent{quote_id}', f'bid{quote_id}', {u'message': u'bid has been deleted'})
            print('Set Closed status')

    def delete_on_expire(self):
        one_month_old = datetime.today()-timedelta(days=30)
        one_month_old_quote = Quote.objects.filter(
            deadline__lte=one_month_old
        )

        for quote in one_month_old_quote:
            quote.delete()
            print('Deleted one month old expired qoute')

    def handle(self, *args, **options):
        self.status_closed_on_expire()
        self.delete_on_expire()
        print('Job finished')