from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin, BaseUserManager, Group, Permission
import uuid
from django.conf import settings
from common.helper import unique_slugify

class UserManager(BaseUserManager):
    """Define a model manager for User model with no username field."""

    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """Create and save a User with the given email and password."""
        if not email:
            raise ValueError('The given email must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        """Create and save a regular User with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        """Create and save a SuperUser with the given email and password."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)


class Users(AbstractUser, PermissionsMixin):
    username = None
    firstname = models.CharField(max_length=25, blank=True, null=True)
    lastname = models.CharField(max_length=25, blank=True, null=True)
    agent_company = models.ForeignKey('Agent',models.SET_NULL, blank=True, null=True)
    airline_company = models.ForeignKey('Airline',models.SET_NULL, blank=True, null=True )
    email = models.CharField(unique=True, max_length=191)
    companyname = models.CharField(max_length=191, blank=True, null=True )
    email_verified = models.IntegerField(default=False)
    is_airline = models.BooleanField(default=False)
    is_agent = models.BooleanField(default=False)
    is_active = models.IntegerField(default=False)
    authcode = models.IntegerField(default=False)
    new_pass_key = models.UUIDField(max_length=36, default=uuid.uuid4, unique=True)
    address = models.CharField(max_length=100, blank=True, null=True)
    address2 = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    zip_code = models.CharField(max_length=100, blank=True, null=True)
    is_superuser = models.BooleanField(null=True, default=False)
    is_staff = models.BooleanField(null=True, default=False)
    remember_token = models.CharField(max_length=100, blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    password = models.CharField(max_length=191)
    new_password = models.IntegerField(default=False)
    trial = models.IntegerField(default=False)
    # end_sub = models.DateTimeField(auto_now=True, blank=True, null=True)
    subscription_id = models.CharField(max_length=191, blank=True, null=True)
    customer_id = models.CharField(max_length=250, blank=True, null=True)
    trial_key = models.UUIDField(max_length=36, blank=True, null=True)
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []


    class Meta:
        managed = True
        db_table = 'Users'
        ordering = ['-updated_at']


class Activations(models.Model):
    user = models.ForeignKey('Users', models.CASCADE)
    key = models.UUIDField(default=uuid.uuid4, unique=True)
    is_active = models.IntegerField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)
    class Meta:
        managed = True
        db_table = 'activations'
        ordering = ['-updated_at']


class Agent(models.Model):
    agent_company_name = models.CharField(max_length=100)
    iata = models.CharField(max_length=11, blank=True, null=True)
    branch = models.CharField(max_length=30, blank=True, null=True)
    address_1 = models.CharField(max_length=191, blank=True, null=True)
    address_2 = models.CharField(max_length=191, blank=True, null=True)
    zip_code = models.CharField(max_length=10, blank=True, null=True)
    city = models.CharField(max_length=80, blank=True, null=True)
    p_iva = models.CharField(max_length=11, blank=True, null=True)
    cf = models.CharField(max_length=16, blank=True, null=True)
    pec = models.EmailField(blank=True, null=True)
    sdi = models.CharField(max_length=7, blank=True, null=True)
    is_active = models.IntegerField(default=False)
    deleted_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'agent'
        ordering = ['-updated_at']

    def __str__(self):
        return self.agent_company_name



class Airline(models.Model):

     CHOICES = (
        ('Airline', 'Airline'),
        ('GSA', 'GSA')
     )
     mode= models.CharField(max_length= 7, choices= CHOICES, default = 'Airline')
     airline_company_name= models.CharField(max_length=100)
     branch=  models.CharField(max_length=30, blank=True, null=True)
     address_1= models.CharField(max_length=50, blank=True, null=True)
     address_2= models.CharField(max_length=50, blank=True, null=True)
     zip_code = models.CharField(max_length=5, blank=True, null=True)
     city= models.CharField(max_length=20, blank=True, null=True)
     p_iva = models.CharField(max_length=11, blank = True, null=True)
     cf= models.CharField(max_length=16,  blank = True, null=True)
     pec = models.EmailField( blank = True, null=True)
     sdi= models.CharField(max_length=7,  blank = True, null=True)
     is_active = models.IntegerField(default=False)
     deleted_at = models.DateTimeField(blank=True, null=True)
     created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
     updated_at = models.DateTimeField(auto_now=True, blank=True, null=True)

     class Meta:
         managed = True
         db_table = 'airline'
         ordering = ['-updated_at']

     def __str__(self):
        return self.airline_company_name


class Quote(models.Model):
 
    STATUS_CHOICES= (
        ('OPEN', "Open"),
        ('CLOSED', "Closed"),
    )


    TYPES= (

        ("AH", 'Spot'),
        ('RT', 'Regular Traffic')
    )

    ORIGIN_CHOICES=(
        ('AOI', 'AOI'),
        ('BLQ', 'BLQ'),
        ('BRI', 'BRI'),
        ('CTA', 'CTA'),
        ('FCO', 'FCO'),
        ('FLR', 'FLR'),
        ('GOA', 'GOA'),
        ('MIL', 'MIL'),
        ('MXP', 'MXP'),
        ('NAP','NAP'),
        ('PSA', 'PSA'),
        ('TRN', 'TRN'),
        ('VCE','VCE'),
        ('VRN','VRN'),
    )


    AREA_CHOICES=(
        ('AF','Africa'),
        ('EU','Europe'),
        ('CA','Central America'),
        ('FE','Far East'),
        ('IN','Indian SC'),
        ('ME','Middle East'),
        ('AU','Oceania'),
        ('NA','North America'),
        ('RU',"Russia & Caspian"),
        ('SA','South America'),
    )


    slug = models.SlugField(blank=True, null=True, unique=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL,
                                null = True, blank = True,related_name='autore')
    viewers = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='quotes_viewed',through='UserViewedQuote')

    types= models.CharField(max_length=20, choices = TYPES, default= 'AH')
    title = models.CharField(max_length=120)
    origin = models.CharField(max_length=20, choices= ORIGIN_CHOICES, blank=False)
    destination = models.CharField(max_length=3)
    area = models.CharField(max_length=20, choices= AREA_CHOICES,blank=False)
    pieces = models.IntegerField(blank=False)
    kilos = models.DecimalField(max_digits= 7, decimal_places=2,blank=False)
    volume = models.DecimalField(max_digits=5, decimal_places=2)
    gencargo = models.BooleanField(default = True)
    dgr = models.BooleanField(default = False)
    perishable = models.BooleanField(default = False)
    stackable = models.BooleanField(default = True)
    tiltable = models.BooleanField(default = False)
    special_cargo = models.BooleanField(default = False)
    rfc = models.DateField(null = True, blank = True)#ready for carriage
    deadline =models.DateField(auto_now=False, auto_now_add=False, blank= True, null= True)
    note = models.TextField(max_length=220,blank= True)
    publish = models.DateField(auto_now=False, auto_now_add=False, blank= True, null= True)
    updated = models.DateTimeField(auto_now=False, auto_now_add= True)
    status= models.CharField(max_length=6, choices = STATUS_CHOICES, default='OPEN')
    views_count = models.IntegerField(default= 0)
    weight = models.DecimalField(max_digits=8, decimal_places =2,null = True, blank = True, default = 0)
    dimensions = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now=True, auto_now_add=False)

    def save(self, *args, **kwargs):
        value = self.title
        unique_slugify(self, value)
        self.destination = self.destination.upper()
        super().save(*args, **kwargs)

    class Meta:
         db_table = 'quotes'
         ordering = ['-updated']


