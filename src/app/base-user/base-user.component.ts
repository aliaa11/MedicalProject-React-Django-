import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TEACHERS, STUDENTS } from '../../../public/assets/mock-data'; // استيراد البيانات الوهمية

@Component({
  selector: 'app-base-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule], // ✅ إضافة FormsModule و ReactiveFormsModule
  templateUrl: './base-user.component.html',
  styleUrls: ['./base-user.component.css']
})
export abstract class BaseUserComponent implements OnInit {
  
  userForm!: FormGroup;
  searchQuery: string = '';
  filteredUsers: any[] = [];
  users: any[] = []; // سيتم تحميلها من `mock-data.ts`

  constructor(protected fb: FormBuilder) {}

  abstract getUserType(): string; // لتحديد إذا كان المستخدم "معلم" أو "طالب"

  ngOnInit(): void {
    this.initForm();
    this.fetchUsers(); // تحميل البيانات الوهمية عند التشغيل
  }

  initForm(): void {
    this.userForm = this.fb.group({
      id: [null],
      name: ['', Validators.required],
      age: [null, [Validators.required, Validators.min(18)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]], // ✅ تعديل نمط رقم الهاتف
      email: ['', [Validators.required, Validators.email]],
      degree: ['', Validators.required],
      class: ['', Validators.required],
      image: [null]
    });
  }

  fetchUsers(): void {
    const userType = this.getUserType();
    if (userType === 'معلم') {
      this.users = TEACHERS; // تحميل بيانات المعلمين
    } else if (userType === 'طالب') {
      this.users = STUDENTS; // تحميل بيانات الطلاب
    } else {
      this.users = [];
    }
    this.filteredUsers = [...this.users]; // تحديث قائمة البحث
  }

  searchUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      user.name.includes(this.searchQuery) || user.email.includes(this.searchQuery)
    );
  }

  editUser(user: any): void {
    this.userForm.patchValue(user);
  }

  deleteUser(id: number): void {
    this.users = this.users.filter(user => user.id !== id);
    this.filteredUsers = [...this.users]; // تحديث العرض
  }

  save(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.value;

      if (formData.id) {
        // تعديل مستخدم موجود
        const index = this.users.findIndex(user => user.id === formData.id);
        if (index !== -1) this.users[index] = formData;
      } else {
        // إضافة مستخدم جديد
        formData.id = this.users.length + 1; // تعيين ID جديد
        this.users.push(formData);
      }

      this.filteredUsers = [...this.users]; // تحديث العرض
      this.close();
    }
  }

  onFileChange(event: any): void {
    // تحميل الصورة (إضافة معالجة الملفات لاحقًا)
  }

  close(): void {
    this.userForm.reset();
  }
}
