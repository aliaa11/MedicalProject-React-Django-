import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';

export const routes: Routes = [
  { path: '', redirectTo: '/students', pathMatch: 'full' }, // إعادة توجيه افتراضي
  { path: 'students', component: StudentComponent },
  { path: 'students/:query', component: StudentComponent }, // البحث عن الطلاب عبر الـ URL
  { path: 'teachers', component: TeacherComponent },
  { path: 'teachers/:query', component: TeacherComponent }, // البحث عن المعلمين عبر الـ URL
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