class Bid(models.Model):
 
    STATUS= (
        ( 'ALLIN','ALLIN'),
        ( 'SC','SURCHARGES')
        )

    WHEN= (
        ('ANY', 'Qualsiasi Volo'),
        ('SF', 'Volo Specifico',),
        ('SP', 'Periodo Limitato',),
        ('LP', 'Periodo Specifico', ),
        ('SD', 'Data Specifica', ),
       
        )

    ORIGIN_CHOICES=(
        ('AOI', 'AOI'),
        ('BLQ', 'BLQ'),
        ('BRI', 'BRI'),
        ('CTA', 'CTA'),
        ('FLR', 'FLR'),
        ('FCO', 'FCO'),
        ('MIL', 'MIL'),
        ('MXP', 'MXP'),
        ('FLR', 'FLR'),
        ('TRN', 'TRN'),
        ('GOA', 'GOA'),
        ('PSA', 'PSA'),
        ('Other', "Other"),
        ('EXW', "Ex works")

    )
    STATUS_CHOICES= (
        ('OPEN', "OPEN"),
        ('DELETED', "DELETED"),
    )

    quote = models.ForeignKey(Quote, on_delete = models.DO_NOTHING, related_name='bids')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                null = True, blank = True,related_name='airline_staff')
    carrier = models.CharField(max_length = 2, null = False, blank = False)
    rate = models.DecimalField(max_digits = 4, decimal_places= 2, null = False, blank = False)
    all_in = models.CharField(max_length= 5, choices= STATUS,default= 'ALLIN')
    surcharges = models.DecimalField(max_digits=4, decimal_places =2,null = True, blank = True, default = 0.00)
    cw_required = models.DecimalField(max_digits=8, decimal_places =2,null = True, blank = True, default = 0)
    origin = models.CharField(max_length=5, choices =ORIGIN_CHOICES )
    conditions = models.CharField(max_length=6, choices = WHEN, default ='ANY',null = False, blank = False)
    remarks = models.TextField(max_length = 12,null = True, blank = True)
    status = models.CharField(max_length=7, choices = STATUS_CHOICES, default='OPEN')
    publish = models.DateField(blank= True, null= True)
    timestamp = models.DateTimeField(auto_now=False, auto_now_add=True)

    def save(self, *args, **kwargs):
        self.carrier = self.carrier.upper()
        super().save(*args, **kwargs)

    class Meta:
         db_table = 'bids'

# ************************** Q&A SECTION *******************
class Question(models.Model):
    quote = models.ForeignKey(Quote, on_delete = models.DO_NOTHING, related_name='questions')
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
                                related_name='question_owner')
    content = models.CharField(max_length=200)
    replay = models.CharField(max_length=200,blank=True, null=True)
    visible = models.BooleanField(default = False)
    created_at = models.DateTimeField(auto_now_add=True,blank=True, null=True)
    publish_at = models.DateTimeField(blank=True, null=True)
    deleted_at = models.DateTimeField(blank=True, null=True)

    class Meta:
         db_table = 'questions'


class UserViewedQuote(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, models.CASCADE)
    quote = models.ForeignKey(Quote, models.CASCADE)
        
    class Meta:
         db_table = 'user_viewed_quotes'