import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teacher-list',
  standalone: true,
  templateUrl: './teacher-list.component.html',
  styleUrls: ['./teacher-list.component.css']
})
export class TeacherListComponent implements OnInit {
  teachers: any[] = []; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  loadTeachers() {
    this.http.get<any>('assets/Data.json').subscribe(data => {
      this.teachers = data.teachers; 
    });
  }
}