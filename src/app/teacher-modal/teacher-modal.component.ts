import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-modal.component.html',
  styleUrls: ['./teacher-modal.component.css']
})
export class TeacherModalComponent {
  @Input() teacherForm!: FormGroup; // استقبال النموذج من المكون الرئيسي

  constructor(public activeModal: NgbActiveModal) {}

  // دالة لحفظ البيانات وإغلاق الـ Modal
  save() {
    if (this.teacherForm.valid) { // تأكد من أن النموذج صالح
      this.activeModal.close(this.teacherForm.value); // إرسال البيانات إلى المكون الرئيسي
    } else {
      console.log('النموذج غير صالح'); // يمكنك عرض رسالة خطأ هنا
    }
  }

  // دالة لإغلاق الـ Modal بدون حفظ
  close() {
    this.activeModal.dismiss();
  }

  // دالة لتحميل الصورة
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.teacherForm.patchValue({
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  }
}