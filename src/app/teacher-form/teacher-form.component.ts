import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-teacher-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.css'],
})
export class TeacherFormComponent {
  teacherForm: FormGroup;
  imagePreview: string = 'assets/default-avatar.png'; // الصورة الافتراضية

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: ['', [Validators.required, Validators.email]],
      degree: ['', Validators.required],
      subject: ['', Validators.required],
      image: [null], // حقل للصورة (اختياري)
    });
  }

  /** تحميل صورة المعلم */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string; // تحديث عرض الصورة
        this.teacherForm.patchValue({ image: this.imagePreview });
      };
      reader.readAsDataURL(file);
    }
  }

  /** إرسال البيانات عند الحفظ */
  onSubmit() {
    if (this.teacherForm.valid) {
      this.activeModal.close(this.teacherForm.value);
    }
  }

  /** إغلاق المودال */
  closeModal() {
    this.activeModal.dismiss();
  }
}
