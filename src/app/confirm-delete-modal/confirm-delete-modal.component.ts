import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-delete-modal',
  standalone: true,
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.css'] // تأكد من أن ملف CSS مرتبط
})
export class ConfirmDeleteModalComponent {
  constructor(public activeModal: NgbActiveModal) {}

  confirm() {
    this.activeModal.close(true); // إرجاع true عند التأكيد
  }

  dismiss() {
    this.activeModal.dismiss(); // إغلاق الـ Modal بدون تأكيد
  }
}