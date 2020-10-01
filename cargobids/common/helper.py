from itertools import chain

def isAgent(user):
	return user.groups.filter(name='Agent').exists()

def isAirline(user):
	return user.groups.filter(name='Airline').exists()

def isAdmin(user):
	return user.groups.filter(name='Admin').exists()

def send_email(subject,context,to,temp_name):
	if type(to) is not list:
		to = [to]

	from django.template.loader import get_template
	from django.core.mail import EmailMultiAlternatives
	html_content = get_template('email/'+temp_name).render(context)
	msg = EmailMultiAlternatives(subject, '', 'support@cargobids.com', to)
	msg.attach_alternative(html_content, "text/html")
	try:
		msg.send()
		return True
	except:
		return False

def to_dict(instance):
	opts = instance._meta
	data = {}
	for f in chain(opts.concrete_fields, opts.private_fields):
		data[f.name] = f.value_from_object(instance)
	for f in opts.many_to_many:
		data[f.name] = [i.id for i in f.value_from_object(instance)]
	return data

def findRank(bids):
	bidRanks = {}
	for bid in bids:
		bidRanks

def getAirportName(code):
	import csv
	airport = code
	with open('./airports.csv', encoding="utf8") as f:
		reader = csv.reader(f, skipinitialspace=True)
		header = next(reader)
		for row in reader:
			if code.upper() == row[4]:
				airport = '{}({}), {}, {}'.format(row[1], row[4], row[2], row[3])
				return airport
	return airport

def calculateDimensions(quote):
	import json
	dimensions = json.loads(quote.dimensions)

	net_volume = 0
	total_pieces = 0

	for dimension in dimensions:
		net_volume += float(dimension['cbm'])
		total_pieces += int(dimension['colli'])

	chargeable = net_volume / 6000
	weight = int(quote.kilos)
	if chargeable < quote.kilos:
		chargeable = quote.kilos

	return {
		"chargeable_weight" : round(int(chargeable), 2),
		"net_volume" : round(net_volume / 1000000, 2),
		"total_pieces" : total_pieces
	}

def unique_slugify(instance, value, slug_field_name='slug', queryset=None,
				   slug_separator='-'):
	"""
	Calculates and stores a unique slug of ``value`` for an instance.

	``slug_field_name`` should be a string matching the name of the field to
	store the slug in (and the field to check against for uniqueness).

	``queryset`` usually doesn't need to be explicitly provided - it'll default
	to using the ``.all()`` queryset from the model's default manager.
	"""
	import re
	from django.template.defaultfilters import slugify
	slug_field = instance._meta.get_field(slug_field_name)

	slug = getattr(instance, slug_field.attname)
	slug_len = slug_field.max_length

	# Sort out the initial slug, limiting its length if necessary.
	slug = slugify(value)
	if slug_len:
		slug = slug[:slug_len]
	slug = _slug_strip(slug, slug_separator)
	original_slug = slug

	# Create the queryset if one wasn't explicitly provided and exclude the
	# current instance from the queryset.
	if queryset is None:
		queryset = instance.__class__._default_manager.all()
	if instance.pk:
		queryset = queryset.exclude(pk=instance.pk)

	# Find a unique slug. If one matches, at '-2' to the end and try again
	# (then '-3', etc).
	next = 2
	while not slug or queryset.filter(**{slug_field_name: slug}):
		slug = original_slug
		end = '%s%s' % (slug_separator, next)
		if slug_len and len(slug) + len(end) > slug_len:
			slug = slug[:slug_len-len(end)]
			slug = _slug_strip(slug, slug_separator)
		slug = '%s%s' % (slug, end)
		next += 1

	setattr(instance, slug_field.attname, slug)

def _slug_strip(value, separator='-'):
    """
    Cleans up a slug by removing slug separator characters that occur at the
    beginning or end of a slug.

    If an alternate separator is used, it will also replace any instances of
    the default '-' separator with the new separator.
    """
    import re
    separator = separator or ''
    if separator == '-' or not separator:
        re_sep = '-'
    else:
        re_sep = '(?:-|%s)' % re.escape(separator)
    # Remove multiple instances and if an alternate separator is provided,
    # replace the default '-' separator.
    if separator != re_sep:
        value = re.sub('%s+' % re_sep, separator, value)
    # Remove separator from the beginning and end of the slug.
    if separator:
        if separator != '-':
            re_sep = re.escape(separator)
        value = re.sub(r'^%s+|%s+$' % (re_sep, re_sep), '', value)
    return value


def adminEmails():
	from profiles.models import Users
	return list(Users.objects.filter(groups__name="Admin").values_list('email', flat=True))