from rest_framework import serializers
from .models import Book, BorrowRecord

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = '__all__'

class BorrowRecordSerializer(serializers.ModelSerializer):
    # Book ka naam dikhane ke liye (ID ki jagah)
    book_title = serializers.ReadOnlyField(source='book.title')

    class Meta:
        model = BorrowRecord
        fields = ['id', 'book', 'book_title', 'borrower_name', 'borrow_date', 'due_date', 'is_returned']