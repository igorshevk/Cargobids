from django.core.management.base import BaseCommand, CommandError
from profiles.models import Users,Activations,Agent
from django.conf import settings
from common.helper import send_email


class Command(BaseCommand):

    def handle(self, *args, **options):
        from dateutil.relativedelta import relativedelta
        from datetime import datetime

        current_date = datetime.now()
        final_date = current_date + relativedelta(days=+ 7)
        users = Users.objects.filter(end_sub__date=final_date)
        url = settings.SITE_URL
        subject = 'Your Subscriptions will expire soon'
        temp_name = 'subscriptions_notifications.html'
        for user in users:
            context = {'name': user.firstname if user.firstname else '',
                       'content': 'Your Subscriptions will expire on ' + str(final_date), 'url': url}
            send_email(subject, context, user.email, temp_name)
        self.stdout.write(self.style.SUCCESS('Notifications sent successfully'))
