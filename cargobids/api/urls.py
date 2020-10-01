from rest_framework.urlpatterns import format_suffix_patterns
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf.urls import url

from profiles import views as users_view
from memberships import views as sub_views
from airports import views as airport_view
import notifications.urls


router = DefaultRouter()


questions_list = users_view.QuestionViewSet.as_view({
    'get':'list',
    'post':'create'
})
questions_detail = users_view.QuestionViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
questions_virify = users_view.VirificationQuestionView.as_view()
questions_quote = users_view.QuoteQuestionView.as_view()
publish_question = users_view.PublishQuestionView.as_view()
discard_question = users_view.DiscardQuestionView.as_view()
get_quote_questions = users_view.GetQuoteQuestionsView.as_view()


# test commit
u_list = users_view.UserViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
user_detail = users_view.UserViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

groups_list = users_view.GroupsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
groups_detail = users_view.GroupsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

permissions_list = users_view.PermissionsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
permissions_detail = users_view.PermissionsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

airlines_list = users_view.AirlinesViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
airlines_detail = users_view.AirlinesViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})
agents_list = users_view.AgentsViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
agents_detail = users_view.AgentsViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

payment_list = sub_views.PaymentViewSet.as_view({
    'get': 'list',
    'post': 'create'
})
payment_detail = sub_views.PaymentViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

quotes_list = users_view.QuoteViewSet.as_view({
    'get':'list',
    'post':'create'
})

quotes_detail = users_view.QuoteViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})

quotes_summary = users_view.QuoteViewSet.as_view({
    'get':'retrieve',
    'post':'create'
})


bids_list = users_view.BidViewSet.as_view({
    'get':'list',
    'post':'create'
})

bids_detail = users_view.BidViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


plan_list = sub_views.MembershipPlanViewSet.as_view({
    'get':'list',
    'post':'create'
})

plan_detail = sub_views.MembershipPlanViewSet.as_view({
    'get': 'retrieve',
    'put': 'update',
    'patch': 'partial_update',
    'delete': 'destroy'
})


# The API URLs are now determined automatically by the router.
urlpatterns = format_suffix_patterns([
    path('', users_view.api_root),

    path('users', u_list, name='users'),
    path('users/<pk>/', user_detail),


    path('subscriptions', payment_list, name='subscriptions'),
    path('subscriptions/<pk>/', payment_detail),

    path('plans', plan_list, name='plans'),
    path('plans/<pk>/', plan_detail),

    #path('paymentDetails', sub_views.subscriptions), # For one time payment
    path('paymentDetails', sub_views.paymentDetails), # recurring
    path('cancelsubscriptions', sub_views.cancelsubscriptions),
    path('allplans', sub_views.allplans),
    path('customer', sub_views.customer),


    path('groups', groups_list, name='groups'),
    path('groups/<pk>/', groups_detail),

    path('permissions', permissions_list, name='permissions'),
    path('permissions/<pk>/', permissions_detail),

    path('airlines', airlines_list, name='airlines'),
    path('airlines/<pk>/', airlines_detail),

    path('agents', agents_list, name='agents'),
    path('agents/<pk>/', agents_detail),

    path('quotes', quotes_list, name='quotes'),
    # path('quotes/<pk>/', quotes_detail),
    path('quotes/<slug>/', quotes_detail),

    # path('airports', quotes_detail),
    path('airports', airport_view.airport_data, name='airports'),
    path('airports/<code>/', airport_view.airports_filter_code),

    path('bids', bids_list, name='bids'),
    path('bids/<pk>/', bids_detail),
    path('bids/<pk>/sm/', users_view.bids_summary),

    path('companies', users_view.get_companies, name='companies'),


    # *************************** Carriers ****************
    path('carriers/<code>/', users_view.getCarrier),


    # *************************** Q$A SECTION ****************
    path('questions', questions_list, name='questions'),
    path('questions/<pk>/', questions_detail),
    path('virificationquestion',questions_virify,name='virificationquestion'),
    path('questionsquote',questions_quote,name='questionsquote'),
    path('publish_question/<int:id>/',publish_question ,name='publish_question'),
    path('discard_question/<int:id>/',discard_question ,name='discard_question'),
    path('get_quote_questions/<str:slug>/',get_quote_questions ,name='get_quote_questions'),


    # *************************** Notifications ****************
    # url('^inbox/notifications/', include(notifications.urls, namespace='notifications')),
    path('notifications/mark_all_as_read',users_view.notifications_mark_as_read ,name='notifications_mark_as_read'),
    path('notifications/<pk>/delete',users_view.delete_notification ,name='delete_notification'),

    # Count Related API views
    path('qoute-bid-count/', users_view.QouteBidCountView.as_view(), name='qoute_bid_count'),

])



