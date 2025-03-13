import { NgClass } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-schedule',
  imports: [NgClass],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  schedule: any[] = []; 

  constructor(private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  loadSchedule() {
    this.http.get<any>('assets/Data.json').subscribe(data => {
      this.schedule = data.schedule; 
    });
  }
  getSubjectClass(subject: string): string {
    switch (subject) {
        case 'اللغة العربية': return 'white';
        case 'اللغة الإنجليزية': return 'blue';
        case 'رياضيات': return 'red';
        default: return 'default-class';
    }
}
 
}
