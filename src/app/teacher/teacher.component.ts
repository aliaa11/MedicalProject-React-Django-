import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TeacherFormComponent } from '../teacher-form/teacher-form.component';
import { TEACHERS } from '../../../public/assets/mock-data';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']

})
export class TeacherComponent {
  searchQuery: string = '';
  filteredUsers: any[] = [];
  users: any[] = TEACHERS; // بيانات المعلمين الوهمية

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.filteredUsers = [...this.users]; // تحديث القائمة عند بدء التشغيل
  }

  openModal(user: any = null) {
    const modalRef = this.modalService.open(TeacherFormComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.teacherForm = this.fb.group({
      id: [user?.id || null],
      name: [user?.name || '', Validators.required],
      age: [user?.age || null, [Validators.required, Validators.min(18)]],
      phone: [user?.phone || '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      degree: [user?.degree || '', Validators.required],
      subject: [user?.subject || '', Validators.required],
      image: [user?.image || null],
    });

    modalRef.result.then(
      (result) => {
        if (result) this.save(result);
      },
      () => {}
    );
  }

  searchUsers() {
    this.filteredUsers = this.users.filter((user) =>
      user.name.includes(this.searchQuery) || user.email.includes(this.searchQuery)
    );
  }

  editUser(user: any) {
    this.openModal(user);
  }

  deleteTeacher(id: number) {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      backdrop: 'static',
      keyboard: false,
    });
  
    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          this.users = this.users.filter(teacher => teacher.id !== id);
          this.filteredUsers = [...this.users]; // تحديث القائمة المصفاة
        }
      },
      () => {}
    );
  }

  save(formData: any) {
    if (formData.id) {
      const index = this.users.findIndex((user) => user.id === formData.id);
      if (index !== -1) this.users[index] = { ...formData };
    } else {
      formData.id = this.users.length + 1;
      this.users.push({ ...formData });
    }
    this.filteredUsers = [...this.users];
  }
}
