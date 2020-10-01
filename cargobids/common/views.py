from rest_framework import viewsets,filters, generics, status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_datatables.filters import DatatablesFilterBackend
from django.db.models import Q
from django.shortcuts import render, redirect

class CommonViewset(viewsets.ModelViewSet, generics.RetrieveAPIView):

    def filter_queryset(self, queryset):
        format = self.request.GET.get('format', None)
        if format == 'datatables':
            self.filter_backends += (DatatablesFilterBackend,)
        else:
            self.filter_backends += (DjangoFilterBackend,)
        for backend in list(self.filter_backends):
            queryset = backend().filter_queryset(self.request, queryset, self)
        return queryset


def user(request):
    return render(request, 'index.html')


def admin(request):
    return render(request, 'build/index.html')

def home(request):
    return redirect('user')