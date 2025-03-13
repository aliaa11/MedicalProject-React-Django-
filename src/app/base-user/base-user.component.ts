import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeacherModalComponent } from '../teacher-modal/teacher-modal.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-base-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './base-user.component.html',
  styleUrls: ['./base-user.component.css']
})
export class BaseUserComponent implements OnInit {
  teacherForm: FormGroup;
  teachers: any[] = [];
  filteredTeachers: any[] = []; // قائمة المعلمين بعد التصفية
  editMode: boolean = false;
  editedTeacherId: number | null = null;
  searchQuery: string = '';

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.teacherForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]], // تحقق من صحة رقم التليفون
      email: ['', [Validators.required, Validators.email]],
      image: [null],
      degree: ['', Validators.required],
      class: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadTeachers(); // تحميل البيانات عند بدء التشغيل
    this.filteredTeachers = this.teachers; // تعيين القائمة المصفاة بالبيانات الأصلية
  }

  loadTeachers() {
    const savedTeachers = localStorage.getItem('teachers');
    if (savedTeachers) {
      this.teachers = JSON.parse(savedTeachers);
      this.filteredTeachers = this.teachers; // تحديث القائمة المصفاة
    }
  }

  saveTeachers() {
    localStorage.setItem('teachers', JSON.stringify(this.teachers));
    this.filteredTeachers = this.teachers; // تحديث القائمة المصفاة
  }

  openModal() {
    const modalRef = this.modalService.open(TeacherModalComponent);
    modalRef.componentInstance.teacherForm = this.teacherForm;
  
    modalRef.result.then((result) => {
      if (result) {
        this.addTeacher(result); // استقبال البيانات من الـ Modal
      }
      this.resetEditMode(); // إعادة تعيين حالة التعديل بعد الإغلاق
    }).catch(() => {
      this.teacherForm.reset(); // إعادة تعيين النموذج عند الإغلاق بدون حفظ
      this.resetEditMode(); // إعادة تعيين حالة التعديل بعد الإغلاق
    });
  }
  
  // دالة لإعادة تعيين حالة التعديل
  resetEditMode() {
    this.editMode = false;
    this.editedTeacherId = null;
  }
  addTeacher(data: any) {
    if (this.editMode && this.editedTeacherId !== null) {
      // تعديل المعلم الموجود
      const index = this.teachers.findIndex(teacher => teacher.id === this.editedTeacherId);
      this.teachers[index] = {
        id: this.editedTeacherId,
        ...data,
        image: data.image || 'https://cdn-icons-png.flaticon.com/128/149/149071.png'
      };
      this.editMode = false;
      this.editedTeacherId = null;
    } else {
      // إضافة معلم جديد
      this.teachers.push({
        id: this.teachers.length + 1,
        ...data,
        image: data.image || 'https://cdn-icons-png.flaticon.com/128/149/149071.png'
      });
    }
    this.teacherForm.reset();
    this.saveTeachers(); // حفظ البيانات في localStorage
    this.searchTeachers(); // تحديث البحث بعد الإضافة
  }

  editTeacher(teacher: any) {
    this.editMode = true;
    this.editedTeacherId = teacher.id;
    this.teacherForm.patchValue({
      name: teacher.name,
      age: teacher.age,
      phone: teacher.phone,
      email: teacher.email,
      image: teacher.image,
      degree: teacher.degree,
      class: teacher.class
    });
    this.openModal(); // فتح الـ Modal عند التعديل
  }

  deleteTeacher(teacherId: number) {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent);
    modalRef.result.then((result) => {
      if (result) {
        // إذا تم التأكيد، قم بالحذف
        this.teachers = this.teachers.filter(teacher => teacher.id !== teacherId);
        this.saveTeachers(); // حفظ البيانات في localStorage
        this.searchTeachers(); // تحديث البحث بعد الحذف
      }
    }).catch(() => {
      // تم إلغاء الحذف
    });
  }

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

  // دالة البحث
  searchTeachers() {
    if (this.searchQuery) {
      this.filteredTeachers = this.teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || // البحث بالاسم
        teacher.email.toLowerCase().includes(this.searchQuery.toLowerCase()) // البحث بالبريد الإلكتروني
      );
    } else {
      this.filteredTeachers = this.teachers; // إذا كان حقل البحث فارغًا، عرض جميع البيانات
    }
  }
}