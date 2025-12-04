from django.db import models
from datetime import timedelta, date # Date calculate karne ke liye

# Table 1: Book (Inventory)
class Book(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    # Hum status yahin rakhenge taaki color change ho sake
    is_borrowed = models.BooleanField(default=False)

    def __str__(self):
        return self.title

# Table 2: BorrowRecord (Sir ka manga hua Dashboard Data)
class BorrowRecord(models.Model):
    book = models.ForeignKey(Book, on_delete=models.CASCADE) # Kaunsi kitab?
    borrower_name = models.CharField(max_length=100)         # Kisne li?
    borrow_date = models.DateField(auto_now_add=True)        # Aaj ki date
    due_date = models.DateField(blank=True, null=True)       # 7 din baad ki date
    is_returned = models.BooleanField(default=False)         # Wapas aayi ya nahi?

    # Save karte waqt apne aap 7 din jod do
    def save(self, *args, **kwargs):
        if not self.due_date:
            self.due_date = date.today() + timedelta(days=7)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.book.title} - {self.borrower_name}"