import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ExamsComponent } from './exams/exams.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';

export const routes: Routes = [
    {
        path:'',
        component: HomeComponent,
    },
    {
        path:'exam',
        component:ExamsComponent
    },
    { path: 'students', component: StudentComponent },
    { path: 'students/:query', component: StudentComponent }, 
    { path: 'teachers', component: TeacherComponent },
    { path: 'teachers/:query', component: TeacherComponent }, 
];
