from django.db import models


# Create your models here.

class MembershipPlan(models.Model):
    name = models.CharField(max_length=50)
    cost_per_month = models.DecimalField(max_digits=6, decimal_places=2)
    cost_per_3_months = models.DecimalField(max_digits=6, decimal_places=2)
    cost_per_6_months = models.DecimalField(max_digits=6, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Subscriptions(models.Model):
    membership = models.ForeignKey(MembershipPlan, on_delete=models.CASCADE)
    user = models.ForeignKey("profiles.Users", on_delete=models.CASCADE)
    subscription_id = models.CharField(max_length=191, null=True, blank=True)
    cancel_at = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(blank=True, null=True)
    current_period_start = models.DateTimeField(blank=True, null=True)
    customer_id = models.CharField(max_length=191, null=True, blank=True)
    # days_until_due = models.IntegerField(null=True, blank=True)
    trial_period = models.IntegerField(default=False)
    status = models.CharField(max_length=20,default='active')
    amount_paid = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    cost_per_month = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    total_cost = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    amount_due = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    canceled_by_user = models.BooleanField(default=False)
    # due_date = models.DateTimeField(null=True, blank=True)
    interval = models.CharField(max_length=191, null=True, blank=True)
    interval_count = models.IntegerField(null=True, blank=True)
    PAYMENT_TYPES = (
        ('Stripe', 'Stripe'),
        ('Bank Transfer', 'Bank Transfer')
    )
    payment_type= models.CharField(max_length= 14, choices= PAYMENT_TYPES, null=True, blank=True)
    payment_received_on = models.DateTimeField(null=True, blank=True)
    invoice_sent_on = models.DateTimeField(null=True, blank=True)
    bank_transfer_no = models.CharField(max_length=191, null=True, blank=True)
    is_confirmed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['created_at']
            
