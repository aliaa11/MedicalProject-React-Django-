import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClassesListComponent} from './classes-list/classes-list.component';
import { ClassCardComponent } from './class-card/class-card.component';
import { StudentsListComponent } from './students-list/students-list.component';
import { StudentCardComponent } from './student-card/student-card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,ClassesListComponent,ClassCardComponent,StudentsListComponent,StudentCardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'shcool-system';
}
