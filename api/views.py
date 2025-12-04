from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Book, BorrowRecord
from .serializers import BookSerializer, BorrowRecordSerializer

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # Custom Action: Jab "Checkout" button dabaoge
    @action(detail=True, methods=['post'])
    def checkout(self, request, pk=None):
        book = self.get_object()
        borrower = request.data.get('borrower_name')

        # 1. Book ko Red karo
        book.is_borrowed = True
        book.save()

        # 2. Register mein entry karo (Nayi Table)
        BorrowRecord.objects.create(book=book, borrower_name=borrower)

        return Response({'status': 'book checked out'})

    # Custom Action: Jab "Return" button dabaoge
    @action(detail=True, methods=['post'])
    def return_book(self, request, pk=None):
        book = self.get_object()

        # 1. Book ko Green karo
        book.is_borrowed = False
        book.save()

        # 2. Register mein "Returned" mark karo
        # (Sabse recent record dhoondo jo wapas nahi aaya)
        record = BorrowRecord.objects.filter(book=book, is_returned=False).last()
        if record:
            record.is_returned = True
            record.save()

        return Response({'status': 'book returned'})

# Dashboard ke liye View (Sirf active loans dikhayega)
class BorrowRecordViewSet(viewsets.ModelViewSet):
    queryset = BorrowRecord.objects.all()
    serializer_class = BorrowRecordSerializer