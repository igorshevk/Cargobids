from django.core.management.base import BaseCommand, CommandError
from profiles.models import Quote
from django.conf import settings


class Command(BaseCommand):

    def handle(self, *args, **options):
        from dateutil.relativedelta import relativedelta
        from datetime import datetime

        current_date = datetime.now()
        publish_date = current_date - relativedelta(days=+ 15)
        Quote.objects.filter(publish__lte=publish_date).update(status='CLOSED')

        self.stdout.write(self.style.SUCCESS('Status updated successfully'))