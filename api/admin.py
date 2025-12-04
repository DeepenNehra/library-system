from django.contrib import admin
from .models import Book, BorrowRecord

# Book Admin (Ab isme borrower_name nahi hai)
@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'is_borrowed']

# BorrowRecord Admin (Yahan hai borrower aur due dates)
@admin.register(BorrowRecord)
class BorrowRecordAdmin(admin.ModelAdmin):
    list_display = ['book', 'borrower_name', 'borrow_date', 'due_date', 'is_returned']