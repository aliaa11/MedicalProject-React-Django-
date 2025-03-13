import { Component, Input, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-class-card',
  imports: [CommonModule],
  templateUrl: './class-card.component.html',
  styleUrl: './class-card.component.css'
})
export class ClassCardComponent {
  @Input() students!: number;
  @Input() grade!: number;

  borderColor: string = this.getRandomColor(); 

  getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F4A261', '#E76F51', '#2A9D8F', '#8E44AD'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}