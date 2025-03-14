import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StudentFormComponent } from '../student-form/student-form.component';
import { ConfirmDeleteModalComponent } from '../confirm-delete-modal/confirm-delete-modal.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {
  searchQuery: string = '';
  filteredStudents: any[] = [];
  students: any[] = []; // سيتم ملؤه بالبيانات

  constructor(private fb: FormBuilder, private modalService: NgbModal) {
    this.filteredStudents = [...this.students];
  }

  openModal(student: any = null) {
    const modalRef = this.modalService.open(StudentFormComponent, {
      backdrop: 'static',
      keyboard: false,
    });

    modalRef.componentInstance.studentForm = this.fb.group({
      id: [student?.id || null],
      name: [student?.name || '', Validators.required],
      age: [student?.age || null, [Validators.required, Validators.min(5)]],
      class: [student?.class || '', Validators.required],
      guardianPhone: [student?.guardianPhone || '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      whatsapp: [student?.whatsapp || '', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      image: [student?.image || null],
    });

    modalRef.result.then(
      (result) => {
        if (result) this.save(result);
      },
      () => {}
    );
  }

  searchStudents() {
    this.filteredStudents = this.students.filter((student) =>
      student.name.includes(this.searchQuery) || student.class.includes(this.searchQuery)
    );
  }

  editStudent(student: any) {
    this.openModal(student);
  }


  deleteStudent(id: number) {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      backdrop: 'static', // يمنع الإغلاق بالضغط خارج النافذة
      keyboard: false,    // يمنع الإغلاق بزر Esc
    });
  
    modalRef.result.then(
      (confirmed) => {
        if (confirmed) {
          // تنفيذ الحذف إذا وافق المستخدم
          this.students = this.students.filter(student => student.id !== id);
          this.filteredStudents = [...this.students];
        }
      },
      () => {} // يتم تجاهل الإغلاق بدون تأكيد
    );}

  save(formData: any) {
    if (formData.id) {
      const index = this.students.findIndex((student) => student.id === formData.id);
      if (index !== -1) this.students[index] = { ...formData };
    } else {
      formData.id = this.students.length + 1;
      this.students.push({ ...formData });
    }
    this.filteredStudents = [...this.students];
  }
}
