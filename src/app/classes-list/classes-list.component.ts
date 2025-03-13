import { Component } from '@angular/core';
import { ClassCardComponent } from '../class-card/class-card.component';

@Component({
  selector: 'app-classes-list',
  imports: [ClassCardComponent],
  templateUrl: './classes-list.component.html',
  styleUrl: './classes-list.component.css'
})
export class ClassesListComponent {
  classes=[
    {students:30,grade:3},
    {students:30,grade:3},
    {students:30,grade:2},
    {students:25,grade:1},
    {students:25,grade:1},
    {students:30,grade:2},
    {students:30,grade:3},
    {students:30,grade:3}
  ];
}
